import { defineField, defineType } from "sanity";

export default defineType({
    name: 'recommentedProduct',
    title: 'Рекомендуемые товары',
    type: "document",
    fields: [
        defineField({
            name: 'title',
            title: 'Заголовок блока',
            type: 'string',
            initialValue: 'Рекомендуем к покупке',
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