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
import { KeretaService } from './kereta.service';
import { CreateKeretaDto } from './dto/create-kereta.dto';
import { UpdateKeretaDto } from './dto/update-kereta.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role as UserRole } from 'generated/prisma/enums';

@ApiTags('Kereta')
@Controller('kereta')
export class KeretaController {
  constructor(private readonly keretaService: KeretaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create kereta (ADMIN)' })
  @ApiBody({ type: CreateKeretaDto })
  create(@Body() createKeretaDto: CreateKeretaDto) {
    return this.keretaService.create(createKeretaDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all kereta' })
  findAll() {
    return this.keretaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get kereta by id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.keretaService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update kereta (ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateKeretaDto })
  update(@Param('id') id: string, @Body() updateKeretaDto: UpdateKeretaDto) {
    return this.keretaService.update(+id, updateKeretaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete kereta (ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.keretaService.remove(+id);
  }
}
