import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccessGuard } from './access/access.guard';
import { RefreshGuard } from './refresh/refresh.guard';
import { AccessStrategy } from './access/access.strategy';
import { RefreshStrategy } from './refresh/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TTL') as StringValue,
        },
      }),
    }),
  ],
  providers: [AccessStrategy, RefreshStrategy, AccessGuard, RefreshGuard],
  exports: [AccessGuard, RefreshGuard],
})
export class AccessModule {}
