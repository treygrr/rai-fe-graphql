<template>
    <div>
      <CartButton></CartButton>
      <label for="cart-select">Choose a cart:</label>
      <select v-model="selectedCart" id="cart-select" title="select cart">
        <option v-for="cart in cartsQuery.data.value?.carts" :value="cart.id">{{ cart.id }}</option>
      </select>
      <ClientOnly>
        <form @submit.prevent style="display: flex; flex-direction: column;">
          <h2>Update Product Form</h2>
          <label>
            ID
            <input type="text" name="id" v-model="updateFormData.id">
          </label>
          <label>
            Product Title
            <input v-model="updateFormData.title" type="text" name="title" placeholder="Product Title">
          </label>
          <label>
            Stock
            <input v-model="updateFormData.stock" type="number" name="stock" value="stock" placeholder="0">
          </label>
          <label>
            Price
            <input v-model="updateFormData.price" type="number" name="price" value="price" placeholder="0">
          </label>
          <button @click="updateForm">Submit</button>
        </form>
        <form  style="display: flex; flex-direction: column;">
          <h2>Create Product Form</h2>
          <label>
            ID
            <input type="text" name="id" v-model="createFormData.id">
          </label>
          <label>
            Product Title
            <input v-model="createFormData.title" type="text" name="title" placeholder="Product Title">
          </label>
          <label>
            Stock
            <input v-model="createFormData.stock" type="number" name="stock" value="stock" placeholder="0">
          </label>
          <label>
            Price
            <input v-model="createFormData.price" type="number" name="price" value="price" placeholder="0">
          </label>
          <button @click.prevent="createForm">Submit</button>
        </form>
      </ClientOnly>
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




  const updateForm = () => {
    updateProductsMutation.executeMutation({ input: updateFormData.value })
  }
  
  const createForm = () => {
    createFormData.value.id = crypto.randomUUID()
    updateProductsMutation.executeMutation({ input: createFormData.value })
  }
  
  const addToCart = () => {
  
  }
  </script>