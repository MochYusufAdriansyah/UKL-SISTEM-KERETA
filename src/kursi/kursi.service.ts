import { HttpException, Injectable } from '@nestjs/common';
import { CreateKursiDto } from './dto/create-kursi.dto';
import { UpdateKursiDto } from './dto/update-kursi.dto';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class KursiService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKursiDto: CreateKursiDto) {
    try {
      const kursi = await this.prisma.kursi.create({
        data: { ...createKursiDto },
      });

      if (!kursi) {
        throw AppError.badRequest({ message: 'Gagal membuat data kursi' });
      }

      return kursi;
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
      const kursi = await this.prisma.kursi.findMany();

      if (!kursi) {
        throw AppError.notFound('Chair', {
          message: 'Gagal mengambil semua data kursi',
        });
      }

      return kursi;
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
      const kursi = await this.prisma.kursi.findFirst({ where: { id } });

      if (!kursi) {
        throw AppError.notFound('Chair', {
          message: 'Gagal menemukan data kursi',
        });
      }

      return kursi;
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

  async update(id: number, updateKursiDto: UpdateKursiDto) {
    try {
      const kursi = await this.prisma.kursi.update({
        where: { id },
        data: { ...updateKursiDto },
      });

      if (!kursi) {
        throw AppError.badRequest({
          message: 'Gagal mengupdate data kelompok',
        });
      }

      return kursi;
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
      const kursi = await this.prisma.kursi.delete({ where: { id } });

      if (!kursi) {
        throw AppError.notFound('Chair', {
          message: 'Gagal menghapus data kursi',
        });
      }

      return kursi;
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
