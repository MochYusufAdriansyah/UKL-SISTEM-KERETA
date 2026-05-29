import { HttpException, Injectable } from '@nestjs/common';
import { CreateKeretaDto } from './dto/create-kereta.dto';
import { UpdateKeretaDto } from './dto/update-kereta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class KeretaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKeretaDto: CreateKeretaDto) {
    try {
      const kereta = await this.prisma.kereta.create({
        data: { ...createKeretaDto },
      });

      if (!kereta) {
        throw AppError.badRequest({ message: 'Gagal menambahkan data kereta' });
      }

      return kereta;
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
      const kereta = await this.prisma.kereta.findMany();

      if (!kereta) {
        throw AppError.notFound('Train', {
          message: 'Gagal mengambil semua data kereta',
        });
      }

      return kereta;
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
      const kereta = await this.prisma.kereta.findFirst({ where: { id } });

      if (!kereta) {
        throw AppError.notFound('Train', {
          message: 'Gagal mengambil data kereta',
        });
      }

      return kereta;
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

  async update(id: number, updateKeretaDto: UpdateKeretaDto) {
    try {
      const kereta = await this.prisma.kereta.update({
        where: { id },
        data: { ...updateKeretaDto },
      });

      if (!kereta) {
        throw AppError.badRequest({ message: 'Gagal mengupate data kereta' });
      }

      return kereta;
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
      const kereta = await this.prisma.kereta.delete({ where: { id } });

      if (!kereta) {
        throw AppError.notFound('Train', {
          message: 'Gagal menemukan data kerete',
        });
      }

      return kereta;
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
