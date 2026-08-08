import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/database/repositories/category.repository';
import { CategoryEntity } from './category.entity';


@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }

  async getById(id: string): Promise<CategoryEntity> {
    const category: CategoryEntity = await this.categoryRepository.findById(id);
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async upsertBySanityId(data: {
    sanityId: string;
    name: string;
    slug: string;
  }): Promise<CategoryEntity> {
    return this.categoryRepository.upsertBySanityId(data)
  }

  async deleteBySanityId(sanityId: string) {
    return this.categoryRepository.deleteBySanityId(sanityId)
  }
}
