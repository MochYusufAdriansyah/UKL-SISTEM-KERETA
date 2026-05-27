import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { TicketModule } from './ticket/ticket.module';
import { PelangganModule } from './pelanggan/pelanggan.module';
import { PetugasModule } from './petugas/petugas.module';
import { KeretaModule } from './kereta/kereta.module';
import { GerbongModule } from './gerbong/gerbong.module';
import { KursiModule } from './kursi/kursi.module';
import { JadwalModule } from './jadwal/jadwal.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    BcryptModule,
    TicketModule,
    PelangganModule,
    PetugasModule,
    KeretaModule,
    GerbongModule,
    KursiModule,
    JadwalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
