<template>
    <DashboardLayout pageTitle="Edit Subscriber">
        <div class="container">
            <div class="top-buttons">
                <router-link to="/subscriptions" class="button back-btn">Back</router-link>
            </div>
            <div v-if="isLoading" class="loading-icon">Loading...</div>
            <form v-else @submit.prevent="handleSubmit">
                <div class="purchase-form">
                    <div class="form-row">
                        <div>
                            <label>Subscription Plan<span class="required">*</span></label>
                            <select v-model="subscriber.plan_id">
                                <option v-for="subscriber_plan in subscriberPlan" :key="subscriber_plan.id"
                                    :value="subscriber_plan.id.toString()">
                                    {{ subscriber_plan.plan_name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label>Organization<span class="required">*</span></label>
                            <select v-model="subscriber.organization_id">
                                <option v-for="organization_type in organization" :key="organization_type.id"
                                    :value="organization_type.id">
                                    {{ organization_type.organization_name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label>Start Date<span class="required">*</span></label>
                            <input id="" type="date"
                                class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                                required name="start-date" placeholder="Start Date" :min="minExpiryDate"
                                v-model="subscriber.start_time" @change="selectedDate(subscriber.start_time)" />
                        </div>
                        <div>
                            <label>End Time<span class="required">*</span></label>
                            <input id="" type="date"
                                class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                                required name="end-date" placeholder="End Date" :min="setEndDate"
                                v-model="subscriber.end_time" @change="selectedDate()" />
                        </div>
                    </div>
                    <hr class="separator" />
                </div>
                <button type="submit" class="button submit-button">Submit</button>
            </form>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

const router = useRouter();
const route = useRoute();

const subscriberPlan = ref([]);
const organization = ref([]);
const isLoading = ref(false);
const error = ref(null);
const setEndDate = ref(null);

const subscriber = reactive({
    id: '',
    plan_id: '',
    organization_id: '',
    start_time: '',
    end_time: ''
});

const minExpiryDate = new Date().toISOString().split('T')[0];

const getMinEndTime = (startTime) => {
    if (!startTime) return '';
    const start = new Date(startTime);
    const minEnd = new Date(start);
    minEnd.setDate(start.getDate() + 1);
    setEndDate.value = minEnd.toISOString().slice(0, 10);
    return minEnd.toISOString().slice(0, 16);
};

const fetchData = async () => {
    try {
        isLoading.value = true;
        const [organizationResponse, subscriberResponse, subscriberDetailResponse] = await Promise.all([
            apiService.get('all-organizations'),
            apiService.get('all-subscriptions'),
            apiService.get(`subscription-statuses/${route.params.id}`)
        ]);

        if (subscriberResponse.data) {
            subscriberPlan.value = subscriberResponse.data;
        } else {
            error.value = 'No subscribers found';
        }

        if (organizationResponse.data) {
            organization.value = organizationResponse.data;
        } else {
            error.value = 'No Organizations found';
        }

        if (subscriberDetailResponse.data) {
            Object.assign(subscriber, subscriberDetailResponse.data);
        } else {
            error.value = 'Subscriber details not found';
        }

    } catch (err) {
        catchAxiosError(err);
    } finally {
        isLoading.value = false;
    }
};

const handleSubmit = async () => {
    try {
        const response = await apiService.put(`subscription-statuses/${subscriber.id}`, subscriber);
        catchAxiosSuccess(response);
        router.push('/subscriptions');
    } catch (err) {
        catchAxiosError(err);
    }
};

watch(
    () => subscriber.start_time,
    (newTime) => {
        getMinEndTime(newTime);
        const newStartDate = new Date(newTime);
        const endDate = new Date(subscriber.end_time);
        // const equalStartDate = new Date(subscriber.end_time);

        if (newStartDate.toISOString().slice(0, 10) === subscriber.end_time) {
            subscriber.end_time = setEndDate.value;
        }
        if (newStartDate > endDate) {
            subscriber.end_time = "";
        }
    }
);

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.container {
    padding: 20px;
}

.top-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.batch-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

batch-container input {
    flex: 1;
    margin-right: 10px;
}

.purchase-form {
    margin-bottom: 20px;
}

.form-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

label {
    display: block;
    margin-bottom: 5px;
}

.required {
    color: red;
}

input,
select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input[type="number"] {
    width: 100px;
}

input[type="date"].expiry-date {
    width: 120px;
}

button {
    margin-right: 10px;
}

.add-purchase-button {
    background-color: #C35214;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.add-purchase-button:disabled {
    background-color: #e86925;
    cursor: not-allowed;
    opacity: 0.65;
}

.add-purchase-button:hover:not(:disabled) {
    background-color: #e86925;
}

.submit-button {
    background-color: #C35214;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #e86925;
}

.back-btn {
    background-color: #6c757d;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.back-btn:hover {
    background-color: #5a6268;
}

.loading-icon {
    text-align: center;
    font-size: 18px;
    margin-bottom: 20px;
}

.separator {
    border: 0;
    border-top: 1px solid #ccc;
    margin-top: 20px;
    margin-bottom: 20px;
}

.priceView {
    font-size: 0.8em;
    border: 2px solid rgb(195 82 20 / 50%);
    background-color: rgb(195 82 20 / 50%);
    color: #fff;
    padding: 0.3%;
    border-radius: 4px;
}
</style>
