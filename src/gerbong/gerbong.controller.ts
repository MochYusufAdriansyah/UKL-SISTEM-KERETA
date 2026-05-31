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

import { GerbongService } from './gerbong.service';

import { CreateGerbongDto } from './dto/create-gerbong.dto';
import { UpdateGerbongDto } from './dto/update-gerbong.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

import { Role } from 'src/auth/decorators/role.decorator';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Gerbong')
@ApiBearerAuth()
@Controller('gerbong')
export class GerbongController {
  constructor(
    private readonly gerbongService: GerbongService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post()
  @ApiOperation({
    summary:
      'Create gerbong + auto generate kursi',
  })
  @ApiBody({
    type: CreateGerbongDto,
  })
  create(
    @Body()
    createGerbongDto: CreateGerbongDto,
  ) {
    return this.gerbongService.create(
      createGerbongDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all gerbong',
  })
  findAll() {
    return this.gerbongService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get gerbong by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.gerbongService.findOne(
      +id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update gerbong',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiBody({
    type: UpdateGerbongDto,
  })
  update(
    @Param('id') id: string,
    @Body()
    updateGerbongDto: UpdateGerbongDto,
  ) {
    return this.gerbongService.update(
      +id,
      updateGerbongDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete gerbong',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  remove(
    @Param('id') id: string,
  ) {
    return this.gerbongService.remove(
      +id,
    );
  }
}
