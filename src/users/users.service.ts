import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async findAll() {
    try {
      return await this.prisma.users.findMany({
        select: {
          id: true,
          username: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }

      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });

      if (!user) {
        throw AppError.notFound('User');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }

      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const data: any = { ...updateUserDto };

      if (updateUserDto.password) {
        data.password = await this.bcrypt.hashPassword(
          updateUserDto.password,
        );
      }

      return await this.prisma.users.update({
        where: { id },
        data,
        select: {
          id: true,
          username: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.users.delete({
        where: { id },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }

      throw error;
    }
  }
}