import { HttpException, Injectable } from '@nestjs/common';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class JadwalService {
  constructor(private readonly prisma: PrismaService) {}

  private buildTanggalFilter(tanggal?: string) {
    if (!tanggal) {
      return undefined;
    }

    const start = new Date(`${tanggal}T00:00:00`);
    if (Number.isNaN(start.getTime())) {
      throw AppError.badRequest({ message: 'Format tanggal tidak valid' });
    }

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return {
      gte: start,
      lt: end,
    };
  }

  async create(createJadwalDto: CreateJadwalDto) {
    try {
      const jadwal = await this.prisma.jadwal.create({
        data: {
          ...createJadwalDto,
          tanggal_berangkat: new Date(createJadwalDto.tanggal_berangkat),
          tanggal_kedatangan: new Date(createJadwalDto.tanggal_kedatangan),
        },
        include: {
          kereta: true,
        },
      });

      if (!jadwal) {
        throw AppError.badRequest({ message: 'Gagal membuat jadwal' });
      }

      return jadwal;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal membuat jadwal' });
    }
  }

  async findAll(filters?: {
    asal?: string;
    tujuan?: string;
    kelas?: string;
    tanggal?: string;
  }) {
    try {
      const jadwal = await this.prisma.jadwal.findMany({
        where: {
          asal_keberangkatan: filters?.asal
            ? { contains: filters.asal }
            : undefined,
          tujuan_keberangkatan: filters?.tujuan
            ? { contains: filters.tujuan }
            : undefined,
          tanggal_berangkat: this.buildTanggalFilter(filters?.tanggal),
          kereta: filters?.kelas
            ? {
                kelas: {
                  contains: filters.kelas,
                },
              }
            : undefined,
        },
        orderBy: { tanggal_berangkat: 'asc' },
        include: {
          kereta: {
            include: {
              gerbong: {
                include: {
                  _count: {
                    select: {
                      kursi: true,
                    },
                  },
                },
              },
            },
          },
          pembelianTiket: {
            include: {
              _count: {
                select: {
                  detailPembelian: true,
                },
              },
            },
          },
        },
      });

      return jadwal.map(({ pembelianTiket, kereta, ...item }) => {
        const totalKursi = kereta.gerbong.reduce(
          (total, gerbong) => total + gerbong._count.kursi,
          0,
        );
        const kursiTerisi = pembelianTiket.reduce(
          (total, tiket) => total + tiket._count.detailPembelian,
          0,
        );

        return {
          ...item,
          kereta: {
            id: kereta.id,
            nama_kereta: kereta.nama_kereta,
            deskripsi: kereta.deskripsi,
            kelas: kereta.kelas,
          },
          total_kursi: totalKursi,
          kursi_tersedia: totalKursi - kursiTerisi,
        };
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil jadwal' });
    }
  }

  async findOne(id: number) {
    try {
      const jadwal = await this.prisma.jadwal.findFirst({
        where: { id },
        include: {
          kereta: {
            include: {
              gerbong: {
                include: {
                  kursi: {
                    orderBy: { no_kursi: 'asc' },
                  },
                },
                orderBy: { nama_gerbong: 'asc' },
              },
            },
          },
          pembelianTiket: {
            include: {
              detailPembelian: {
                select: {
                  kursiId: true,
                },
              },
            },
          },
        },
      });

      if (!jadwal) {
        throw AppError.notFound('Jadwal', {
          message: 'Jadwal tidak ditemukan',
        });
      }

      const kursiTerjual = new Set(
        jadwal.pembelianTiket.flatMap((tiket) =>
          tiket.detailPembelian.map((detail) => detail.kursiId),
        ),
      );

      return {
        id: jadwal.id,
        asal_keberangkatan: jadwal.asal_keberangkatan,
        tujuan_keberangkatan: jadwal.tujuan_keberangkatan,
        tanggal_berangkat: jadwal.tanggal_berangkat,
        tanggal_kedatangan: jadwal.tanggal_kedatangan,
        harga: jadwal.harga,
        kereta: {
          id: jadwal.kereta.id,
          nama_kereta: jadwal.kereta.nama_kereta,
          deskripsi: jadwal.kereta.deskripsi,
          kelas: jadwal.kereta.kelas,
          gerbong: jadwal.kereta.gerbong.map((gerbong) => ({
            id: gerbong.id,
            nama_gerbong: gerbong.nama_gerbong,
            kuota: gerbong.kuota,
            kursi: gerbong.kursi.map((kursi) => ({
              id: kursi.id,
              no_kursi: kursi.no_kursi,
              tersedia: !kursiTerjual.has(kursi.id),
            })),
          })),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil detail jadwal' });
    }
  }

  async update(id: number, updateJadwalDto: UpdateJadwalDto) {
    try {
      const jadwal = await this.prisma.jadwal.update({
        where: { id },
        data: {
          ...updateJadwalDto,
          tanggal_berangkat: updateJadwalDto.tanggal_berangkat
            ? new Date(updateJadwalDto.tanggal_berangkat)
            : undefined,
          tanggal_kedatangan: updateJadwalDto.tanggal_kedatangan
            ? new Date(updateJadwalDto.tanggal_kedatangan)
            : undefined,
        },
        include: {
          kereta: true,
        },
      });

      if (!jadwal) {
        throw AppError.badRequest({ message: 'Gagal mengupdate jadwal' });
      }

      return jadwal;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengupdate jadwal' });
    }
  }

  async remove(id: number) {
    try {
      const jadwal = await this.prisma.jadwal.delete({
        where: { id },
      });

      if (!jadwal) {
        throw AppError.notFound('Jadwal', {
          message: 'Jadwal tidak ditemukan',
        });
      }

      return jadwal;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal menghapus jadwal' });
    }
  }
}
