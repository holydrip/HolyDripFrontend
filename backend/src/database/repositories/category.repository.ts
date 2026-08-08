import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryEntity } from 'src/api/category/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  async findById(id: string): Promise<CategoryEntity> {
    return this.prisma.category.findUnique({
        where: {id},
        include: {
            products: true
        }
    })
  }

  async upsertBySanityId(data: {
    sanityId: string;
    name: string;
    slug: string;
  }): Promise<CategoryEntity> {
    return this.prisma.category.upsert({
      where: { sanityId: data.sanityId },
      update: {
        name: data.name,
        slug: data.slug,
      },
      create: {
        sanityId: data.sanityId,
        name: data.name,
        slug: data.slug,
      },
      include: {
        products: true,
      },
    });
  }

  async deleteBySanityId(sanityId: string) {
    return this.prisma.category.delete({
      where: { sanityId },
    });
  }
}
