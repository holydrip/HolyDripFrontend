import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Категории',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        })
    ],
})