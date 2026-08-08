import { defineField, defineType } from "sanity";

export default defineType({
    name: 'about-us',
    title: 'Блок: про нас',
    type: "document",
    fields: [
        defineField({
            name: 'title',
            title: 'Заголовок',
            type: 'string',
        }),
        defineField({
            name: 'desc',
            title: 'Текст',
            type: 'text',
        }),
        defineField({
            name: 'stats',
            title: 'Статистика',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'value', title: 'Значення (напр. 2400+)', type: 'string' },
                    { name: 'label', title: 'Підпис (напр. Клієнтів)', type: 'string' }
                ]
            }]
        })
    ]
})