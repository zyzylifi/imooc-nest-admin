import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './auth.jwt.secrect';

@Module({
  imports: [UserModule,JwtModule.register({
    global: true,
    secret: JWT_SECRET_KEY,
    signOptions: { expiresIn: '1d' },
  })],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AuthModule {}
