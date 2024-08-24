import { offlineExchange as offlineExchangeInternal, type Data } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
import schema from '@/gql/codegen/urql-introspection.json'
import { CartsDocument, ProductsDocument, type AddProductToCartInput, type ClearCartInput } from '~/gql/codegen/graphql'


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
      addProductToCart(_args, cache, info) {
        let cacheReturn = null
        const patchInput = info.variables.input as AddProductToCartInput
        cache.updateQuery({ query: CartsDocument, variables: {} }, data => {
          const hasCart = data?.carts.find(cart => patchInput.cartId === cart.id)
          if (hasCart) {
            const productsQuery = cache.readQuery({ query: ProductsDocument })

            const productToAdd = productsQuery?.products.find((product) => {
              return product.id === patchInput.productId
            })
            if (productToAdd) {
              const isAlreadyInCart = hasCart.lines.find(line => {
                line?.product.id === patchInput.productId
              })
              if (isAlreadyInCart) {
                isAlreadyInCart.qty += patchInput.qty
              } else {
                hasCart.lines.push({
                  __typename: 'CartLine',
                  id: 'cartid_fromFirstProduct' + productToAdd.id,
                  qty: patchInput.qty,
                  product: {
                    __typename: 'Product',
                    id: productToAdd.id,
                    title: productToAdd.title,
                    stock: productToAdd.stock,
                    price: productToAdd.price,
                  }
                })
                hasCart.lineCount = hasCart.lines.length
              }
            }
            cacheReturn = hasCart
          }
          return data
        })
        
        console.log('Returned at the end of add', cacheReturn)

        return cacheReturn || null
      },
      clearCart(_args, cache, info) {
        const patchInput = info.variables.input as ClearCartInput
        cache.updateQuery({ query: CartsDocument, variables: {} }, data => {
          data?.carts.forEach(cart => {
            if (cart.id === patchInput.cartId) {
              cart.lines.forEach(line => {
                console.log('qty before clear', line?.qty, line)
                if (line?.qty) {
                  line.qty = 0
                  console.log('qty after clear', line.qty)
                }
              })
              cart.total = 0
              cart.lineCount = 0
            }
            console.log('Data after', JSON.stringify(data?.carts, null, 1))
          })
          return data
        })
        cache.updateQuery({ query: CartsDocument, variables: {} }, data => {
          data?.carts.forEach(cart => {
            if (cart.id === patchInput.cartId) {
              cart.lines.forEach(line => {
                if (line?.qty) {
                  line.qty = 0
                }
              })
              cart.lines = []
              cart.total = 0
              cart.lineCount = 0
            }
          })
          return data
        })
        const carts = cache.readQuery({ query: CartsDocument })

        const selectedCart = carts?.carts.find(cart => {
          return cart.id === patchInput.cartId
        })

        if (selectedCart) {
          selectedCart.lineCount = 0
          selectedCart.lines = []
          selectedCart.total = 0
        }

        return selectedCart || null
      }
    }
  })
}

export default offlineExchange
