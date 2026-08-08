import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { ProductRepository } from './repositories/product.repository';
import { CategoryRepository } from './repositories/category.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [PrismaService, UserRepository, RefreshTokenRepository, ProductRepository, CategoryRepository],
  exports: [PrismaService, UserRepository, RefreshTokenRepository, ProductRepository, CategoryRepository],
})
export class DatabaseModule {}
