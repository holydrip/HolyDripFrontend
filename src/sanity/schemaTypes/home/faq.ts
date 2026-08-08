import { defineField, defineType } from "sanity";

export default defineType({
    name: 'faqBlock',
    title: 'Блок: FAQ',
    type: "document",
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Надзаголовок (напр. Info & Rules)',
            type: 'string',
            initialValue: 'Info & Rules',
        }),
        defineField({
            name: 'title',
            title: 'Заголовок',
            type: 'string',
            initialValue: 'FAQ',
        }),
        defineField({
            name: 'items',
            title: 'Питання та відповіді',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'q', title: 'Питання', type: 'string', validation: (Rule) => Rule.required() },
                    { name: 'a', title: 'Відповідь', type: 'text', validation: (Rule) => Rule.required() }
                ]
            }]
        }),
        defineField({
            name: 'footerText',
            title: 'Текст внизу',
            type: 'string',
            initialValue: 'In Swag We Trust.',
        })
    ]
})