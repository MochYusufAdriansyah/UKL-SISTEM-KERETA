import { HttpException, Injectable } from '@nestjs/common';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class PelangganService {
  constructor(private readonly prisma: PrismaService) { }

  private getPelangganInclude() {
    return {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    } as const;
  }

  private async findByUserId(userId: number) {
    return this.prisma.pelanggan.findFirst({
      where: { userId },
      include: this.getPelangganInclude(),
    });
  }

  async create(createPelangganDto: CreatePelangganDto) {
    try {
      if (!createPelangganDto.userId) {
        throw AppError.badRequest({
          message: 'userId wajib diisi saat admin membuat data pelanggan',
        });
      }

      const pelanggan = await this.prisma.pelanggan.create({
        data: { ...createPelangganDto, userId: createPelangganDto.userId },
        include: this.getPelangganInclude(),
      });

      if (!pelanggan) {
        throw AppError.badRequest({ message: 'Gagal membuat pelanggan' });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal membuat pelanggan' });
    }
  }

  async createForCurrentUser(
    userId: number,
    createPelangganDto: CreatePelangganDto,
  ) {
    try {
      const existingPelanggan = await this.findByUserId(userId);

      if (existingPelanggan) {
        throw AppError.conflict('Pelanggan', {
          message: 'Akun ini sudah memiliki data pelanggan',
        });
      }

      const pelanggan = await this.prisma.pelanggan.create({
        data: {
          NIK: createPelangganDto.NIK,
          nama_penumpang: createPelangganDto.nama_penumpang,
          alamat: createPelangganDto.alamat,
          telp: createPelangganDto.telp,
          userId,
        },
        include: this.getPelangganInclude(),
      });

      if (!pelanggan) {
        throw AppError.badRequest({ message: 'Gagal membuat pelanggan' });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal membuat pelanggan' });
    }
  }

  async profile(userId: number) {
    try {
      const pelanggan =
        await this.prisma.pelanggan.findFirst({
          where: {
            userId,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                role: true,
              },
            },

            pembelianTiket: {
              include: {
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
              },

              orderBy: {
                tanggal_pembelian: 'desc',
              },
            },
          },
        });

      if (!pelanggan) {
        throw AppError.notFound(
          'Pelanggan',
          {
            message:
              'Data pelanggan tidak ditemukan',
          },
        );
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        throw await prismaErrors(error);
      }

      console.log(error);

      throw AppError.internal({
        message:
          'Gagal mengambil profile pelanggan',
      });
    }
  }

  async findAll() {
    try {
      const pelanggan = await this.prisma.pelanggan.findMany({});

      if (!pelanggan) {
        throw AppError.notFound('Account', {
          message: 'Tidak bisa mengambil semua pelanggan',
        });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil data pelanggan' });
    }
  }

  async findOne(id: number) {
    try {
      const pelanggan = await this.prisma.pelanggan.findFirst({
        where: { id },
        include: this.getPelangganInclude(),
      });

      if (!pelanggan) {
        throw AppError.notFound('Account', {
          message: 'Tidak bisa mengambil pelanggan',
        });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil pelanggan' });
    }
  }

  async findCurrentUser(userId: number) {
    try {
      const pelanggan = await this.findByUserId(userId);

      if (!pelanggan) {
        throw AppError.notFound('Pelanggan', {
          message: 'Data pelanggan tidak ditemukan',
        });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengambil pelanggan' });
    }
  }

  async update(id: number, updatePelangganDto: UpdatePelangganDto) {
    try {
      const pelanggan = await this.prisma.pelanggan.update({
        where: { id },
        data: { ...updatePelangganDto },
        include: this.getPelangganInclude(),
      });

      if (!pelanggan) {
        throw AppError.badRequest({ message: 'Gagal mengupdate pelanggan' });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengupdate pelanggan' });
    }
  }

  async updateForCurrentUser(
    userId: number,
    updatePelangganDto: UpdatePelangganDto,
  ) {
    try {
      const existingPelanggan = await this.findByUserId(userId);

      if (!existingPelanggan) {
        throw AppError.notFound('Pelanggan', {
          message: 'Data pelanggan tidak ditemukan',
        });
      }

      const pelanggan = await this.prisma.pelanggan.update({
        where: { id: existingPelanggan.id },
        data: {
          NIK: updatePelangganDto.NIK,
          nama_penumpang: updatePelangganDto.nama_penumpang,
          alamat: updatePelangganDto.alamat,
          telp: updatePelangganDto.telp,
        },
        include: this.getPelangganInclude(),
      });

      if (!pelanggan) {
        throw AppError.badRequest({ message: 'Gagal mengupdate pelanggan' });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal mengupdate pelanggan' });
    }
  }

  async remove(id: number) {
    try {
      const pelanggan = await this.prisma.pelanggan.delete({ where: { id } });

      if (!pelanggan) {
        throw AppError.notFound('Account', {
          message: 'Tidak dapat menemukan pelanggan',
        });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal menghapus pelanggan' });
    }
  }

  async removeForCurrentUser(userId: number) {
    try {
      const existingPelanggan = await this.findByUserId(userId);

      if (!existingPelanggan) {
        throw AppError.notFound('Pelanggan', {
          message: 'Tidak dapat menemukan pelanggan',
        });
      }

      const pelanggan = await this.prisma.pelanggan.delete({
        where: { id: existingPelanggan.id },
      });

      if (!pelanggan) {
        throw AppError.notFound('Account', {
          message: 'Tidak dapat menemukan pelanggan',
        });
      }

      return pelanggan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
      throw AppError.internal({ message: 'Gagal menghapus pelanggan' });
    }
  }
}
