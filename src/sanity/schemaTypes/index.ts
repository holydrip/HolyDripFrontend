import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import product from './product'
import about from './home/about'
import recommentedProduct from './home/recommentedProduct'
import collection from './home/collection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, about, recommentedProduct, collection],
}
