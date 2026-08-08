import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { UserEntity } from './user.entity';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService
  ) {}
  async create(data: CreateUserDto): Promise<UserEntity> {
    const saltOrRounds = 10;
    data.password = await bcrypt.hash(data.password, saltOrRounds);
    return this.userRepository.create(data);
  }
  async getById(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' }
        },
        discount: true,
      },
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { password, ...result } = user;

    const totalSpent = user.orders
      .filter(order => order.status === 'PAID')
      .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

    return { ...result, totalSpent };
  }

  async updateDiscount(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId, status: 'PAID' }
    });

    const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

    let percent = 0;
    if (totalSpent >= 50000) percent = 20;
    else if (totalSpent >= 30000) percent = 15;
    else if (totalSpent >= 15000) percent = 10;
    else if (totalSpent >= 5000) percent = 5;

    await this.prisma.discount.upsert({
      where: { userId },
      update: { percent },
      create: { userId, percent }
    });

    return percent;
  }

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.findMany();
  }
  async get(data: Prisma.UserWhereInput): Promise<UserEntity> {
    return this.userRepository.find({ where: data });
  }
  async updateById(id: string, data: UpdateUserDto): Promise<UserEntity> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userRepository.updateById(id, data);
  }
  async deleteById(id: string): Promise<UserEntity> {
    return this.userRepository.deleteById(id);
  }
}
