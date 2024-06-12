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
                                <option v-for="subscriber_plan in subscriberPlans" :key="subscriber_plan.id"
                                        :value="subscriber_plan.id.toString()">
                                    {{ subscriber_plan.plan_name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label>Organization<span class="required">*</span></label>
                            <select v-model="subscriber.organization_id" disabled>
                                <option v-for="organization in organizations" :key="organization.id"
                                        :value="organization.id">
                                    {{ organization.organization_name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label>Start Date<span class="required">*</span></label>
                            <input type="date"
                                   class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                                   required name="start-date" placeholder="Start Date" :min="minExpiryDate"
                                   v-model="subscriber.start_time" @change="selectedDate(subscriber.start_time)" />
                        </div>
                        <div>
                            <label>End Time<span class="required">*</span></label>
                            <input type="date"
                                   class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                                   required name="end-date" placeholder="End Date" :min="setEndDate"
                                   v-model="subscriber.end_time" @change="selectedDate()" />
                        </div>
                    </div>
                </div>
                <button type="submit" class="button submit-button">Submit</button>
            </form>
        </div>
    </DashboardLayout>
</template>

<script setup>
// Import necessary functions and components from Vue and other dependencies
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

// Initialize the router for navigation
const router = useRouter();
const route = useRoute();

// Reactive variables for data and state
const subscriberPlans = ref([]);
const organizations = ref([]);
const isLoading = ref(false);
const error = ref(null);
const setEndDate = ref(null);
const organizationId = ref(route.params.organization_id);
const planId = ref(route.params.planId);
const startTime = ref(route.params.startTime);
const endTime = ref(route.params.endTime);
// Reactive variable for the subscriber
const subscriber = reactive({
    plan_id: planId.value,
    organization_id: organizationId.value,
    start_time: startTime.value,
    end_time: endTime.value,
});

// Set minimum expiry date to today's date
const minExpiryDate = new Date().toISOString().split('T')[0];

const getMinEndTime = (startTime) => {
    if (!startTime) return '';
    const start = new Date(startTime);
    const minEnd = new Date(start);
    minEnd.setDate(start.getDate() + 1);
    setEndDate.value = minEnd.toISOString().slice(0, 10);
    return minEnd.toISOString().slice(0, 16);
};

// Function to fetch data from the API
const fetchData = async () => {
    try {
        isLoading.value = true; // Set loading state to true
        const [organizationResponse, subscriberResponse] = await Promise.all([
            apiService.get('all-organizations'),
            apiService.get('all-subscriptions'),
            apiService.get(`subscription-statuses/${organizationId.value}`),
        ]);

        //Handle subscriber plans response
        if (subscriberResponse.data) {
            subscriberPlans.value = subscriberResponse.data;
        } else {
            error.value = 'No subscriber plans found';
        }

        // organization response
        if (organizationResponse.data) {
            organizations.value = organizationResponse.data;
        } else {
            error.value = 'No organizations found';
        }
    } catch (err) {
        catchAxiosError(err); // Handle error
    } finally {
        isLoading.value = false; // Set loading state to false
    }
};

// const fetchData = async () => {
//     try {
//         isLoading.value = true; // Set loading state to true

//         // Fetch organization data
//         const organizationResponse = await apiService.get(`organization/${organizationId.value}`);
        
//         // Fetch subscription data
//         const subscriptionResponse = await apiService.get(`subscription-statuses/${organizationId.value}`);
        
//         // Fetch list of available plans
//         const plansResponse = await apiService.get('all-subscriptions');

//         if (organizationResponse.data && subscriptionResponse.data && plansResponse.data) {
//             const organizationData = organizationResponse.data;
//             const subscriptionData = subscriptionResponse.data;
//             const plansData = plansResponse.data;

//             // Set organization ID
//             subscriber.organization_id = organizationData.id;

//             // Set plan ID
//             subscriber.plan_id = subscriptionData.plan_id;

//             // Set start and end times
//             subscriber.start_time = subscriptionData.start_time;
//             subscriber.end_time = subscriptionData.end_time;

//             // Populate plan options
//             subscriberPlans.value = plansData;

//         } else {
//             error.value = 'Data not found';
//         }
//     } catch (err) {
//         catchAxiosError(err); // Handle error
//     } finally {
//         isLoading.value = false; // Set loading state to false
//     }
// };


// Function to handle form submission
const handleSubmit = async () => {
    try {
        const response = await apiService.update(`subscription-statuses/${organizationId.value}`, subscriber);
        catchAxiosSuccess(response);
        router.push('/subscriptions'); // Redirect to the subscriptions page if the update is successful
    } catch (err) {
        catchAxiosError(err); // Handle error
    }
};

watch(
    () => subscriber.start_time,
    (newTime) => {
        getMinEndTime(newTime);
        const newStartDate = new Date(newTime);
        const endDate = new Date(subscriber.end_time);

        if (newStartDate.toISOString().slice(0, 10) === subscriber.end_time) {
            subscriber.end_time = setEndDate.value;
        }
        if (newStartDate > endDate) {
            subscriber.end_time = "";
        }
    }
);

// Fetch initial data when the component is mounted
onMounted(() => {
    fetchData(organizationId.value);
    console.log(organizationId.value)
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