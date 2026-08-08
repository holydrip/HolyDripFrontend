import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../jwt-payload';
import { Request } from 'express';
import { CookieUtils } from '../../../utils/cookie.utils';
import { RefreshTokenRepository } from '../../../database/repositories/refresh-token.repository';
import { ConfigService } from '@nestjs/config';
import { RefreshToken, User } from '@prisma/client';

export type UserWithRefreshToken = User & { token?: RefreshToken };

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors(
        CookieUtils.getRequestJwt('refresh'),
      ),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = CookieUtils.getRequestJwt('refresh')[0](req);

    const token = await this.refreshTokenRepository.find({
      where: {
        userId: payload.sub,
        token: refreshToken,
      },
    });
    if (!token) throw new UnauthorizedException();
    return { ...payload, token };
  }
}