import { offlineExchange as offlineExchangeInternal, type Data } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
import schema from '@/gql/codegen/urql-introspection.json'
import { CartsDocument, ProductsDocument, type AddProductToCartInput, type Cart, type ClearCartInput } from '~/gql/codegen/graphql'


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
        const patchInput = info.variables.input as AddProductToCartInput
        const carts = cache.readQuery({ query: CartsDocument })
        const foundCart = carts?.carts?.find(carts => carts.id === patchInput.cartId)

        const products = cache.readQuery({ query: ProductsDocument })

        const foundProduct = products?.products?.find(product => product.id === patchInput.productId)
        // const cart = {
        //   __typename: 'CartLine',
        //   id: 'cartid_fromFirstProduct' + productToAdd.id,
        //   qty: patchInput.qty,
        //   product: {
        //     __typename: 'Product',
        //     id: productToAdd.id,
        //     title: productToAdd.title,
        //     stock: productToAdd.stock,
        //     price: productToAdd.price,
        //   }
        // }
        if (!foundCart) return null
        if (!foundProduct) return null
        console.log('found cart', JSON.stringify(foundCart, null, 1))
        const returnCart = { ...foundCart }
        
        // does return cart have item?
        const hasProduct = returnCart.lines.find(line => line?.product.id === patchInput.productId)
        if (hasProduct) {
          hasProduct.qty = hasProduct.qty + patchInput.qty
        } else {
          returnCart.lines.push({
            __typename: 'CartLine',
            id: 'cartid_fromFirstProduct' + foundProduct.id,
            qty: patchInput.qty,
            product: {
              __typename: 'Product',
              id: foundProduct.id,
              title: foundProduct.title,
              stock: foundProduct.stock,
              price: foundProduct.price,
            }
          })
        }

        returnCart.lineCount = returnCart.lines.length

        return returnCart
      },
      clearCart(_args, cache, info) {
        const patchInput = info.variables.input as ClearCartInput
        cache.updateQuery({ query: CartsDocument, variables: {} }, data => {
          data?.carts.forEach(cart => {
            if (cart.id === patchInput.cartId) {
              cart.lines.forEach(line => {
                if (line?.qty) {
                  line.qty = 0
                }
              })
              cart.total = 0
              cart.lineCount = 0
            }
            console.log('Data after', JSON.stringify(data?.carts, null, 1))
          })
          return data
        })
        const qcart: Cart = {
          "__typename": "Cart",
          "id": patchInput.cartId,
          "lines": [],
          "lineCount": 0,
          "total": 0
        }
        return qcart
      }
    }
  })
}

export default offlineExchange
