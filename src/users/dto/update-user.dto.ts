import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Role } from 'generated/prisma/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiPropertyOptional({ enum: Role, example: Role.PENUMPANG })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
