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
      addProductToCart (_args, cache, info) {
        const patchInput = info.variables.input as AddProductToCartInput
        console.log(patchInput)
        const { cartId, productId, qty } = patchInput

        const carts = cache.readQuery({ query: CartsDocument })

        const products = cache.readQuery({ query: ProductsDocument })

        const selectedCart = carts?.carts.find(cart => {
          return cart.id === cartId
        })

        if (!selectedCart) return carts

        const hasItem = selectedCart.lines.find(line => {
          return line?.product.id === productId
        })

        const productDetails = products?.products.find((product) => {
          return product.id === productId
        })

        if (hasItem) {
          hasItem.qty += qty
        } else {
          if (!productDetails) return selectedCart
          selectedCart.lines.push({
            __typename: 'CartLine',
            id: productDetails.id,
            qty: qty,
            product: {
              __typename: 'Product',
              id: productDetails.id,
              title: productDetails.title,
              stock: productDetails.stock,
              price: productDetails.price,
            }
          })
          selectedCart.lineCount = selectedCart.lines.length
        }
        
        return selectedCart || null
      },
      clearCart (_args, cache, info) {
        const patchInput = info.variables.input as ClearCartInput
        const carts = cache.readQuery({ query: CartsDocument })

        const selectedCart = carts?.carts.find(cart => {
          return cart.id === patchInput.cartId
        })
        console.log('selected cart', selectedCart)
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
