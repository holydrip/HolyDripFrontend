import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiParam, ApiTags, ApiBody } from '@nestjs/swagger';
import { CategoryEntity } from './category.entity';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async getAll() {
    return await this.categoryService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: String })
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Sync category from Sanity CMS' })
  @ApiBody({ description: 'Payload from Sanity Webhook' })
  async sync(@Body() body: CategoryEntity & { action: 'create' | 'update' | 'delete' }) {
    const { sanityId, name, slug, action } = body;

    if (action === 'delete') {
      return await this.categoryService.deleteBySanityId(sanityId);
    }

    return await this.categoryService.upsertBySanityId({
      sanityId,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    });
  }
}
