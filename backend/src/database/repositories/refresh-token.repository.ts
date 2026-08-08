import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    args?: Prisma.RefreshTokenFindManyArgs,
  ): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany(args);
  }

  async findById(id: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.findUnique({
      where: { id },
    });
  }

  async find(args?: Prisma.RefreshTokenFindFirstArgs): Promise<RefreshToken> {
    return this.prisma.refreshToken.findFirst(args);
  }

  async create(data: RefreshToken): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteMany(args?: Prisma.RefreshTokenDeleteManyArgs) {
    return this.prisma.refreshToken.deleteMany(args);
  }
}