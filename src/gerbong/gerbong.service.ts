import { HttpException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateGerbongDto } from './dto/create-gerbong.dto'
import { UpdateGerbongDto } from './dto/update-gerbong.dto'

import { AppError } from 'src/utils/app-error.utils'
import { prismaErrors } from 'src/utils/prisma-error.utils'

@Injectable()
export class GerbongService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createGerbongDto: CreateGerbongDto,
  ) {
    try {
      const gerbong =
        await this.prisma.gerbong.create({
          data: createGerbongDto,
        })

      return gerbong
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

      console.log(error)

      throw AppError.internal({
        message:
          'Gagal menambahkan gerbong',
      })
    }
  }

  async generateKursi(id: number) {
    try {
      const gerbong =
        await this.prisma.gerbong.findUnique(
          {
            where: { id },
          },
        )

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
            'Kursi sudah pernah dibuat',
        })
      }

      const prefix =
        gerbong.nama_gerbong
          .replace('Gerbong', '')
          .trim()
          .charAt(0)
          .toUpperCase()

      const kursi = []

      for (
        let i = 1;
        i <= gerbong.kuota;
        i++
      ) {
        kursi.push({
          no_kursi: `${prefix}${i}`,
          gerbongId: gerbong.id,
        })
      }

      await this.prisma.kursi.createMany({
        data: kursi,
      })

      return {
        message:
          'Kursi berhasil dibuat',
        total: kursi.length,
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

      console.log(error)

      throw AppError.internal({
        message:
          'Gagal generate kursi',
      })
    }
  }

  async findAll() {
    try {
      return await this.prisma.gerbong.findMany(
        {
          include: {
            kereta: true,
            kursi: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      )
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

      console.log(error)

      throw AppError.internal({
        message:
          'Gagal mengambil data gerbong',
      })
    }
  }

  async findOne(id: number) {
    try {
      const gerbong =
        await this.prisma.gerbong.findUnique(
          {
            where: { id },
            include: {
              kereta: true,
              kursi: true,
            },
          },
        )

      if (!gerbong) {
        throw AppError.notFound(
          'Gerbong',
          {
            message:
              'Gerbong tidak ditemukan',
          },
        )
      }

      return gerbong
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

      console.log(error)

      throw AppError.internal({
        message:
          'Gagal mengambil detail gerbong',
      })
    }
  }

  async update(
    id: number,
    updateGerbongDto: UpdateGerbongDto,
  ) {
    try {
      const gerbong =
        await this.prisma.gerbong.update({
          where: { id },
          data: updateGerbongDto,
        })

      return gerbong
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

      console.log(error)

      throw AppError.internal({
        message:
          'Gagal mengupdate gerbong',
      })
    }
  }

  async remove(id: number) {
    try {
      const gerbong =
        await this.prisma.gerbong.delete({
          where: { id },
        })

      return gerbong
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

      console.log(error)

      throw AppError.internal({
        message:
          'Gagal menghapus gerbong',
      })
    }
  }
}