<template>
  <div v-if="line" style="border: 1px solid black">
    <div>CartLine ID: {{ line.id }}</div>
    <div>Product ID: {{ line.product.id }}</div>
    <div>Title: {{ line.product.title }}</div>
    <div>Stock: {{ line.product.stock }}</div>
    <div>Price: {{ line.product.price }}</div>
    <div>Quantity: {{ line.qty }}</div>
    <input v-if="enableAddToCart" type="number" v-model="qty">
    <!-- <div v-if="qtyInCart">In Cart:{{ qtyInCart }}</div> -->
    <button v-if="enableAddToCart" @click="addToCart">Add To Cart</button>
  </div>
</template>

<script lang="ts" setup>
import { AddProductToCartDocument, CartsDocument, type CartLine, type Product } from '../gql/codegen/graphql';
const qty = ref<number>()

const props = defineProps<{ line: CartLine, enableAddToCart?: boolean, cartId?: string }>()

const addToCartMutation = useMutation(AddProductToCartDocument)
const cartsQuery = useQuery({ query: CartsDocument, variables: {} })

const addToCart = () => {
  addToCartMutation.executeMutation({
    input: {
      cartId: props.cartId || '5a797e70-cdba-4738-b7a5-ca6a63a2ddc0',
      productId: props.line.product.id,
      qty: 1
    },
    date: Date.now()
  })
}
</script>