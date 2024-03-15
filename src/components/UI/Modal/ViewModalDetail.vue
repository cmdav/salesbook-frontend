<template>
  <div class="product-detail-container w-full">
    <div class="product-detail w-full">
      <div
        class="product-column bg-red-100 object-contain overflow-hidden rounded-lg product-image"
      >
        <img
          class="object-cover"
          :src="products.product_image"
          :alt="products.product_name"
        />
      </div>
      <div class="product-column product-info flex flex-col gap-4">
        <h1 class="product-name">{{ products.product_name }}</h1>
        <p class="product-description">{{ products.product_description }}</p>
        <div class="product-meta">
          <div class="flex flex-row justify-between items-center">
            <span class="font-semibold">Type:</span
            ><span>{{ products.product_type }}</span>
          </div>
          <div class="flex flex-row justify-between items-center">
            <span class="font-semibold">Category:</span
            ><span>{{ products.product_category }}</span>
          </div>
          <div class="flex flex-row justify-between items-center">
            <span class="font-semibold">Sub-Category:</span
            ><span>{{ products.product_sub_category }}</span>
          </div>
          <div class="flex flex-row justify-between items-center">
            <span class="font-semibold">Measurement:</span
            ><span>{{ products.measurement }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { products } = defineProps({
  products: Object,
});
</script>

<style lang="scss" scoped>
.product-detail-container {
  display: flex;
  justify-content: space-between;
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
    .product-name,
    .product-description,
    .product-meta {
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
