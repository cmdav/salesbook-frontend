<template>
  <DashboardLayout pageTitle="Report">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="space-y-6">

        <!-- Cards Section -->
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-6">
          <div class="grid lg:grid-cols-5 grid-cols-1 gap-6">
            
            <!-- Card for Monthly Sales -->
            <div @click="showReport('monthly-sales')" :class="getActiveClass('monthly-sales')" class="flex flex-row justify-between rounded-[8px] p-4 cursor-pointer" style="background-color: rgb(44, 43, 108)">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px]">
                  Monthly Sales Report
                  <br />
                  <small>(Total sales for this month)</small>
                </div>
              </div>
            </div>

            <!-- Card for Total Sales -->
            <div @click="showReport('total-sales')" :class="getActiveClass('total-sales')" class="flex flex-row justify-between rounded-[8px] p-4 cursor-pointer" style="background-color: rgb(44, 43, 108)">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px]">
                  Total Sales Report
                  <br />
                  <small>(Total sale within a given period)</small>
                </div>
              </div>
            </div>

            <!-- Card for Item List -->
            <div @click="showReport('item-list')" :class="getActiveClass('item-list')" class="flex flex-row justify-between rounded-[8px] p-4 cursor-pointer" style="background-color: rgb(123, 97, 255)">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px]">
                  Item List
                  <br />
                  <small>(All the items in the store within a given period)</small>
                </div>
              </div>
            </div>

            <!-- Card for Price List -->
            <div @click="showReport('price-list')" :class="getActiveClass('price-list')" class="flex flex-row justify-between rounded-[8px] p-4 cursor-pointer" style="background-color: rgb(123, 97, 255)">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px]">
                  Price List
                  <br />
                  <small>(Products and their prices)</small>
                </div>
              </div>
            </div>

            <!-- Card for Product Expiration -->
            <div @click="showReport('expired-product')" :class="getActiveClass('expired-product')" class="flex flex-row justify-between rounded-[8px] p-4 cursor-pointer" style="background-color: rgb(44, 43, 108)">
              <div>
                <div class="title font-Satoshi700 text-white py-4 text-[16px]">
                  Product Expiration Report
                  <br />
                  <small>(All products that will expire within a given period)</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date picker form for reports that require date range -->
        <div v-if="showDatePicker" class="my-4 flex flex-wrap items-center gap-4">
          <div class="form-group w-full md:w-1/4">
            <label for="start-date">Start Date:</label>
            <input type="date" id="start-date" v-model="startDate" class="form-input w-full" />
          </div>
          <div class="form-group w-full md:w-1/4">
            <label for="end-date">End Date:</label>
            <input type="date" id="end-date" v-model="endDate" class="form-input w-full" />
          </div>
          <div class="w-full md:w-auto">
            <button @click="fetchReportData(currentReportType)" class="btn-primary">Get Report</button>
          </div>
        </div>

        <!-- Download PDF Button -->
        <div v-if="reportData.length > 0" class="flex justify-end mb-4">
          <button @click="downloadPDF" class="btn-primary" :disabled="loading">
            <span v-if="loading">Downloading...</span>
            <span v-else>Download PDF</span>
          </button>
        </div>

        <!-- Table to show report data -->
        <div v-if="reportData.length > 0" class="overflow-x-auto mt-6">
          <h3 class="text-xl font-bold mb-4">{{ currentReportTitle }}</h3> <!-- Report Title -->
          <table class="min-w-full table-auto">
            <thead>
              <tr>
                <th class="px-4 py-2">S.No</th>
                <th v-for="(column, index) in formattedColumns" :key="index" class="px-4 py-2">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in reportData" :key="index" class="hover:bg-gray-200">
                <td class="border px-4 py-2">{{ index + 1 }}</td>
                <td v-for="(column, colIndex) in columns" :key="colIndex" class="border px-4 py-2">{{ item[column] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center my-4">
          <p>No records found.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import apiService from "@/services/apiService";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// To control the date picker and report data
const showDatePicker = ref(false);
const reportData = ref([]);
const columns = ref([]); // Dynamic columns based on report type
const startDate = ref("");
const endDate = ref("");
const currentReportType = ref(""); // Track the current report type
const loading = ref(false); // Loading state for PDF download

// To control report title
const reportTitles = {
  'monthly-sales': 'Monthly Sales Report',
  'item-list': 'Item List Report',
  'total-sales': 'Total Sales Report',
  'price-list': 'Price List Report',
  'expired-product': 'Product Expiration Report'
};

const currentReportTitle = computed(() => reportTitles[currentReportType.value] || "");

// Computed property to format column names
const formattedColumns = computed(() => {
  return columns.value.map((column) => {
    return column
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  });
});

// Function to handle the card click
const showReport = async (reportType) => {
  reportData.value = [];
  currentReportType.value = reportType; // Set the current report type
  if (["item-list", "total-sales", "expired-product"].includes(reportType)) {
    showDatePicker.value = true; // Show date picker for these reports
  } else {
    showDatePicker.value = false; // No date picker needed for other reports
    fetchReportData(reportType); // Fetch data directly
  }

  // Set columns based on report type
  switch (reportType) {
    case "monthly-sales":
      columns.value = ["product_type_id", "price_sold_at", "quantity", "total_price"];
      break;
    case "item-list":
      columns.value = ["product_type", "product_description", "batch_no", "branch_name", "quantity_available", "status"];
      break;
    case "total-sales":
      columns.value = ["product_type_id", "price_sold_at", "quantity", "total_price"];
      break;
    case "price-list":
      columns.value = ["product_type_name", "product_description", "cost_price", "selling_price"];
      break;
    case "expired-product":
      columns.value = ["product_sub_category", "product_type_name", "quantity_available", "batch_no", "expiry_date", "purchase_unit_name", "selling_unit_name"];
      break;
  }
};

// Function to highlight the active card
const getActiveClass = (reportType) => {
  return currentReportType.value === reportType ? "bg-yellow-500" : "";
};

// Fetch report data based on report type
const fetchReportData = async (reportType) => {
  let url = "";

  // Set API URL and query parameters based on report type
  switch (reportType) {
    case "monthly-sales":
      url = "/monthly-sale-reports";
      break;
    case "item-list":
      url = `/item-lists?start_date=${startDate.value}&end_date=${endDate.value}`;
      break;
    case "total-sales":
      url = `/total-sale-reports?start_date=${startDate.value}&end_date=${endDate.value}`;
      break;
    case "price-list":
      url = "/product-price-lists";
      break;
    case "expired-product":
      url = `/expired-product-by-dates?start_date=${startDate.value}&end_date=${endDate.value}`;
      break;
    default:
      return;
  }

  try {
    const response = await apiService.get(url);

    if (response.success) {
      reportData.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
  }
};
const orgDetailsCache = ref(null); // Store the organization details response

const downloadPDF = async () => {
  loading.value = true; // Start loading

  let url = "";

  // Set API URL with all=true
  switch (currentReportType.value) {
    case "monthly-sales":
      url = `/monthly-sale-reports?all=true`;
      break;
    case "item-list":
      url = `/item-lists?start_date=${startDate.value}&end_date=${endDate.value}&all=true`;
      break;
    case "total-sales":
      url = `/total-sale-reports?start_date=${startDate.value}&end_date=${endDate.value}&all=true`;
      break;
    case "price-list":
      url = `/product-price-lists?all=true`;
      break;
    case "expired-product":
      url = `/expired-product-by-dates?start_date=${startDate.value}&end_date=${endDate.value}&all=true`;
      break;
    default:
      return;
  }

  try {
    // Fetch report data
    const reportResponse = await apiService.get(url);

    // Check if organization details are already cached
    if (!orgDetailsCache.value) {
      const orgDetailsResponse = await apiService.get('/user-org-and-branch-details');
      if (orgDetailsResponse.success) {
        orgDetailsCache.value = orgDetailsResponse.data; // Cache the response
      } else {
        throw new Error("Failed to fetch organization details");
      }
    }

    // Ensure report data is structured as expected
    if (reportResponse.success && reportResponse.data.length > 0 && orgDetailsCache.value) {
      const doc = new jsPDF();

      // Extract organization and branch details from cache
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

      // Add organization logo if available
      if (organization_logo) {
        const img = new Image();
        img.src = organization_logo;
        doc.addImage(img, 'PNG', 10, 10, 40, 20); // Adjust dimensions and position as necessary
      }

      // Organization details with reduced line spacing
      let yPosition = 15;
      const leftMargin = 60;
      doc.setFontSize(12);

      doc.text(organization_name || "", leftMargin, yPosition); // Organization name
      yPosition += 6; // Reduced line spacing
      doc.text(company_address || "", leftMargin, yPosition); // Company address
      yPosition += 6;
      doc.text(company_phone_number || "", leftMargin, yPosition); // Phone number
      yPosition += 6;
      doc.text(company_email || "", leftMargin, yPosition); // Email

      // Branch details with reduced line spacing
      yPosition += 10; // Space between organization and branch details
      doc.text(`Branch: ${branch_name || ""}`, 10, yPosition);
      yPosition += 6;
      doc.text(`Address: ${branch_address || ""}`, 10, yPosition);
      yPosition += 6;
      doc.text(`Email: ${branch_email || ""}`, 10, yPosition);
      yPosition += 6;
      doc.text(`Phone: ${branch_phone_number || ""}`, 10, yPosition);
      yPosition += 6;
      doc.text(`State: ${state_name || ""}`, 10, yPosition);
      yPosition += 6;
      doc.text(`Country: ${country_name || ""}`, 10, yPosition);

      // Ensure columns are populated
      if (columns.value.length === 0) {
        throw new Error("Columns are not properly defined for the report");
      }

      const tableData = reportResponse.data.map((item, index) => {
        const rowData = [index + 1];
        columns.value.forEach((column) => {
          rowData.push(item[column] || "N/A"); // Provide a default value if a field is missing
        });
        return rowData;
      });

      // Define columns with capitalized and formatted headers
      const tableHeaders = [
        "S.No",
        ...columns.value.map((column) => column.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()))
      ];

      // Add title
      doc.setFontSize(18);
      yPosition += 15; // Adjust position below the header
      doc.text(currentReportTitle.value, 14, yPosition);

      // Generate table using jsPDF autoTable plugin
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: yPosition + 10, // Adjust startY to leave space for the header
        styles: {
          fontSize: 10,
          fontStyle: 'bold',
        },
        theme: 'grid',
      });

      doc.save(`${currentReportTitle.value}.pdf`);
    } else {
      console.error("No data found for the report or organization details");
      throw new Error("No data found for the report or organization details");
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
  } finally {
    loading.value = false; // Stop loading
  }
};


</script>



<style scoped>
/* Responsive Table */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

@media screen and (max-width: 768px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }
  
  th {
    display: none; /* Hide header */
  }
  
  td {
    position: relative;
    padding-left: 50%;
  }
  
  td:before {
    content: attr(data-label); /* Use data-label to provide labels */
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    background-color: #f4f4f4;
  }
}

/* Responsive Form */
.form-group {
  width: 100%;
}

@media screen and (min-width: 768px) {
  .form-group {
    width: calc(50% - 1rem);
  }
}

/* Button */
.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-primary:hover {
  background-color: #45a049;
}

/* Margin for Cards, Table, and Download Button */
.space-y-6 > * {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

/* Active card */
.bg-yellow-500 {
  background-color: #fbbf24 !important;
}
</style>
