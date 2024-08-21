
import { type CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.gql', './src/**/*.graphql'],
  generates: {
    'src/gql/codegen/': { // originally src/gql/
      preset: 'client',
      config: {

      }
    },
    'src/gql/codegen/urql-introspection.json': {
      plugins: ['urql-introspection']
    }
    // 'src/gql/types/types.ts': { plugins: ['typescript'] },
    // 'src/': {
    //   preset: 'near-operation-file',
    //   presetConfig: {
    //     extension: '.generated.ts',
    //     // folder: '_generated',
    //     baseTypesPath: '/gql/types/types.ts'
    //   },
    //   plugins: ['typescript-operations', 'typescript-vue-urql']
    // }
  }
}

export default config
