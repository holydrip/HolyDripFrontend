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
                    { title: '36', value: '36' },
                    { title: '37', value: '37' },
                    { title: '38', value: '38' },
                    { title: '39', value: '39' },
                    { title: '40', value: '40' },
                    { title: '41', value: '41' },
                    { title: '42', value: '42' },
                    { title: '43', value: '43' },
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