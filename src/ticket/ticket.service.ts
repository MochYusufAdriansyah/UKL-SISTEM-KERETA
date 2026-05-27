import { HttpException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  private getTicketInclude() {
    return {
      pelanggan: true,
      jadwal: {
        include: {
          kereta: true,
        },
      },
      detailPembelian: {
        include: {
          kursi: {
            include: {
              gerbong: true,
            },
          },
        },
      },
    } as const;
  }

  private serializeTicket(
    ticket: Prisma.PembelianTiketGetPayload<{
      include: ReturnType<TicketService['getTicketInclude']>;
    }>,
  ) {
    return {
      ...ticket,
      total_penumpang: ticket.detailPembelian.length,
      total_harga: ticket.detailPembelian.length * ticket.jadwal.harga,
    };
  }

  private buildPeriodeFilter(tanggal?: string, bulan?: string, tahun?: string) {
    if (tanggal) {
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

    if (!bulan) {
      return undefined;
    }

    const month = Number(bulan);
    const year = Number(tahun ?? new Date().getFullYear());

    if (
      Number.isNaN(month) ||
      Number.isNaN(year) ||
      month < 1 ||
      month > 12 ||
      year < 2000
    ) {
      throw AppError.badRequest({ message: 'Periode bulan/tahun tidak valid' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    return {
      gte: start,
      lt: end,
    };
  }

  private async findPelangganByUserId(userId: number) {
    const pelanggan = await this.prisma.pelanggan.findFirst({
      where: { userId },
    });

    if (!pelanggan) {
      throw AppError.unprocessable({
        message: 'Lengkapi data pelanggan terlebih dahulu sebelum memesan tiket',
      });
    }

    return pelanggan;
  }

  private async validateSeatSelection(
    jadwalId: number,
    kursiIds: number[],
    excludePembelianTiketId?: number,
  ) {
    const jadwal = await this.prisma.jadwal.findFirst({
      where: { id: jadwalId },
      include: {
        kereta: {
          include: {
            gerbong: {
              include: {
                kursi: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!jadwal) {
      throw AppError.notFound('Jadwal', {
        message: 'Jadwal keberangkatan tidak ditemukan',
      });
    }

    const uniqueSeatIds = [...new Set(kursiIds)];
    if (uniqueSeatIds.length !== kursiIds.length) {
      throw AppError.badRequest({
        message: 'Setiap penumpang harus memilih kursi yang berbeda',
      });
    }

    const allowedSeatIds = new Set(
      jadwal.kereta.gerbong.flatMap((gerbong) =>
        gerbong.kursi.map((kursi) => kursi.id),
      ),
    );

    const invalidSeatIds = uniqueSeatIds.filter((seatId) => !allowedSeatIds.has(seatId));
    if (invalidSeatIds.length > 0) {
      throw AppError.badRequest({
        message: 'Ada kursi yang tidak sesuai dengan jadwal atau kereta yang dipilih',
        details: { invalidSeatIds },
      });
    }

    const kursiTerpakai = await this.prisma.detailPembelian.findMany({
      where: {
        kursiId: { in: uniqueSeatIds },
        pembelianTiket: {
          is: {
            jadwalId,
            id: excludePembelianTiketId
              ? { not: excludePembelianTiketId }
              : undefined,
          },
        },
      },
      select: { kursiId: true },
    });

    if (kursiTerpakai.length > 0) {
      throw AppError.conflict('Kursi', {
        message: 'Sebagian kursi sudah dipesan pada jadwal ini',
        details: {
          kursiId: kursiTerpakai.map((kursi) => kursi.kursiId),
        },
      });
    }

    return jadwal;
  }

  private async findTicketById(id: number) {
    const tiket = await this.prisma.pembelianTiket.findFirst({
      where: { id },
      include: this.getTicketInclude(),
    });

    if (!tiket) {
      throw AppError.notFound('Ticket', {
        message: 'Tiket tidak ditemukan',
      });
    }

    return tiket;
  }

  private async findOwnedTicketById(id: number, userId: number) {
    const tiket = await this.prisma.pembelianTiket.findFirst({
      where: {
        id,
        pelanggan: {
          is: {
            userId,
          },
        },
      },
      include: this.getTicketInclude(),
    });

    if (!tiket) {
      throw AppError.notFound('Ticket', {
        message: 'Tiket tidak ditemukan',
      });
    }

    return tiket;
  }

  async create(userId: number, createTicketDto: CreateTicketDto) {
    try {
      const pelanggan = await this.findPelangganByUserId(userId);
      await this.validateSeatSelection(
        createTicketDto.jadwalId,
        createTicketDto.penumpang.map((item) => item.kursiId),
      );

      const tiket = await this.prisma.$transaction((tx) =>
        tx.pembelianTiket.create({
          data: {
            pelangganId: pelanggan.id,
            jadwalId: createTicketDto.jadwalId,
            detailPembelian: {
              create: createTicketDto.penumpang.map((item) => ({
                NIK: item.NIK,
                nama_penumpang: item.nama_penumpang,
                kursiId: item.kursiId,
              })),
            },
          },
          include: this.getTicketInclude(),
        }),
      );

      if (!tiket) {
        throw AppError.badRequest({ message: 'Gagal memesan tiket' });
      }

      return this.serializeTicket(tiket);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal memesan tiket' });
    }
  }

  async findAll(filters?: {
    tanggal?: string;
    bulan?: string;
    tahun?: string;
    pelangganId?: string;
  }) {
    try {
      const pelangganId = filters?.pelangganId
        ? Number(filters.pelangganId)
        : undefined;
      if (filters?.pelangganId && Number.isNaN(pelangganId)) {
        throw AppError.badRequest({ message: 'pelangganId harus berupa angka' });
      }

      const tiket = await this.prisma.pembelianTiket.findMany({
        where: {
          pelangganId,
          tanggal_pembelian: this.buildPeriodeFilter(
            filters?.tanggal,
            filters?.bulan,
            filters?.tahun,
          ),
        },
        include: this.getTicketInclude(),
        orderBy: {
          tanggal_pembelian: 'desc',
        },
      });

      return tiket.map((item) => this.serializeTicket(item));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil histori tiket' });
    }
  }

  async findMine(
    userId: number,
    filters?: {
      tanggal?: string;
      bulan?: string;
      tahun?: string;
    },
  ) {
    try {
      const pelanggan = await this.findPelangganByUserId(userId);

      const tiket = await this.prisma.pembelianTiket.findMany({
        where: {
          pelangganId: pelanggan.id,
          tanggal_pembelian: this.buildPeriodeFilter(
            filters?.tanggal,
            filters?.bulan,
            filters?.tahun,
          ),
        },
        include: this.getTicketInclude(),
        orderBy: {
          tanggal_pembelian: 'desc',
        },
      });

      return tiket.map((item) => this.serializeTicket(item));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({
        message: 'Gagal mengambil histori pemesanan tiket',
      });
    }
  }

  async findOne(id: number) {
    try {
      const tiket = await this.findTicketById(id);

      return this.serializeTicket(tiket);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil detail tiket' });
    }
  }

  async findMineOne(id: number, userId: number) {
    try {
      const tiket = await this.findOwnedTicketById(id, userId);

      return this.serializeTicket(tiket);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil detail tiket' });
    }
  }

  async getReceipt(id: number) {
    try {
      const tiket = await this.findTicketById(id);

      return {
        id: tiket.id,
        tanggal_pembelian: tiket.tanggal_pembelian,
        pemesan: {
          id: tiket.pelanggan.id,
          NIK: tiket.pelanggan.NIK,
          nama_penumpang: tiket.pelanggan.nama_penumpang,
          alamat: tiket.pelanggan.alamat,
          telp: tiket.pelanggan.telp,
        },
        jadwal: {
          id: tiket.jadwal.id,
          asal_keberangkatan: tiket.jadwal.asal_keberangkatan,
          tujuan_keberangkatan: tiket.jadwal.tujuan_keberangkatan,
          tanggal_berangkat: tiket.jadwal.tanggal_berangkat,
          tanggal_kedatangan: tiket.jadwal.tanggal_kedatangan,
          harga: tiket.jadwal.harga,
          kereta: tiket.jadwal.kereta,
        },
        penumpang: tiket.detailPembelian.map((detail) => ({
          id: detail.id,
          NIK: detail.NIK,
          nama_penumpang: detail.nama_penumpang,
          kursi: {
            id: detail.kursi.id,
            no_kursi: detail.kursi.no_kursi,
            gerbong: {
              id: detail.kursi.gerbong.id,
              nama_gerbong: detail.kursi.gerbong.nama_gerbong,
            },
          },
        })),
        total_penumpang: tiket.detailPembelian.length,
        total_harga: tiket.detailPembelian.length * tiket.jadwal.harga,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal menyiapkan nota tiket' });
    }
  }

  async getMyReceipt(id: number, userId: number) {
    try {
      const tiket = await this.findOwnedTicketById(id, userId);

      return {
        id: tiket.id,
        tanggal_pembelian: tiket.tanggal_pembelian,
        pemesan: {
          id: tiket.pelanggan.id,
          NIK: tiket.pelanggan.NIK,
          nama_penumpang: tiket.pelanggan.nama_penumpang,
          alamat: tiket.pelanggan.alamat,
          telp: tiket.pelanggan.telp,
        },
        jadwal: {
          id: tiket.jadwal.id,
          asal_keberangkatan: tiket.jadwal.asal_keberangkatan,
          tujuan_keberangkatan: tiket.jadwal.tujuan_keberangkatan,
          tanggal_berangkat: tiket.jadwal.tanggal_berangkat,
          tanggal_kedatangan: tiket.jadwal.tanggal_kedatangan,
          harga: tiket.jadwal.harga,
          kereta: tiket.jadwal.kereta,
        },
        penumpang: tiket.detailPembelian.map((detail) => ({
          id: detail.id,
          NIK: detail.NIK,
          nama_penumpang: detail.nama_penumpang,
          kursi: {
            id: detail.kursi.id,
            no_kursi: detail.kursi.no_kursi,
            gerbong: {
              id: detail.kursi.gerbong.id,
              nama_gerbong: detail.kursi.gerbong.nama_gerbong,
            },
          },
        })),
        total_penumpang: tiket.detailPembelian.length,
        total_harga: tiket.detailPembelian.length * tiket.jadwal.harga,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal menyiapkan nota tiket' });
    }
  }

  async getMonthlyRevenue(bulan?: string, tahun?: string) {
    try {
      const filter = this.buildPeriodeFilter(undefined, bulan, tahun);
      const start = filter?.gte ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const month = start.getMonth() + 1;
      const year = start.getFullYear();

      const tiket = await this.prisma.pembelianTiket.findMany({
        where: {
          tanggal_pembelian: filter,
        },
        include: {
          jadwal: true,
          detailPembelian: true,
        },
      });

      const totalPenumpang = tiket.reduce(
        (total, item) => total + item.detailPembelian.length,
        0,
      );
      const totalPemasukan = tiket.reduce(
        (total, item) => total + item.detailPembelian.length * item.jadwal.harga,
        0,
      );

      return {
        bulan: month,
        tahun: year,
        total_transaksi: tiket.length,
        total_penumpang: totalPenumpang,
        total_pemasukan: totalPemasukan,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil rekap pemasukan' });
    }
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    if (updateTicketDto.jadwalId === undefined) {
      throw AppError.badRequest({
        message: 'Perubahan tiket minimal harus menyertakan jadwal baru',
      });
    }

    try {
      const existingTicket = await this.prisma.pembelianTiket.findFirst({
        where: { id },
        include: {
          detailPembelian: {
            select: {
              kursiId: true,
            },
          },
        },
      });

      if (!existingTicket) {
        throw AppError.notFound('Ticket', {
          message: 'Tiket tidak ditemukan',
        });
      }

      await this.validateSeatSelection(
        updateTicketDto.jadwalId,
        existingTicket.detailPembelian.map((item) => item.kursiId),
        id,
      );

      const tiket = await this.prisma.pembelianTiket.update({
        where: { id },
        data: { jadwalId: updateTicketDto.jadwalId },
        include: this.getTicketInclude(),
      });

      if (!tiket) {
        throw AppError.badRequest({
          message: 'Gagal mengupdate pesanan tiket',
        });
      }

      return this.serializeTicket(tiket);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengupdate pesanan tiket' });
    }
  }

  async remove(id: number) {
    try {
      await this.findTicketById(id);

      const tiket = await this.prisma.pembelianTiket.delete({ where: { id } });

      if (!tiket) {
        throw AppError.notFound('Ticket', {
          message: 'Gagal membatalkan tiket pesanan',
        });
      }

      return tiket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal membatalkan tiket' });
    }
  }

  async removeMine(id: number, userId: number) {
    try {
      await this.findOwnedTicketById(id, userId);

      const tiket = await this.prisma.pembelianTiket.delete({ where: { id } });

      if (!tiket) {
        throw AppError.notFound('Ticket', {
          message: 'Gagal membatalkan tiket pesanan',
        });
      }

      return tiket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal membatalkan tiket' });
    }
  }
}
