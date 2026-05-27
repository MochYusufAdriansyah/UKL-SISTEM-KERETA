import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async findAll() {
    try {
      const user = await this.prisma.users.findMany({
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        throw AppError.notFound('Account', {
          message: 'Tidak bisa mengambil semua users',
        });
      }

      return user;
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
      const user = await this.prisma.users.findFirst({
        where: { id },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        throw AppError.notFound('Account', {
          message: 'Tidak bisa mengambil user',
        });
      }

      return user;
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashed = updateUserDto.password
      ? await this.bcrypt.hashPassword(updateUserDto.password)
      : undefined;

    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: { ...updateUserDto, password: hashed },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        throw AppError.badRequest({ message: 'Gagal mengupdate user' });
      }

      return user;
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
      const user = await this.prisma.users.delete({
        where: { id },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        throw AppError.notFound('Account', {
          message: 'Gagal menghapus user',
        });
      }

      return user;
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
