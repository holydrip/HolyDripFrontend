import { defineField, defineType } from "sanity";

export default defineType({
    name: 'salesBlock',
    title: 'Блок: Акції (Sales)',
    type: "document",
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Надзаголовок (напр. Up to 50% Off)',
            type: 'string',
            initialValue: 'Up to 50% Off',
        }),
        defineField({
            name: 'title',
            title: 'Заголовок блока',
            type: 'string',
            initialValue: 'Sales',
        }),
        defineField({
            name: 'products',
            title: 'Акційні товари',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }],
                }
            ],
            validation: (rule) => rule.unique(),
        })
    ]
})