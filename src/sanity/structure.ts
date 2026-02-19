import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('product').title('Товары'),
      S.documentTypeListItem('category').title('Категории'),
      S.listItem()
        .title('Главная')
        .child(
          S.list()
            .title('Блоки главной страницы')
            .items([
              S.listItem()
                .title('Блок: рекомендованые товары')
                .child(S.document().schemaType('recommentedProduct').documentId('recommentedProduct')),
              S.listItem()
                .title("Блок: Про нас")
                .child(S.document().schemaType('about-us').documentId('about')),
              S.listItem()
                .title('Блок: новая колекция')
                .child(S.document().schemaType('collectionProduct').documentId('collectionProduct')),
            ])
        )
    ])
