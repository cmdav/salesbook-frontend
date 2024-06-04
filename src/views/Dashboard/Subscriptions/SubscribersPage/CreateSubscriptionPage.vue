<template>
    <DashboardLayout pageTitle="Add Subscribers">
        <div class="container">
            <div class="top-buttons">
                <router-link to="/subscriptions" class="button back-btn">Back</router-link>
            </div>
            <div v-if="isLoading" class="loading-icon">Loading...</div>
            <form v-else @submit.prevent="handleSubmit">
                <!-- <div class="batch-container">
          <label for="batch_no">Batch No</label>
          <input type="text" v-model="batchNo" readonly />
        </div> -->
                <div v-for="(subscrib, index) in subscribers" :key="index" class="purchase-form">
                    <!-- <div v-if="index !== 0" class="top-buttons">
            <button type="button" @click="addPurchase" class="button add-purchase-button">Add Purchase</button>
          </div> -->
                    <div class="form-row">
                        <div>
                            <label>Subscription Plan<span class="required">*</span></label>
                            <select v-model="subscrib.plan_id">
                                <option v-for="subscriber_plan in subscriberPlan" :key="subscriber_plan.id"
                                    :value="subscriber_plan.id.toString()">
                                    {{ subscriber_plan.plan_name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label>Organization<span class="required">*</span></label>
                            <select v-model="subscrib.organization_id">
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
                                v-model="subscrib.start_time" @change="selectedDate(subscrib.start_time)" />
                        </div>
                        <div>
                            <label>End Time<span class="required">*</span></label>
                            <input id="" type="date"
                                class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                                required name="end-date" placeholder="End Date" :min="setEndDate"
                                v-model="subscrib.end_time" @change="selectedDate()" />
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
// Import necessary functions and components from Vue and other dependencies
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';

// Initialize the router for navigation
const router = useRouter();

// Reactive variables for data and state
const subscriberPlan = ref([]);
const organization = ref([]);
const batchNo = ref('');
const isLoading = ref(false);
const error = ref(null);
const setEndDate = ref(null);

// Reactive variable for subscribers array
const subscribers = reactive([
    {
        plan_id: '',
        organization_id: '',
        start_time: '',
        end_time: '',
    }
]);

// Set minimum expiry date to today's date
const minExpiryDate = new Date().toISOString().split('T')[0];

// const defaultMinDate = ref('1900-01-01')
// let constantMinDate = hasMinDate ? minDate : defaultMinDate

const selectedDate = (start_time) => {
    console.log(`Subscriber  Start Time:`, subscribers[0].start_time);
    console.log(setEndDate.value)
    console.log(subscribers)
}

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
        ]);

        // Handle suppliers response
        if (subscriberResponse.data) {
            subscriberPlan.value = subscriberResponse.data.data;
            console.log(subscriberResponse)
            // subscribers[0].supplier_id = suppliers.value[0].id;
        } else {
            error.value = 'No subscribers found';
        }

        // Handle product types response
        if (organizationResponse.data) {
            organization.value = organizationResponse.data;
            console.log('Organization Value', organization.value)
        } else {
            error.value = 'No Organizations found';
        }

        // Handle last batch number response
    } catch (err) {
        catchAxiosError(err); // Handle error
    } finally {
        isLoading.value = false; // Set loading state to false
    }
};

// Function to handle supplier change and fetch latest supplier price

// Function to add a new purchase row
// const addPurchase = () => {
//   const lastPurchase = purchases[purchases.length - 1];
//   if (lastPurchase.supplier_id && lastPurchase.product_type_id && lastPurchase.quantity && lastPurchase.cost_price && lastPurchase.selling_price) {
//     purchases.push({
//       supplier_id: suppliers.value.length > 0 ? suppliers.value[0].id : '',
//       product_type_id: '',
//       price_id: '',
//       cost_price: '',
//       selling_price: '',
//       batch_no: batchNo.value,
//       quantity: '',
//       product_identifier: '',
//       expiry_date: '',
//       original_selling_price: null
//     });
//   } else {
//     catchAxiosError({ message: 'Please fill out all required fields before adding a new purchase.' });
//   }
// };

// // Function to check for duplicate purchases
// const isDuplicatePurchase = (supplier_id, product_type_id) => {
//   return purchases.some(purchase => purchase.supplier_id === supplier_id && purchase.product_type_id === product_type_id);
// };

// Function to handle form submission
const handleSubmit = async () => {
    // Handle form submission
    try {
        const response = await apiService.post('subscription-statuses', subscribers[0]);
        catchAxiosSuccess(response);
        router.push('/subscriptions'); // Redirect to the view purchase page if the submission is successful
    } catch (err) {
        catchAxiosError(err); // Handle error
    }
};

watch(
    () => subscribers[0].start_time,
    (newTime) => {
        getMinEndTime(newTime)
        const newStartDate = new Date(newTime)
        const endDate = new Date(subscribers[0].end_time)
        const equalStartDate = new Date(subscribers[0].end_time)

        console.log('Watch endDate', setEndDate.value)
        console.log(newStartDate, endDate)

        console.log('equal start date', equalStartDate, endDate)
        // console.log(equalS ===   endDate)

        if (newStartDate.toISOString().slice(0, 10) === subscribers[0].end_time) {
            subscribers[0].end_time = setEndDate.value
            console.log('In the Equal statement')
        }
        if (newStartDate > endDate) {
            subscribers[0].end_time = ""
            console.log('In the if statement')
        }

    }
);

// Fetch initial data when the component is mounted
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
