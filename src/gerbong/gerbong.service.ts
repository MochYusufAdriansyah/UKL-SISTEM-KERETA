import { HttpException, Injectable } from '@nestjs/common';
import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';
import { AppError } from 'src/utils/app-error.utils';
import { Prisma } from 'generated/prisma/client';
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
