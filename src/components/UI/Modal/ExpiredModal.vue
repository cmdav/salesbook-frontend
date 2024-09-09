<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      
        <div class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
          <h3 class="text-[32px] font-EBGaramond500 text-[#244034]">Expiring Products List</h3>
          <button class="close-btn" @click="$emit('close')">X</button>
        </div>

        <div class="table-container">
            <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
            <p>Loading expired products...</p>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>PRODUCT NAME</th>
                <th>QUANTITY AVAILABLE</th>
                <th>BATCH NO</th>
                <th>SUB CATEGORY</th>
                <th>PURCHASE UNIT</th>
                <th>SELLING UNIT</th>
                <th>EXPIRE DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in expiredProducts" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.product_type_name }}</td>
                <td>{{ item.quantity_available }}</td>
                <td>{{ item.batch_no }}</td>
                <td>{{ item.product_sub_category }}</td>
                <td>{{ item.purchase_unit_name }}</td>
                <td>{{ item.selling_unit_name }}</td>
                <td>{{ item.expiry_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer my-6">
          <button class="button download-btn" @click="downloadExpiredProducts">Download</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const expiredProducts = ref([])
const isLoading = ref(true)
const loading = ref(false)

async function fetchExpiredProducts() {
  try {
  isLoading.value = true
    const response = await apiService.get('/list-expired-products')
    console.log(response)
    expiredProducts.value = response.data || []
    catchAxiosSuccess(response)
    console.log(expiredProducts.value)
  } catch (error) {
    console.error('Failed to fetch expired products:', error)
    catchAxiosError()
  } finally{
  isLoading.value = false
  }
}


const downloadExpiredProducts = async () => {
  loading.value = true; // Start loading

  try {
    // Fetch expired products data
    const expiredProductsResponse = await apiService.get('/list-expired-products', {
  params: {
    download: true
  }
});

    const expiredProductsData = expiredProductsResponse.data || [];

    // Fetch organization details from the API
    const orgDetailsCache = ref(null);
    const orgDetailsResponse = await apiService.get('/user-org-and-branch-details');
    
    if (orgDetailsResponse.success) {
      orgDetailsCache.value = orgDetailsResponse.data;
    } else {
      throw new Error("Failed to fetch organization details");
    }

    if (expiredProductsData.length > 0 && orgDetailsCache.value) {
      const doc = new jsPDF();

      // Extract organization details
      const {
        organization_name,
        organization_logo,
        company_address,
        company_phone_number,
        company_email,
        branch_name,
        branch_address,
        branch_email,
        branch_phone_number,
        country_name,
        state_name
      } = orgDetailsCache.value;

      doc.setFontSize(12);
      const pageWidth = doc.internal.pageSize.getWidth();
      const headerYPosition = 10;

      // Header Information
      doc.text(organization_name || "", pageWidth / 2, headerYPosition, { align: "center" });
      doc.text(company_address || "", pageWidth / 2, headerYPosition + 6, { align: "center" });
      doc.text(`${company_phone_number || ""} | ${company_email || ""}`, pageWidth / 2, headerYPosition + 12, { align: "center" });
      doc.text(`${branch_name || ""} Branch`, pageWidth / 2, headerYPosition + 18, { align: "center" });
      doc.text(`Address: ${branch_address || ""}, ${state_name || ""}, ${country_name || ""}`, pageWidth / 2, headerYPosition + 24, { align: "center" });
      doc.text(`${branch_phone_number || ""} | ${branch_email || ""}`, pageWidth / 2, headerYPosition + 30, { align: "center" });

      // Company Logo
      if (organization_logo) {
        const img = new Image();
        img.src = organization_logo;
        doc.addImage(img, 'PNG', 10, 10, 40, 20); // Adjust dimensions
      }

      // Set table headers for expired products
      const tableHeaders = [
        "S.No",
        "Product Sub Category",
        "Product Name",
        "Batch No",
        "Expiry Date",
        "Purchase Unit",
        "Selling Unit",
        "Quantity Available" // Move quantity available to the last column
      ];

      // Prepare table data
      const tableData = expiredProductsData.map((item, index) => {
        return [
          index + 1, // Serial number
          item.product_sub_category || "N/A",
          item.product_type_name || "N/A",
          item.batch_no || "N/A",
          item.expiry_date || "N/A",
          item.purchase_unit_name || "N/A",
          item.selling_unit_name || "N/A",
          item.quantity_available || "N/A" // Quantity available as the last column
        ];
      });

      // Calculate the grand total for Quantity Available
      const grandTotalQuantityAvailable = expiredProductsData.reduce((total, item) => {
        return total + (item.quantity_available || 0);
      }, 0);

      // Add grand total row at the end of the table
      tableData.push([
        "Grand Total", "", "", "", "", "", "", grandTotalQuantityAvailable.toString()
      ]);

      // Add the report title and table
      doc.setFontSize(18);
      doc.text("Expired Products Report", 14, headerYPosition + 40); // Adjust position below the header

      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: headerYPosition + 50, // Adjust startY for spacing
        styles: {
          fontSize: 10,
          fontStyle: 'bold',
        },
        theme: 'grid',
      });

      // Save the PDF
      doc.save("expired-products-report.pdf");
    } else {
      console.error("No data found for expired products or organization details");
    }
  } catch (error) {
    console.error("Error downloading expired products:", error);
  } finally {
    loading.value = false; // Stop loading
  }
};



onMounted(() => {
  fetchExpiredProducts()
})
</script>

<style scoped>
.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal__body {
  position: relative;
  max-width: fit-content;
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh;
  overflow-y: auto; 
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 50%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background-color: red;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

table-container {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 2px solid #c35214;
  white-space: nowrap;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

thead {
  background-color: #c35214;
}

.download-btn {
  background-color: #c35214;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
