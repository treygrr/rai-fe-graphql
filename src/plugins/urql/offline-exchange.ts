import { offlineExchange as offlineExchangeInternal, type Data } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
import schema from '@/gql/codegen/urql-introspection.json'


const offlineExchange = () => {

  const storage = makeDefaultStorage({
    idbName: 'urql-managed-inventory',
    maxAge: 7 // days
  })

  // cache keys, see https://commerce.nearform.com/open-source/urql/docs/graphcache/normalized-caching/#custom-keys-and-non-keyable-entities
  const cacheKeys = {
  }

  return offlineExchangeInternal({
    schema, 
    storage, 
    keys: cacheKeys,
    updates: { // (result, args, cache, info)
      Mutation: {
        
      }
    },
    optimistic: { // (args, cache, info)
      
    }
  })
}

export default offlineExchange
