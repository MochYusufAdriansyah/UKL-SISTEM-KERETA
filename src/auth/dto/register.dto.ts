import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';

export class RegisterDto {
  @ApiProperty({ example: 'budi' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;

   @ApiProperty({
    example: 'ADMIN',
    enum: Role,
  })
  @IsEnum(Role)
  role!: Role;
}
