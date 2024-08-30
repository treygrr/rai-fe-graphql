<template>
    <div>
      <CartButton></CartButton>
      <label for="cart-select">Choose a cart:</label>
      <select v-model="selectedCart" id="cart-select" title="select cart">
        <option v-for="cart in cartsQuery.data.value?.carts" :value="cart.id">{{ cart.id }}</option>
      </select>
      <h2>Products:</h2>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <div v-for="product in productsQuery.data.value?.products">
          <Product :product="product" enable-add-to-cart :cart-id="selectedCart"></Product>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { CartsDocument, type Product, ProductsDocument, UpdateProductDocument } from '@gql';
  

  const updateFormData = ref<Product>({
    id: '',
    title: '',
    price: 0,
    stock: 0,
  })
  
  const createFormData = ref<Product>({
    id: crypto.randomUUID(),
    title: '',
    price: 1.00,
    stock: 0,
  })

  const cartsQuery = useQuery({ query: CartsDocument, variables: {} })

  const productsQuery = useQuery({ query: ProductsDocument, variables: {} })
  
  const updateProductsMutation = useMutation(UpdateProductDocument)
  // cartsQuery.data.value?.carts[0].id

  const internalSelectedCart = ref<string>('')
  const selectedCart = computed({
    get: (): string => {
      const localCartKey = localStorage.getItem('selected-cart')
      return internalSelectedCart.value || localCartKey || ''
    },
    set: (val) => {
      if (!val) { return }
      internalSelectedCart.value = val
      localStorage.setItem('selected-cart', val)
    }
  })
  </script>