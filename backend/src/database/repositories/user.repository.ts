import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../../api/user/dto/create-user.dto';
import { UserEntity } from '../../api/user/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(args?: Prisma.UserFindManyArgs): Promise<UserEntity[]> {
    return this.prisma.user.findMany(args);
  }

  async findById(id: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async find(args?: Prisma.UserFindFirstArgs): Promise<UserEntity> {
    return this.prisma.user.findFirst(args);
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: string): Promise<UserEntity> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async deleteMany(args?: Prisma.UserDeleteManyArgs) {
    return this.prisma.user.deleteMany(args);
  }
}
