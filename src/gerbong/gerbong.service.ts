import { HttpException, Injectable } from '@nestjs/common';
import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';
import { AppError } from 'src/utils/app-error.utils';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GerbongService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGerbongDto: CreateGerbongDto) {
    try {
      const gerbong = await this.prisma.gerbong.create({
        data: { ...createGerbongDto },
      });

      if (!gerbong) {
        throw AppError.badRequest({
          message: 'Gagal menambahkan data gerbong',
        });
      }

      return gerbong;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
    }
  }

  async generateKursi(id: number) {
  try {
    const gerbong = await this.prisma.gerbong.findUnique({
      where: { id },
    });

    if (!gerbong) {
      throw AppError.notFound('Gerbong', {
        message: 'Gerbong tidak ditemukan',
      });
    }

    const existingSeats =
      await this.prisma.kursi.count({
        where: {
          gerbongId: id,
        },
      });

    if (existingSeats > 0) {
      throw AppError.badRequest({
        message:
          'Kursi untuk gerbong ini sudah dibuat',
      });
    }

    const prefix =
      gerbong.nama_gerbong
        .replace('Gerbong', '')
        .trim()
        .charAt(0)
        .toUpperCase();

    const kursi = [];

    for (
      let i = 1;
      i <= gerbong.kuota;
      i++
    ) {
      kursi.push({
        no_kursi: `${prefix}${i}`,
        gerbongId: gerbong.id,
      });
    }

    await this.prisma.kursi.createMany({
      data: kursi,
    });

    return {
      message:
        'Kursi berhasil dibuat',
      total: kursi.length,
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

    console.log(error);
  }
}

  async findAll() {
    try {
      const gerbong = await this.prisma.gerbong.findMany();

      if (!gerbong) {
        throw AppError.notFound('Gerbong', {
          message: 'Gagal mengambil semua data gerbong',
        });
      }

      return gerbong;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
    }
  }

  async findOne(id: number) {
    try {
      const gerbong = await this.prisma.gerbong.findFirst({ where: { id } });

      if (!gerbong) {
        throw AppError.notFound('Gerbong', {
          message: 'Gagal mengambil data gerbong',
        });
      }

      return gerbong;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
    }
  }

  async update(id: number, updateGerbongDto: UpdateGerbongDto) {
    try {
      const gerbong = await this.prisma.gerbong.update({
        where: { id },
        data: { ...updateGerbongDto },
      });

      if (!gerbong) {
        throw AppError.badRequest({ message: 'Gagal mengupdate data gerbong' });
      }

      return gerbong;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const gerbong = await this.prisma.gerbong.delete({ where: { id } });

      if (!gerbong) {
        throw AppError.notFound('Gerbong', {
          message: 'gerbong tidak ditemukan',
        });
      }

      return gerbong;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.log(error);
    }
  }
}
