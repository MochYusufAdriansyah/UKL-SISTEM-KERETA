import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { prismaErrors } from 'src/utils/prisma-error.utils';
import { AppError } from 'src/utils/app-error.utils';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'generated/prisma/enums';

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
          role: Role.PENUMPANG,
        },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        throw AppError.badRequest({ message: 'Gagal membuat user' });
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
      throw AppError.internal({ message: 'Gagal membuat user' });
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { username: dto.username },
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
      const token = await this.jwt.signAsync(payload);

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
      throw AppError.internal({ message: 'Gagal login' });
    }
  }
}
