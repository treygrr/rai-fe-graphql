import { defineNuxtModule, useLogger } from '@nuxt/kit' // createResolver
import { basename } from 'pathe'

const logger = useLogger('codegen')

export interface ModuleOptions {
  configFile: string,
  devOnly: boolean,
  extensions: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'codegen',
    configKey: 'codegen'
  },
  defaults: {
    configFile: 'codegen.ts',
    devOnly: true,
    extensions: ['.graphql', '.gql']
  },
  setup (options, nuxt) {

    if (options.devOnly && !nuxt.options.dev) {
      logger.info('Codegen: Skipping Codegen')
      return
    }

    nuxt.hook('build:done', async () => {
      try {
        const { generate, loadCodegenConfig } = await import(
          '@graphql-codegen/cli'
        )
        const { config } = await loadCodegenConfig({
          configFilePath: options.configFile
        })
        const start = Date.now()
        logger.info('Codegen: Running GraphQl Code Generator')

        await generate({
          silent: true,
          ...config
        })
        const time = Date.now() - start

        logger.success(`Codegen: Finished in ${(time / 1000).toPrecision(2)} seconds `)

      } catch (error) {
        logger.error(error)
      }
    })

    nuxt.hook('builder:watch', (_event, path) => {
      const modifiedConfig = basename(path) === basename(options.configFile)
      const modifiedWatchedExtension = options.extensions.some(extension =>
        path.endsWith(extension)
      )

      if (!modifiedWatchedExtension && !modifiedConfig) {
        return
      }

      nuxt.callHook('build:done')
    })
  }
})