<template>
<div class="actions">
     
      <div>
        <!-- <button class="button add-btn l-btn" @click="openPayMthdModal">
          Add Payment Method
        </button> -->
        <button class="button add-btn" @click="toggleModal" >
          Add Payment Type Details
        </button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>ACCOUNT NAME</th>
            <th>ACCOUNT NUMBER</th>
            <th>PAYMENT IDENTIFIER</th>
            <th>PAYMENT TYPE</th>
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.account_name }}</td>
            <td>{{ item.account_number }}</td>
            <td>{{ item.payment_identifier }}</td>
            <td>{{ item.payment_name }}</td>
            <td><button @click="handleEdit(item)">Edit</button></td>
            <td><button @click="handleDelete(item)">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
   
   <!-- <FormModal v-if="showModal" @close="closeModal" :key="forceUpdate" @updated="forceRefresh" :formTitle="'Add Payment Details'" :fields="paymentFormFields"
       :url="'payment-details'" />

   <FormModal v-if="showMthdModal" @close="closeMthdModal" :key="forceUpdate" @updated="forceRefresh" @method-added="refreshPaymentMethods" :formTitle="'Add Payment Methods'" :fields="payMethodFormFields"
       :url="'payment-methods'" /> -->

       <AddPaymentModal
      v-if="showModal"
      @close="closeModal"
       @paymentDetailsUpdated="refreshPaymentDetails"
    />

       <EditModal 
       v-if="showEditModal" 
       @close="closeEditModal" 
       :items="items" 
       :formField="paymentFormFields"
      @updated="forceRefresh" 
      :url="'payment-details'" />

       <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'payment-details'" :modalTitle="modalTitle" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { paymentFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";
import AddPaymentModal from "@/components/UI/Modal/AddPaymentModal.vue";
import apiService from '@/services/apiService';

const {
  useSelectComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,

} = useSharedComponent("payment-details");

const { fetchDataForSelect } = useSelectComposable(paymentFormFields, 'payment-details', "payment_method_id");
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable();
const { handleDelete, showDeleteModal, itemsId, closeDeleteModal } = useDeleteComposable();


const data = ref([]);
const errorMessage = ref('');
const showModal = ref(false);
// const showMthdModal = ref(false);
const modalTitle = ref('Delete Payment Details')

const fetchPayment = async() => {
  try {
    const response = await apiService.get('/payment-details')
    console.log(response)
    data.value = response.data || []

    if (data.value.length === 0) {
      errorMessage.value = 'No items found'
    } else {
      errorMessage.value = ''
    }
  } catch (error) {
    console.error('Failed to fetch product type names:', error)
  }
}

// const refreshPaymentMethods = async () => {
//   try {
    
//     await fetchDataForSelect("Payment Type", "/payment-methods", "id", "payment_name");
//   } catch (error) {
//     console.error("Error refreshing payment methods:", error);
//   }
// };

onMounted(async () => {
  fetchPayment()
})

onMounted(async () => {
  await fetchDataForSelect("Payment Type", "/payment-methods", "id", "payment_name");
});

const toggleModal = () => {
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
}

// const openPayMthdModal = () => {
//   showMthdModal.value = true;
// }

// const closeMthdModal = () => {
//   showMthdModal.value = false;
// }

// function forceUpdate(){
//   fetchPayment()
// }

const refreshPaymentDetails = () => {
  fetchPayment() 
  closeModal();  
}

function forceRefresh() {
  fetchPayment()
}
</script>

<style scoped>
.actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.l-btn{
  margin-right: 1.2em;
}

.upload-btn {
  background-color: #c35214;
  margin-right: 2em;
}

.add-btn {
  /* margin-left:; */
  background-color: #c35214;
}

.table-container {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

th {
  padding: 8px;
  text-align: left;
  border: 1px solid #fff; /* Add borders around cells */
  white-space: nowrap;
  color: #fff;
}

td {
  padding: 8px;
  text-align: left;
  border: 1px solid #c35214;
  /* Add borders around cells */
  white-space: nowrap;
  color: #c35214;
  font-size: 0.9em;
  text-transform: capitalize;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

thead {
  background-color: #c35214;
}

.error-message {
  color: rgb(171, 26, 26);
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
}
</style>