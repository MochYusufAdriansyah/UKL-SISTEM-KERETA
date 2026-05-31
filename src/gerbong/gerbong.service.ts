import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';

import { AppError } from 'src/utils/app-error.utils';
import { prismaErrors } from 'src/utils/prisma-error.utils';

@Injectable()
export class GerbongService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createGerbongDto: CreateGerbongDto,
  ) {
    try {
      return await this.prisma.gerbong.create({
        data: createGerbongDto,
      });
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

      console.error(error);

      throw AppError.badRequest({
        message:
          'Gagal menambahkan data gerbong',
      });
    }
  }

  async generateKursi(id: number) {
  try {
    const gerbong =
      await this.prisma.gerbong.findUnique({
        where: { id },
      })

    if (!gerbong) {
      throw AppError.notFound(
        'Gerbong',
        {
          message:
            'Gerbong tidak ditemukan',
        },
      )
    }

    const existingSeats =
      await this.prisma.kursi.count({
        where: {
          gerbongId: id,
        },
      })

    if (existingSeats > 0) {
      throw AppError.badRequest({
        message:
          'Kursi untuk gerbong ini sudah dibuat',
      })
    }

    const letters = [
      'A',
      'B',
      'C',
      'D',
    ]

    const kursi: {
      no_kursi: string
      gerbongId: number
    }[] = []

    let totalSeat = 0

    const rows = Math.ceil(
      gerbong.kuota / 4,
    )

    for (
      let row = 1;
      row <= rows;
      row++
    ) {
      for (const letter of letters) {
        if (
          totalSeat >=
          gerbong.kuota
        ) {
          break
        }

        kursi.push({
          no_kursi: `${row}${letter}`,
          gerbongId: gerbong.id,
        })

        totalSeat++
      }
    }

    await this.prisma.kursi.createMany({
      data: kursi,
    })

    return {
      success: true,
      message:
        'Kursi berhasil dibuat',
      total_kursi:
        kursi.length,
      data: kursi,
    }
  } catch (error) {
    if (
      error instanceof HttpException
    ) {
      throw error
    }

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      throw await prismaErrors(error)
    }

    console.error(error)

    throw AppError.badRequest({
      message:
        'Gagal membuat kursi',
    })
  }
}

  async findAll() {
    try {
      const gerbong =
        await this.prisma.gerbong.findMany({
          include: {
            kereta: true,
            kursi: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

      return gerbong.map((item) => ({
        ...item,
        total_kursi:
          item.kursi.length,
      }));
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

      console.error(error);

      throw AppError.badRequest({
        message:
          'Gagal mengambil data gerbong',
      });
    }
  }

  async findOne(id: number) {
    try {
      const gerbong =
        await this.prisma.gerbong.findUnique({
          where: { id },
          include: {
            kereta: true,
            kursi: true,
          },
        });

      if (!gerbong) {
        throw AppError.notFound(
          'Gerbong',
          {
            message:
              'Gerbong tidak ditemukan',
          },
        );
      }

      return {
        ...gerbong,
        total_kursi:
          gerbong.kursi.length,
      };
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

      console.error(error);

      throw AppError.badRequest({
        message:
          'Gagal mengambil data gerbong',
      });
    }
  }

  async update(
    id: number,
    updateGerbongDto: UpdateGerbongDto,
  ) {
    try {
      return await this.prisma.gerbong.update({
        where: { id },
        data: updateGerbongDto,
      });
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

      console.error(error);

      throw AppError.badRequest({
        message:
          'Gagal mengupdate data gerbong',
      });
    }
  }

  async remove(id: number) {
    try {
      const gerbong =
        await this.prisma.gerbong.findUnique({
          where: { id },
          include: {
            kursi: {
              include: {
                detailPembelian: true,
              },
            },
          },
        });

      if (!gerbong) {
        throw AppError.notFound(
          'Gerbong',
          {
            message:
              'Gerbong tidak ditemukan',
          },
        );
      }

      const sudahDipakai =
        gerbong.kursi.some(
          (kursi) =>
            kursi
              .detailPembelian
              .length > 0,
        );

      if (sudahDipakai) {
        throw AppError.badRequest({
          message:
            'Gerbong tidak dapat dihapus karena sudah digunakan dalam transaksi tiket',
        });
      }

      await this.prisma.$transaction([
        this.prisma.kursi.deleteMany({
          where: {
            gerbongId: id,
          },
        }),

        this.prisma.gerbong.delete({
          where: { id },
        }),
      ]);

      return {
        message:
          'Gerbong berhasil dihapus',
      };
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

      console.error(error);

      throw AppError.badRequest({
        message:
          'Gagal menghapus gerbong',
      });
    }
  }
}