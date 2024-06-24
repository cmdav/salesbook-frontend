<template>
    <DashboardLayout pageTitle="Subscriptions">
        <div class="actions">

            <div class="container">
                <div class="content">
                    <div class="subscription-info">
                        <div class="info-row">
                            <span class="label">Plan</span>
                            <span :if="data.subscription_plan_name" class="value">{{ data.subscription_plan_name ||  "N/A"}}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Organization Name</span>
                            <span :if="data.organization_name" class="value">{{ data.organization_name ? data.organization_name : "N/A" }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Status</span>
                            <span :if="data.status" class="value">{{ data.status ? data.status : "N/A" }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Start Date</span>
                            <span :if="data.start_time" class="value">{{ data.start_time ? data.start_time : "N/A" }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">End Date</span>
                            <span :if="data.end_time" class="value">{{ data.end_time ? data.end_time : "N/A" }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/apiService';
import { useStore } from "@/stores/user";

const data = ref([]);
const getUserOrganization = useStore()

const organizationId = getUserOrganization.getUser.user.organization_id 
console.log('User', getUserOrganization.getUser.user.organization_id)

async function fetchData() {
    try {
        const response = await apiService.get(`subscription-statuses/${organizationId}`)
        data.value = response || [];
        console.log(data.value.organization_name)
    } catch (error) {
        console.error('Failed to fetch data:', error)
    }
}

onMounted(() => fetchData());
</script>

<style scoped>
.content {
    flex-grow: 1;
    padding: 20px;
}

.subscription-info {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 1px solid black;
}

.info-row .label {
    font-weight: bold;
}


.actions {
    text-align: right;
}

.actions button {
    background-color: #d9534f;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.actions button:hover {
    background-color: #c9302c;
}
</style>
