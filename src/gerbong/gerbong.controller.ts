import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'

import { Role as UserRole } from '@prisma/client'

import { GerbongService } from './gerbong.service'
import { CreateGerbongDto } from './dto/create-gerbong.dto'
import { UpdateGerbongDto } from './dto/update-gerbong.dto'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/decorators/role.decorator'

@Controller('gerbong')
export class GerbongController {
  constructor(
    private readonly gerbongService: GerbongService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post()
  create(
    @Body()
    createGerbongDto: CreateGerbongDto,
  ) {
    return this.gerbongService.create(
      createGerbongDto,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post(':id/generate-seat')
  generateSeat(
    @Param('id') id: string,
  ) {
    return this.gerbongService.generateKursi(
      +id,
    )
  }

  @Get()
  findAll() {
    return this.gerbongService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.gerbongService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateGerbongDto: UpdateGerbongDto,
  ) {
    return this.gerbongService.update(
      +id,
      updateGerbongDto,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.gerbongService.remove(+id)
  }
}
