<template>
    <DashboardLayout pageTitle="Subscriptions Page">
        <div class="pricing-table flex justify-center p-5 bg-gray-900">
            <div class="plan flex flex-col bg-gray-800 border border-gray-600 rounded-lg m-4 p-6 w-80 text-center"
                v-for="(plan, index) in plans" :key="index">
                <div class="plan-title text-2xl mb-4 text-white">{{ plan.title }}</div>
                <!-- <div class="plan-price text-4xl mb-8 text-white">{{ plan.price }}</div> -->
                <!-- <ul class="plan-features list-none p-0 mb-auto text-white">
                    <li class="mb-2" v-for="(feature, fIndex) in plan.features" :key="fIndex">{{ feature }}</li>
                </ul> -->
                <button class="plan-button mt-6 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">Choose
                    Plan</button>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import apiService from '@/services/apiService';
import { onMounted, watch, ref, reactive } from "vue";
const plans = ref([
    {
        title: "Basic",
    },
    {
        title: "Standard",
    },
    {
        title: "Premium",
    }
])
 

const getAllSubscribtions = async () => {
    try {
        const response = await apiService.get(`all-organizations`);
        console.log(response)
        return response
    } catch (error) {
        console.error('Failed to get subscriptions:', error);
    }
};

watch( getAllSubscribtions() )

</script>
<style lang="scss" scoped>
$background-color: #fff;
$plan-background-color: #2c2c3e;
$border-color: #444;
$button-background-color: #c35214;
$button-text-color: #fff;

.pricing-table {
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: $background-color;
    margin-top: 10%;

    .plan {
        background: $plan-background-color;
        border: 1px solid $border-color;
        border-radius: 10px;
        margin: 10px;
        padding: 20px;
        width: 300px;
        text-align: center;

        &-title {
            font-size: 1.5em;
            margin-bottom: 10px;
        }

        &-price {
            font-size: 2em;
            margin-bottom: 20px;
        }

        &-features {
            list-style-type: none;
            padding: 0;

            li {
                margin: 10px 0;
            }
        }

        &-button {
            background-color: $button-background-color;
            color: $button-text-color;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;

            &:hover {
                background-color: darken($button-background-color, 10%);
            }
        }
    }
}
</style>