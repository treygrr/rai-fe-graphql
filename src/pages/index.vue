<template>
    <div>
        <CartButton></CartButton>
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
        <form @submit.prevent style="display: flex; flex-direction: column;">
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
          <button @click="createForm">Submit</button>
        </form>
      </ClientOnly>
      <h2>Products:</h2>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <div v-for="product in productsQuery.data.value?.products">
          <Product :product="product" enable-add-to-cart></Product>
        </div>
      </div>
  
    </div>
  </template>
  
  <script lang="ts" setup>
  import { type Product, ProductsDocument, UpdateProductDocument } from '@gql';
  
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
  
  const productsQuery = useQuery({ query: ProductsDocument, variables: {} })
  
  const updateProductsMutation = useMutation(UpdateProductDocument)
  
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