import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieUtils } from '../../utils/cookie.utils';
import { GetUser } from '../../decorators/get-user.decorator';
import { RefreshGuard } from '../../security/jwt/refresh/refresh.guard';
import { UserWithRefreshToken } from '../../security/jwt/refresh/refresh.strategy';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { UserDto } from '../user/dto/user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/ping')
  ping() {
    return { status: 'ok', timestamp: Date.now() };
  }


  @Post('/register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, newUser } =
      await this.authService.register(body);

    CookieUtils.setResponseJwt(
      res,
      { accessToken, refreshToken },
      {
        accessTokenExpires: this.authService.getTokenExpTime(accessToken),
        refreshTokenExpires: this.authService.getTokenExpTime(refreshToken),
      },
    );

    const { password, ...safeUser } = newUser as any;
    return { ...safeUser, accessToken, refreshToken };
  }

  @Post('/login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);
    CookieUtils.setResponseJwt(
      res,
      { accessToken, refreshToken },
      {
        accessTokenExpires: this.authService.getTokenExpTime(accessToken),
        refreshTokenExpires: this.authService.getTokenExpTime(refreshToken),
      },
    );

    const { password, ...safeUser } = user as any;
    return { ...safeUser, accessToken, refreshToken };
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: UserWithRefreshToken,
  ) {
    const tokens = await this.authService.refresh(user);
    CookieUtils.setResponseJwt(res, tokens, {
      accessTokenExpires: this.authService.getTokenExpTime(tokens.accessToken),
      refreshTokenExpires: this.authService.getTokenExpTime(
        tokens.refreshToken,
      ),
    });
  }

  @UseGuards(RefreshGuard)
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: UserWithRefreshToken,
  ) {
    await this.authService.logout(user);
    CookieUtils.clearResponseCookie(res, ['access', 'refresh']);
  }
}
