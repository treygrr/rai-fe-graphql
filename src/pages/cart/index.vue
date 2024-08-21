<template>
    <div v-for="cart in cartsQuery.data.value?.carts">
        <h2>Cart {{ cart.id }}</h2>
        <div v-for="line in cart.lines">
            <Product v-if="line" :product="line.product"></Product>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { CartsDocument } from '@gql';
  
  const cartsQuery = useQuery({ query: CartsDocument, variables: {} })
  
  </script>