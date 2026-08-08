import { defineField, defineType } from "sanity";

export default defineType({
    name: 'collectionProduct',
    title: 'Новая колекция',
    type: "document",
    fields: [
        defineField({
            name: 'title',
            title: 'Заголовок блока',
            type: 'string',
            initialValue: 'Новая колекция',
        }),
        defineField({
            name: 'products',
            title: 'Выбранные товары',
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