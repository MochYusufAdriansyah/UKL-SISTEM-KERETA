import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await this.bcrypt.hashPassword(dto.password);

    try {
      const user = await this.prisma.users.create({
        data: {
          username: dto.username,
          password: hashed,
          role: dto.role,
        },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });

      if (!user) {
        throw AppError.badRequest({
          message: 'Gagal membuat user',
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

      throw AppError.internal({
        message: 'Gagal membuat user',
      });
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          username: dto.username,
        },
      });

      if (!user) {
        throw AppError.unauthorized('Invalid', {
          message: 'Gagal login, data salah!',
        });
      }

      const compare = await this.bcrypt.comparePassword(
        dto.password,
        user.password,
      );

      if (!compare) {
        throw AppError.unauthorized('Invalid', {
          message: 'Gagal login, data salah!',
        });
      }

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      } as const;

      const token = await this.jwt.signAsync(payload, {
        secret:
          process.env.JWT_SECRET ||
          '325167923122ad5984c832dfa622f8651ffd7af6a1f3878ce430d1a6f3cfe248d3a598e0f74e16771a5b990cbe024a3e6e2aa0bb3e825a98ed00f957b4a1e56',
        expiresIn: '1d',
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw await prismaErrors(error);
      }

      console.log(error);

      throw AppError.internal({
        message: 'Anda gagal login, silahkan coba lagi',
      });
    }
  }
}