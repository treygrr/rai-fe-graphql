import urql, { type ClientOptions, mapExchange, fetchExchange } from '@urql/vue'
import offlineExchange from './urql/offline-exchange'
import { devtoolsExchange } from '@urql/devtools'
import { unset } from 'lodash-es'

export default defineNuxtPlugin(async (nuxtApp) => {
  const clientOptions: ClientOptions = {
    url: 'http://localhost:4000/graphql',
    exchanges: [
      devtoolsExchange, // TBD if this needs to be removed in production
      offlineExchange(),
      fetchExchange
    ],
    requestPolicy: 'cache-and-network' // 'cache-first' is default, unsure if this is the best option
  }

  // const client = new Client(clientOptions)
  
  // return {
  //   provide: {
  //     urql: client
  //   }
  // }

  nuxtApp.vueApp.use(urql, clientOptions)
})