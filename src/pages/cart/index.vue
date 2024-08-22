<template>
  <div>
    <button @click="useRouter().push('/')">Back</button>
    <div v-for="cart in cartsQuery.data.value?.carts" style="margin-bottom: 16px;">
      <h2>Cart {{ cart.id }}</h2>
      <div v-for="line in cart.lines">
        <CartProduct v-if="line" :line="(line as CartLine)"></CartProduct>
      </div>
      Total: {{ cart.total }}
      Line Items: {{ cart.lineCount }}
      <button @click="clearCart.executeMutation({ input: { cartId: cart.id } })">Clear Cart</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CartsDocument, ClearCartDocument, type CartLine } from '@gql';

const cartsQuery = useQuery({ query: CartsDocument, variables: {} })
const clearCart = useMutation(ClearCartDocument)

</script>