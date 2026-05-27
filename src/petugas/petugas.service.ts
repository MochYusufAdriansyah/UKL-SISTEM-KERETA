import { HttpException, Injectable } from '@nestjs/common';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { Prisma } from 'generated/prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class PetugasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPetugasDto: CreatePetugasDto) {
    try {
      const petugas = await this.prisma.petugas.create({
        data: { ...createPetugasDto },
      });

      if (!petugas) {
        throw AppError.badRequest({ message: 'Gagal membuat petugas' });
      }

      return petugas;
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
      const petugas = await this.prisma.petugas.findMany();

      if (!petugas) {
        throw AppError.notFound('Account', {
          message: 'Tidak bisa mengambil semua petugas',
        });
      }

      return petugas;
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
      const petugas = await this.prisma.petugas.findFirst({ where: { id } });

      if (!petugas) {
        throw AppError.notFound('Account', {
          message: 'Tidak bisa mengambil petugas',
        });
      }

      return petugas;
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

  async update(id: number, updatePetugasDto: UpdatePetugasDto) {
    try {
      const petugas = await this.prisma.petugas.update({
        where: { id },
        data: { ...updatePetugasDto },
      });

      if (!petugas) {
        throw AppError.badRequest({ message: 'Gagal mengupdate petugas' });
      }

      return petugas;
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
      const petugas = await this.prisma.petugas.delete({ where: { id } });

      if (!petugas) {
        throw AppError.notFound('Account', {
          message: 'Tidak dapat menemukan petugas',
        });
      }

      return petugas;
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
