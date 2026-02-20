import { defineField, defineType } from "sanity";
import { cloudinaryImageSource } from 'sanity-plugin-cloudinary'

export default defineType({
    name: 'product',
    title: 'Продукт',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: "Название товара",
            type: 'string',
            validation: rule => rule.required()
        }),
        defineField({
            name: 'category',
            title: 'Категория',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: rule => rule.required()
        }),
        defineField({
            name: 'sizes',
            title: 'Доступные размеры',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                    list: [
                    { title: 'XS', value: 'XS' },
                    { title: 'S', value: 'S' },
                    { title: 'M', value: 'M' },
                    { title: 'L', value: 'L' },
                    { title: 'XL', value: 'XL' },
                    { title: 'XXL', value: 'XXL' },
                ],
            },
        }),
        defineField({
            name: 'price',
            title: 'Цена товара',
            type: 'number',
            validation: rule => rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Описание товара',
            type: "text",
            validation: rule => rule.required()
        }),
        defineField({
            name: 'images',
            title: 'Галерея изображений',
            type: 'array',
            of: [
                {
                    type: "cloudinary.asset",
                    options: {
                        sources: [cloudinaryImageSource],
                        hotspot: true,
                    },
                },
            ],
        }),
    ]
})