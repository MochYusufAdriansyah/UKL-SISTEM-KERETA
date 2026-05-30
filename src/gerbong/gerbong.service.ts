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
      return await this.prisma.gerbong.create({
        data: createGerbongDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.error(error);
      throw AppError.badRequest({ message: 'Gagal menambahkan data gerbong' });
    }
  }

  async generateKursi(id: number) {
    try {
      const gerbong = await this.prisma.gerbong.findUnique({ where: { id } });
      if (!gerbong) {
        throw AppError.notFound('Gerbong', { message: 'Gerbong tidak ditemukan' });
      }

      const existingSeats = await this.prisma.kursi.count({ where: { gerbongId: id } });
      if (existingSeats > 0) {
        throw AppError.badRequest({ message: 'Kursi untuk gerbong ini sudah dibuat' });
      }

      const prefix = gerbong.nama_gerbong.replace('Gerbong', '').trim().charAt(0).toUpperCase();
      const kursi = Array.from({ length: gerbong.kuota }, (_, i) => ({
        no_kursi: `${prefix}${i + 1}`,
        gerbongId: gerbong.id,
      }));

      await this.prisma.kursi.createMany({ data: kursi });

      return { message: 'Kursi berhasil dibuat', total: kursi.length };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.error(error);
      throw AppError.badRequest({ message: 'Gagal membuat kursi' });
    }
  }

  async findAll() {
    try {
      return await this.prisma.gerbong.findMany();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.error(error);
      throw AppError.badRequest({ message: 'Gagal mengambil semua data gerbong' });
    }
  }

  async findOne(id: number) {
    try {
      const gerbong = await this.prisma.gerbong.findUnique({ where: { id } });
      if (!gerbong) {
        throw AppError.notFound('Gerbong', { message: 'Gagal mengambil data gerbong' });
      }
      return gerbong;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.error(error);
      throw AppError.badRequest({ message: 'Error mengambil data gerbong' });
    }
  }

  async update(id: number, updateGerbongDto: UpdateGerbongDto) {
    try {
      return await this.prisma.gerbong.update({
        where: { id },
        data: updateGerbongDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.error(error);
      throw AppError.badRequest({ message: 'Gagal mengupdate data gerbong' });
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.gerbong.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }
      console.error(error);
      throw AppError.notFound('Gerbong', { message: 'Gerbong tidak ditemukan' });
    }
  }
}
