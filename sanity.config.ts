import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'kent-blog',
  title: 'Kent Blog 編集室',
  projectId: 'epj19ggx',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {types: schemaTypes},
})
