import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Role as UserRole } from '@prisma/client';
import { PelangganService } from './pelanggan.service';
import { CreatePelangganDto } from './dto/create-pelanggan.dto';
import { UpdatePelangganDto } from './dto/update-pelanggan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('pelanggan')
export class PelangganController {
  constructor(private readonly pelangganService: PelangganService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post()
  async create(@Body() createPelangganDto: CreatePelangganDto) {
    return await this.pelangganService.create(createPelangganDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Post('me')
  async createMine(
    @CurrentUser('id') userId: number,
    @Body() createPelangganDto: CreatePelangganDto,
  ) {
    return await this.pelangganService.createForCurrentUser(
      userId,
      createPelangganDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.pelangganService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Get('me')
  async findMine(@CurrentUser('id') userId: number) {
    return await this.pelangganService.findCurrentUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pelangganService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Patch('me')
  async updateMine(
    @CurrentUser('id') userId: number,
    @Body() updatePelangganDto: UpdatePelangganDto,
  ) {
    return await this.pelangganService.updateForCurrentUser(
      userId,
      updatePelangganDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePelangganDto: UpdatePelangganDto) {
    return await this.pelangganService.update(+id, updatePelangganDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Delete('me')
  async removeMine(@CurrentUser('id') userId: number) {
    return await this.pelangganService.removeForCurrentUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.pelangganService.remove(+id);
  }
}
