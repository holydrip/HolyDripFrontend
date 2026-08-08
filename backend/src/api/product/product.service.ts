import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "src/database/repositories/product.repository";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}
    async getAll(): Promise<ProductEntity[]> {
        return this.productRepository.findAll();
    }

    async search(query: string): Promise<ProductEntity[]> {
        return this.productRepository.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            include: { category: true }
        });
    }

    async getBySlug(slug: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findBySlug(slug);
        if (!product) throw new NotFoundException(`Product with id ${slug} not found`);
        return product;
    }

    async getByCategoryId(id: string): Promise<ProductEntity[]>{
        return this.productRepository.findByCategoryId(id);
    }

    async upsertFromSanity(data: any) {
        return await this.productRepository.upsertBySanityId(data);
    }

    async deleteBySanityId(sanityId: string) {
        return await this.productRepository.deleteBySanityId(sanityId);
    }
}