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
import { Role as UserRole } from 'generated/prisma/enums';
import { KursiService } from './kursi.service';
import { CreateKursiDto } from './dto/create-kursi.dto';
import { UpdateKursiDto } from './dto/update-kursi.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';

@Controller('kursi')
export class KursiController {
  constructor(private readonly kursiService: KursiService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post()
  create(@Body() createKursiDto: CreateKursiDto) {
    return this.kursiService.create(createKursiDto);
  }

  @Get()
  findAll() {
    return this.kursiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kursiService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKursiDto: UpdateKursiDto) {
    return this.kursiService.update(+id, updateKursiDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kursiService.remove(+id);
  }
}
