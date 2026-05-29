import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/role.guard';

@Global()
@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      global: true,

      // sementara hardcode dulu supaya pasti kebaca
      secret:
        process.env.JWT_SECRET ||
        '325167923122ad5984c832dfa622f8651ffd7af6a1f3878ce430d1a6f3cfe248d3a598e0f74e16771a5b990cbe024a3e6e2aa0bb3e825a98ed00f957b4a1e56',

      signOptions: {
        expiresIn:
          (process.env.JWT_EXPIRED as StringValue) || '1d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    RolesGuard,
  ],
})
export class AuthModule {}