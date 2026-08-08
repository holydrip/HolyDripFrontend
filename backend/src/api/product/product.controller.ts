import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async getAll() {
    return await this.productService.getAll();
  }

  @Get('search')
  async search(@Query('q') q: string) {
    if (!q) return [];
    return this.productService.search(q);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiParam({ name: 'slug', description: 'Product ID', type: String })
  async getBySlug(@Param('slug') slug: string) {
    return await this.productService.getBySlug(slug);
  }

  @Get('category/:id')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: String })
  async getByCategoryId(id: string) {
    return await this.productService.getByCategoryId(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Sync product from Sanity' })
  async sync(@Body() body: ProductEntity & { action: 'create' | 'update' | 'delete'; categorySanityId?: string; measurements?: any }) {
    const { sanityId, name, price, description, images, categorySanityId, action, sizes, slug, measurements } = body;

    if (action === 'delete') {
      return await this.productService.deleteBySanityId(sanityId);
    }

    const cleanImages = Array.isArray(images) 
      ? images.filter((img): img is string => typeof img === 'string' && img !== null)
      : [];

    return await this.productService.upsertFromSanity({
      sanityId,
      name,
      slug,
      price: Number(price),
      description: description || '',
      images: cleanImages,
      sizes,
      measurements: measurements || null,
      categorySanityId,
    });
  }
}
