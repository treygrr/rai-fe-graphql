<template>
    <button @click="useRouter().push('/cart')">Go to cart ({{ cartTotal }})</button>
</template>

<script lang="ts" setup>
import { CartsDocument } from '~/gql/codegen/graphql';


const cartsQuery = useQuery({ query: CartsDocument, variables: {} })

const cartTotal = computed(() => {
    let totalLineItems = 0
    cartsQuery.data.value?.carts.forEach(cart => {
        totalLineItems += cart.lineCount
    })
    return totalLineItems
})
</script>