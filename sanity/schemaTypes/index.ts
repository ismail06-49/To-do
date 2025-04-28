import { type SchemaTypeDefinition } from 'sanity'
import { user } from '@/sanity/schemaTypes/user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user],
}
