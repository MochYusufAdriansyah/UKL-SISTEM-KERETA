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
import { Role as UserRole } from '@prisma/client';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Ticket')
@ApiBearerAuth()
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Post()
  @ApiOperation({ summary: 'Create ticket for one or more passengers (PENUMPANG)' })
  @ApiBody({ type: CreateTicketDto })
  create(
    @CurrentUser('id') userId: number,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketService.create(userId, createTicketDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all tickets (ADMIN)' })
  @ApiQuery({ name: 'tanggal', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'bulan', required: false, description: '1-12' })
  @ApiQuery({ name: 'tahun', required: false, description: 'YYYY' })
  @ApiQuery({ name: 'pelangganId', required: false })
  findAll(
    @Query('tanggal') tanggal?: string,
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
    @Query('pelangganId') pelangganId?: string,
  ) {
    return this.ticketService.findAll({ tanggal, bulan, tahun, pelangganId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Get('mine')
  @ApiOperation({ summary: 'View my ticket history by date or month (PENUMPANG)' })
  @ApiQuery({ name: 'tanggal', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'bulan', required: false, description: '1-12' })
  @ApiQuery({ name: 'tahun', required: false, description: 'YYYY' })
  findMine(
    @CurrentUser('id') userId: number,
    @Query('tanggal') tanggal?: string,
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
  ) {
    return this.ticketService.findMine(userId, {
      tanggal,
      bulan,
      tahun,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get('rekap/pemasukan')
  @ApiOperation({ summary: 'Monthly revenue recap (ADMIN)' })
  @ApiQuery({ name: 'bulan', required: false, description: '1-12' })
  @ApiQuery({ name: 'tahun', required: false, description: 'YYYY' })
  getMonthlyRevenue(
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
  ) {
    return this.ticketService.getMonthlyRevenue(bulan, tahun);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Get('mine/:id/nota')
  @ApiOperation({ summary: 'Get my ticket receipt / nota' })
  @ApiParam({ name: 'id', type: Number })
  getMyReceipt(
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.ticketService.getMyReceipt(+id, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get(':id/nota')
  @ApiOperation({ summary: 'Get ticket receipt / nota' })
  @ApiParam({ name: 'id', type: Number })
  getReceipt(@Param('id') id: string) {
    return this.ticketService.getReceipt(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Get('mine/:id')
  @ApiOperation({ summary: 'Get my ticket detail by id' })
  @ApiParam({ name: 'id', type: Number })
  findMineOne(
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.ticketService.findMineOne(+id, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get ticket detail by id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update ticket (ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTicketDto })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.PENUMPANG)
  @Delete('mine/:id')
  @ApiOperation({ summary: 'Cancel my ticket' })
  @ApiParam({ name: 'id', type: Number })
  removeMine(
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.ticketService.removeMine(+id, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel ticket (ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
