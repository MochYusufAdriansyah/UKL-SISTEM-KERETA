import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { Role as UserRole } from 'generated/prisma/enums';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Jadwal')
@Controller('jadwal')
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create jadwal (ADMIN)' })
  @ApiBody({ type: CreateJadwalDto })
  create(@Body() createJadwalDto: CreateJadwalDto) {
    return this.jadwalService.create(createJadwalDto);
  }

  @Get()
  @ApiOperation({ summary: 'List jadwal with search filters' })
  @ApiQuery({ name: 'asal', required: false })
  @ApiQuery({ name: 'tujuan', required: false })
  @ApiQuery({ name: 'kelas', required: false })
  @ApiQuery({ name: 'tanggal', required: false, description: 'YYYY-MM-DD' })
  findAll(
    @Query('asal') asal?: string,
    @Query('tujuan') tujuan?: string,
    @Query('kelas') kelas?: string,
    @Query('tanggal') tanggal?: string,
  ) {
    return this.jadwalService.findAll({ asal, tujuan, kelas, tanggal });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get jadwal detail and available seats' })
  findOne(@Param('id') id: string) {
    return this.jadwalService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update jadwal (ADMIN)' })
  @ApiBody({ type: UpdateJadwalDto })
  update(@Param('id') id: string, @Body() updateJadwalDto: UpdateJadwalDto) {
    return this.jadwalService.update(+id, updateJadwalDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete jadwal (ADMIN)' })
  remove(@Param('id') id: string) {
    return this.jadwalService.remove(+id);
  }
}
