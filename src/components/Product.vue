<template>
<div v-if="product" style="border: 1px solid black">
    <div>ID: {{ product.id }}</div>
    <div>Title: {{ product.title }}</div>
    <div>Stock: {{ product.stock }}</div>
    <div>Price: {{ product.price }}</div>
    <input v-if="enableAddToCart" type="number" v-model="qty">
    <!-- <div v-if="qtyInCart">In Cart:{{ qtyInCart }}</div> -->
    <button v-if="enableAddToCart" @click="addToCart">Add To Cart</button>
</div>
</template>

<script lang="ts" setup>
import { AddProductToCartDocument, type Product, CartsDocument } from '../gql/codegen/graphql';
const qty = ref<number>()

const props = defineProps<{ product: Product, enableAddToCart?: boolean}>()

const addToCartMutation = useMutation(AddProductToCartDocument)
const cartsQuery = useQuery({ query: CartsDocument, variables: {} })

const addToCart = () => {
    addToCartMutation.executeMutation({ 
        input: {
            cartId: '5a797e70-cdba-4738-b7a5-ca6a63a2ddc0',
            productId: props.product.id,
            qty: 1
        }
    })
}
</script>