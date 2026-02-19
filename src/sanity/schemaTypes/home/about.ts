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
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'desc',
            title: 'Текст',
            type: 'text',
            validation: (rule) => rule.required(),
        })
    ]
})