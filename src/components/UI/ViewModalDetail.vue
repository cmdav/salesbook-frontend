<template>
  <div class="product-detail-container">
    <div class="product-detail">
      <div class="product-column product-image">
        <img :src="products.product_image" :alt="products.product_name" />
      </div>
      <div class="product-column product-info">
        <h1 class="product-name">{{ products.product_name }}</h1>
        <p class="product-description">{{ products.product_description }}</p>
        <div class="product-meta">
          <span class="product-type">Type: {{ products.product_type }}</span>
          <span class="product-category">Category: {{ products.product_category }}</span>
          <span class="product-sub-category">Sub-Category: {{ products.product_sub_category }}</span>
          <span class="product-measurement">Measurement: {{ products.measurement }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const { products } = defineProps({
    products: Object
  });
</script>

<style lang="scss" scoped>
  .product-detail-container {
    display: flex;
    justify-content: center;
  }
  .product-detail {
    display: flex;
    align-items: stretch; 
    margin: 20px;
    .product-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      &:first-child {
        margin-right: 20px;
      }
    }
    .product-image {
      flex-grow: 1; 
      img {
        height: 100%; 
        object-fit: cover; 
        width: 100%;
      }
    }
    .product-info {
      position: relative;
      .close-button {
        position: absolute;
        top: 0;
        right: 0;
        margin: 20px;
        cursor: pointer;
      }
      .product-name, .product-description, .product-meta {
        margin-top: 20px;
        span {
          display: block;
          margin-bottom: 5px;
        }
      }
      .product-name {
        color: #333;
        font-size: 24px;
      }
      .product-description {
        color: #666;
        font-size: 16px;
      }
      .product-meta span {
        color: #444;
      }
    }
  }
</style>
