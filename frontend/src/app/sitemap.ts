import { MetadataRoute } from 'next'
import { ProductService } from '@/services/product.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://holydrip.com.ua'
    
    let productEntries: MetadataRoute.Sitemap = []
    try {
        const products = await ProductService.getAll() || [];
        productEntries = products.map((product) => ({
            url: `${baseUrl}/catalog/${product.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))
    } catch (e) {
        console.error('Sitemap: Failed to fetch products', e)
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/catalog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/info/delivery`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/info/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    return [...staticPages, ...productEntries]
}