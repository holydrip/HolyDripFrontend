import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../jwt-payload';
import { CookieUtils } from '../../../utils/cookie.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors(
        CookieUtils.getRequestJwt('access'),
      ),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload) throw new UnauthorizedException();
    const user = {
      id: payload.sub,
      role: payload.role,
    };
    return user;
  }
}