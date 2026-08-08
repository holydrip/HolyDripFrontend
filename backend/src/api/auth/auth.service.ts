import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../../security/jwt/jwt-payload';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import { RefreshTokenRepository } from '../../database/repositories/refresh-token.repository';
import { UserWithRefreshToken } from '../../security/jwt/refresh/refresh.strategy';
import { UserEntity } from '../user/user.entity';
import { Cron } from '@nestjs/schedule';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { StringValue } from 'ms'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(body: CreateUserDto) {
    const newUser: User = await this.userService.create(body);
    return {
      accessToken: this.generateToken(newUser, 'access'),
      refreshToken: await this.createRefreshToken(newUser),
      newUser,
    };
  }

  async login(data: LoginDto) {
    const user: User = await this.userService.get({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestException('Password or email is incorrect');
    }
    return {
      accessToken: this.generateToken(user, 'access'),
      refreshToken: await this.createRefreshToken(user),
      user,
    };
  }

  private async createRefreshToken(
    user: User,
    options?: JwtSignOptions,
  ): Promise<string> {
    const token = this.generateToken(user, 'refresh', options);
    await this.userRepository.updateById(user.id, {
      tokens: {
        create: {
          token: token,
        },
      },
    });
    return token;
  }

  private generateToken(
    user: User,
    token: 'access' | 'refresh',
    options?: JwtSignOptions,
  ): string {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>(
        token == 'access' ? 'ACCESS_TTL' : 'REFRESH_TTL',
      ) as StringValue,
      secret: this.configService.get<string>('JWT_SECRET'),
      ...options,
    });
  }

  getTokenExpTime(token: string): number {
    return this.jwtService.decode(token).exp * 1000;
  }

  async refresh(userWithToken: UserWithRefreshToken) {
    const expiresIn = Math.floor(
      (this.getTokenExpTime(userWithToken.token.token) - Date.now()) / 1000,
    );
    await this.refreshTokenRepository.deleteById(userWithToken.token.id);
    const user: UserEntity = await this.userRepository.findById(
      userWithToken.token.userId,
    );
    return {
      accessToken: this.generateToken(user, 'access'),
      refreshToken: await this.createRefreshToken(user, { expiresIn }),
    };
  }

  async logout(user: UserWithRefreshToken) {
    await this.refreshTokenRepository.deleteById(user.token.id);
  }

  @Cron('0 2 * * *')
  private async clearExpiredTokens(userId?: string) {
    const tokens = await this.refreshTokenRepository.findMany({
      where: {
        userId,
      },
    });
    const now = Date.now();

    for (const { id, token } of tokens) {
      if (this.getTokenExpTime(token) <= now) {
        await this.refreshTokenRepository.deleteById(id);
      }
    }
  }
}