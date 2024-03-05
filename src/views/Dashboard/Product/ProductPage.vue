<template>
  <DashboardLayout>
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div>
        <div class="lg:px-6 px-3 pt-8 grid grid-rows gap-4">
          <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
              <div>
                <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Total Products</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  {{ products?.total }}
                </div>
              </div>
            </div>

            <!-- <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(0, 175, 239)"
            >
              <div>
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Rejected Supply</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div>
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(44, 43, 108)"
            >
              <div>
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Pending Supply</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div>
            <div
              class="flex flex-row justify-between rounded-[8px] p-4"
              style="background-color: rgb(123, 97, 255)"
            >
              <div>
                <div
                  class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
                >
                  <span>Canceled Supply</span>
                </div>
                <div
                  class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]"
                >
                  0
                </div>
              </div>
            </div> -->
          </div>
          <div class="chart hidden bg-white rounded-[8px] min-h-[100vh] p-4"></div>
          <div class="bg-white py-6 mt-12 rounded-lg">
            <div class="flex lg:flex-row flex-col gap-3 px-4 justify-between mb-4">
              <div class="flex lg:flex-row flex-col justify-between w-full gap-2">
                <div class="w-[40%]">
                  <AuthInput
                    :error="false"
                    type="text"
                    placeholder="search"
                    v-model="sortInput.name"
                  />
                </div>
                <div class="flex flex-row gap-[12px]">
                  <!-- <button
                    @click="HandleToggleUploadModal"
                    class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                  >
                    Add Products Categories
                  </button> -->
                  <button
                    @click="HandleToggleModal"
                    class="p-4 bg-brand py-[12px] text-white rounded-[4px]"
                  >
                    Add Products
                  </button>
                </div>
              </div>
            </div>
            <div class="">
              <div class="table-container">
                <table class="table-auto w-full">
                  <thead class="bg-[#F9FBFF] text-[#A8AABC] text-[14px]">
                    <tr>
                      <th class="py-4 pl-4 flex">S/N</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">Product name</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">measurement</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">category</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">sub-category</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize">unit</th>
                      <th class="text-left p-4 pr-0 px-6 capitalize"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, index) in filteredJobs"
                      :key="i"
                      class="border-b text-[14px]"
                    >
                      <td class="py-4 pl-4">
                        {{ index + 1 }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        <button class="flex flex-row items-center gap-3 justify-start">
                          <img
                            :src="i.product_image"
                            class="h-[40px] w-[40px] rounded-full"
                            alt=""
                          />

                          {{ i.product_name }}
                        </button>
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.measurement_name }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.product_category }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">
                        {{ i.product_sub_category }}
                      </td>
                      <td class="text-left p-4 pr-0 pl-6 capitalize">{{ i.unit }}</td>
                      <td class="relative !flex !justify-end !items-center">
                        <button
                          class="flex h-full justify-end items-center p-6 !px-6"
                          @click="toggleDocument(i)"
                        >
                          <svg
                            class="cursor-pointer flex lg:flex-row flex-col gap-4 justify-end"
                            xmlns="http://www.w3.org/2000/svg"
                            width="5"
                            height="19"
                            viewBox="0 0 5 19"
                            fill="none"
                          >
                            <circle
                              cx="2.25781"
                              cy="16.1094"
                              r="2"
                              transform="rotate(-90 2.25781 16.1094)"
                              fill="#3F634D"
                            />
                            <circle
                              cx="2.25781"
                              cy="9.10938"
                              r="2"
                              transform="rotate(-90 2.25781 9.10938)"
                              fill="#3F634D"
                            />
                            <circle
                              cx="2.25781"
                              cy="2.10938"
                              r="2"
                              transform="rotate(-90 2.25781 2.10938)"
                              fill="#3F634D"
                            />
                          </svg>
                        </button>

                        <Dropdown
                          v-if="showDocument.id == i.id && showDocumentToggle"
                          :showDropdown="showDocument.id == i.id && showDocumentToggle"
                          class="-bottom-[8rem] w-36 z-10 top-12 lg:right-15"
                          :link="false"
                          :id="`dropdown` + i.id"
                          @closeDropdown="closeDropdown"
                        >
                          <ul class="!mb-0">
                            <li>
                              <button
                                class="text-left p-2 flex items-center px-[20px] gap-[12px] hover:bg-gray-100 w-full"
                              >
                                <p>View</p>
                              </button>
                            </li>
                            <li>
                              <button
                                class="text-left p-2 flex items-center px-[20px] gap-[12px] hover:bg-gray-100 w-full"
                              >
                                <p>Edit</p>
                              </button>
                            </li>
                          </ul>
                        </Dropdown>
                      </td>
                    </tr>
                  </tbody>
                  <!---->
                </table>
              </div>
            </div>
            <div class="mx-auto w-fit mt-5">
              <Pagination
                @changePage="setCurrentPage"
                :currentPage="products?.current_page"
                :pageSize="products?.per_page"
                :totalPages="2"
                :alwaysShowNextAndPrevious="true"
              />
            </div>
          </div>
        </div>
      </div>

      <CenteredModalLarge v-if="showModal">
        <div class="p-4">
          <div v-if="step == 1">
            <header
              class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[10px] border-b-[1px]"
            >
              <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Product</h4>
              <button @click="HandleToggleModal" class="text-[30px]">X</button>
            </header>
            <div
              class="flex flex-row w-full justify-end gap-[10px] pb-6 border-b-[#000000] border-b-[1px]"
            >
              <button
                @click="addCategory"
                class="bg-brand text-white w-[30%] text-center py-2 px-1 rounded-lg"
              >
                Add Category
              </button>
              <button
                @click="addSubCategory"
                class="bg-brand text-white w-[30%] text-center py-2 px-1 rounded-lg"
              >
                Add sub category
              </button>
              <button
                @click="changeStep(4)"
                class="bg-brand text-white w-[40%] text-center py-2 px-1 rounded-lg"
              >
                Add measurement
              </button>
            </div>

            <div>
              <div class="flex flex-col gap-[17px]">
                <div class="flex flex-col gap-[17px]">
                  <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                    <div class="flex flex-col rounded-lg h-auto w-full">
                      <Label>Product Image</Label>

                      <label
                        for="upload_file"
                        class="bg-secondary-800 border-dashed cursor-pointer overflow-hidden h-[117px] border-[#254035AB] border-[1.789px] flex flex-col text-center relative rounded-[5.982px]"
                      >
                        <img
                          v-if="addProductData.product_image"
                          :src="addProductData.product_image"
                          class="w-full h-[117px] object-cover mb-4 rounded-md"
                        />

                        <div v-else class="flex flex-col p-2 py-4">
                          <p class="font-Satoshi500 text-[12.3px] text-[#000]">
                            Drag and Drop file or <span class="underline">Browse</span>
                          </p>
                          <CloudUploadIcon class="mx-auto text-primary-900 mt-4" />
                        </div>
                      </label>
                      <input
                        type="file"
                        name=""
                        ref="previewImage"
                        accept=".jpg,.png"
                        hidden
                        id="upload_file"
                        @change="uploadFile"
                      />
                    </div>
                  </div>

                  <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                    <div class="flex flex-col w-full">
                      <AuthInput
                        label="Product Name"
                        :error="false"
                        type="text"
                        v-model="addProductData.product_name"
                      />
                    </div>
                    <div class="flex flex-col w-full">
                      <Label>Category</Label>
                      <div
                        class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
                      >
                        <a-select
                          :bordered="false"
                          :show-arrow="false"
                          class="w-full"
                          show-search
                          v-model:value="addProductData.category"
                        >
                          <a-select-option
                            v-for="item in productCategories"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.category_name }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </div>
                  <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                    <div class="flex flex-col w-full">
                      <Label>Measurement</Label>
                      <div
                        class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
                      >
                        <a-select
                          :bordered="false"
                          :show-arrow="false"
                          class="w-full"
                          show-search
                          v-model:value="addProductData.measurement_id"
                        >
                          <a-select-option
                            v-for="item in measurements"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.measurement_name }} ( {{ item.unit }}
                            )
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div class="flex flex-col w-full">
                      <Label>Sub Category</Label>
                      <div
                        class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
                      >
                        <a-select
                          :bordered="false"
                          :show-arrow="false"
                          class="w-full"
                          show-search
                          v-model:value="addProductData.sub_category_id"
                        >
                          <a-select-option
                            v-for="item in allProductSubCategories"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.sub_category_name }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </div>

                  <div class="flex lg:flex-row flex-col w-full gap-[20px]">
                    <div class="flex flex-col w-full">
                      <Label>Description</Label>
                      <div
                        class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
                      >
                        <a-textarea
                          :bordered="false"
                          v-model:value="addProductData.product_description"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col lg:flex-row w-full gap-[30px]">
                  <div class="w-full flex justify-center">
                    <button
                      @click="handleAddProduct"
                      class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                    >
                      <span v-if="!loading" class="text-[12.067px]">Add</span>
                      <Loader v-else />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- add product category -->
          <div v-if="step == 2" class="flex flex-col w-full gap-[20px]">
            <header
              class="flex flex-row items-center gap-2 justify-start border-b-[#000000] pb-[5px] mb-[10px] border-b-[1px]"
            >
              <button @click="changeStep(1)" class="text-[30px]">
                <ArrowLeftIcon class="!h-[40px]" />
              </button>

              <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Category</h4>
            </header>

            <div class="flex flex-col w-full py-4">
              <AuthInput
                v-model="addProductCategoryData.category_name"
                label="Category Name"
                :error="false"
                type="text"
              />
            </div>
            <div class="flex lg:flex-row flex-col w-full gap-[20px]">
              <div class="flex flex-col w-full">
                <Label>Description</Label>
                <div
                  class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
                >
                  <a-textarea
                    v-model:value="addProductCategoryData.category_description"
                    :bordered="false"
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col lg:flex-row w-full gap-[30px]">
              <div class="w-full flex justify-center">
                <button
                  @click="handleAddProductCategory"
                  class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                >
                  <span v-if="!loading" class="text-[12.067px]">Add</span>
                  <Loader v-else />
                </button>
              </div>
            </div>
          </div>
          <!-- sub product categoy -->
          <div v-if="step == 3" class="flex flex-col w-full gap-[20px]">
            <header
              class="flex flex-row items-center gap-2 justify-start border-b-[#000000] pb-[5px] mb-[10px] border-b-[1px]"
            >
              <button @click="changeStep(1)" class="text-[30px]">
                <ArrowLeftIcon class="!h-[40px]" />
              </button>

              <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
                Add Sub Category
              </h4>
            </header>
            <div class="flex flex-col w-full">
              <Label>Select Category</Label>
              <div
                class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
              >
                <a-select
                  :bordered="false"
                  :show-arrow="false"
                  class="w-full"
                  v-model:value="addSubProductCategoryData.category_id"
                  show-search
                >
                  <a-select-option
                    v-for="item in productCategories"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.category_name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="flex flex-col w-full py-4">
              <AuthInput
                label="Sub Category Name"
                :error="false"
                type="text"
                v-model="addSubProductCategoryData.sub_category_name"
              />
            </div>
            <div class="flex lg:flex-row flex-col w-full gap-[20px]">
              <div class="flex flex-col w-full">
                <Label>Description</Label>
                <div
                  class="w-full font-light font-Satoshi400 bg-white !p-0 border-neutral-900 border-[0.509px] opacity-[0.8029] rounded-[4px] text-[12.68px]"
                >
                  <a-textarea
                    v-model:value="addSubProductCategoryData.sub_category_description"
                    :bordered="false"
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col lg:flex-row w-full gap-[30px]">
              <div class="w-full flex justify-center">
                <button
                  @click="handleAddProductSubCategory"
                  class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                >
                  <span v-if="!loading" class="text-[12.067px]">Add</span>
                  <Loader v-else />
                </button>
              </div>
            </div>
          </div>
          <div v-if="step == 4" class="flex flex-col w-full gap-[20px]">
            <header
              class="flex flex-row items-center gap-2 justify-start border-b-[#000000] pb-[5px] mb-[10px] border-b-[1px]"
            >
              <button @click="changeStep(1)" class="text-[30px]">
                <ArrowLeftIcon class="!h-[40px]" />
              </button>

              <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
                Add Measurements
              </h4>
            </header>

            <div class="flex flex-col w-full py-4">
              <AuthInput
                v-model="addMeasurementsData.measurement_name"
                label=" Name"
                :error="false"
                type="text"
              />
            </div>
            <div class="flex flex-col w-full py-4">
              <AuthInput
                v-model="addMeasurementsData.unit"
                label="unit "
                :error="false"
                type="text"
              />
            </div>

            <div class="flex flex-col lg:flex-row w-full gap-[30px]">
              <div class="w-full flex justify-center">
                <button
                  @click="addMeasurements"
                  class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
                >
                  <span v-if="!loading" class="text-[12.067px]">Add</span>
                  <Loader v-else />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CenteredModalLarge>
    </div>
  </DashboardLayout>
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useProductStore } from "@/stores/products";
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import CenteredModalLarge from "@/components/UI/CenteredModalLarge.vue";
import AuthInput from "@/components/UI/Input/AuthInput.vue";
import Pagination from "@/components/UI/Pagination/Pagination.vue";
import Loader from "@/components/UI/Loader.vue";
import Dropdown from "@/components/UI/Dropdown/Dropdown.vue";
import Label from "@/components/UI/Input/Label.vue";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon.vue";
import { storeToRefs } from "pinia";
const productsStore = useProductStore();
const {
  products,
  productCategories,
  productSubCategories,
  allProductSubCategories,
  measurements,
} = storeToRefs(productsStore);
import { useStore } from "@/stores/user";
const store = useStore();
const { userProfileDetails } = storeToRefs(store);
import CloudUploadIcon from "@/components/icons/cloudUploadIcon.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const showDocument = ref({});
const showDocumentToggle = ref(false);
const redirectToSingleProductPage = () => {
  // router.push({ name: "view-Product", params: { id } });
};
let sortInput = reactive({
  name: "",
});
const step = ref(1);
const addProductData = reactive({
  product_name: "",
  product_description: "",
  product_image: "",
  measurement_id: "",
  sub_category_id: "",
  category: "",
});
const addProductCategoryData = reactive({
  category_name: "",
  category_description: "",
});
const addMeasurementsData = reactive({
  measurement_name: "",
  unit: "",
});
const addSubProductCategoryData = reactive({
  sub_category_name: "",
  category_id: "",
  sub_category_description: "",
});
const currentPage = ref(1);

const addCategory = () => {
  step.value = 2;
};
const addSubCategory = () => {
  step.value = 3;
};
const changeStep = (value) => {
  step.value = value;
};
let showModal = ref(false);
let loading = ref(false);

const errors = reactive({
  product_name: false,
  product_description: false,
  product_image: false,
  measurement_id: false,
  sub_category_id: false,
  category: false,
});
const validateForm = () => {
  // Reset errorsMsg
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  // Perform validation before submission
  let isValid = true;

  Object.keys(addProductData).forEach((key) => {
    if (!addProductData[key]) {
      errors[key] = true;
      isValid = false;
    }
  });

  return isValid;
};
// Function to clear input errors
const clearInputErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });
};
const clearInputs = () => {
  (addProductData.product_name = ""),
    (addProductData.product_description = ""),
    (addProductData.product_image = null);
  addProductData.measurement_id = "";
  addProductData.sub_category_id = "";
  addProductData.category = "";
};
watch(addProductData, () => {
  clearInputErrors();
});
function HandleToggleModal() {
  showModal.value = !showModal.value;
  clearInputs();
}
const toggleDocument = (document) => {
  if (showDocument.value.id === document.id) {
    return (showDocumentToggle.value = !showDocumentToggle.value);
  }
  showDocument.value = document;
  showDocumentToggle.value = true;
};
const closeDropdown = () => {
  showDocumentToggle.value = false;
};

const previewImage = ref(null);
const uploadedImageName = ref("");

// const uploadFile = (event) => {
//   // businessDetails.value.company_logo = previewImage.value.files[0];
//   const file = event.target.files[0];

//   if (file) {
//     const reader = new FileReader();
//     uploadedImageName.value = file.name;

//     reader.onload = () => {
//       addProductData.product_image = reader.result;
//     };
//     reader.readAsDataURL(file);
//   } else {
//     addProductData.product_image = "";
//   }

//   showImage();
// };
const uploadFile = (event) => {
  const file = event.target.files[0]; // Retrieve the uploaded file

  if (file) {
    // Check if a file is uploaded
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/svg",
    ]; // Define valid image file types

    if (validImageTypes.includes(file.type)) {
      // Check if the file type is valid
      if (file.size <= 2048 * 1024) {
        // Check if the file size is within the limit (2048 KB)
        const reader = new FileReader(); // Create a FileReader object to read file content

        // Set the uploaded image name to display
        uploadedImageName.value = file.name;

        reader.onload = () => {
          // When FileReader has loaded the file
          // Set the product image data to the result of FileReader
          addProductData.product_image = reader.result;
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
      } else {
        // File size exceeds the limit, handle error
        console.error("The uploaded file size exceeds the limit.");
      }
    } else {
      // Invalid file type, handle error
      console.error("Invalid file type. Please upload an image file.");
    }
  } else {
    // If no file is uploaded
    addProductData.product_image = ""; // Clear the product image data
  }

  showImage(); // Show the uploaded image
};

const showImage = async () => {
  if (addProductData.product_image) {
    previewImage.value = URL.createObjectURL(addProductData.product_image);
  } else {
    previewImage.value = null;
  }
};

const handleAddProduct = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  let payload = {
    product_name: addProductData.product_name,
    product_description: addProductData.product_description,
    product_image: addProductData.product_image,
    measurement_id: addProductData.measurement_id,
    sub_category_id: addProductData.sub_category_id,
    category_id: addProductData.category,
  };
  try {
    let res = await productsStore.handleAddProducts(payload);
    productsStore.handleGetProducts();
    HandleToggleModal();
    loading.value = false;
    clearInputs();
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const handleAddProductCategory = async () => {
  loading.value = true;
  // if (!validateForm()) {
  //   loading.value = false;
  //   return;
  // }
  let payload = {
    category_name: addProductCategoryData.category_name,
    category_description: addProductCategoryData.category_description,
  };
  try {
    let res = await productsStore.handleAddProductsCategory(payload);
    productsStore.handleGetProductCategories();
    loading.value = false;
    changeStep(1);
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    addProductCategoryData.category_name = "";
    addProductCategoryData.category_description = "";
  }
};
const handleAddProductSubCategory = async () => {
  loading.value = true;
  // if (!validateForm()) {
  //   loading.value = false;
  //   return;
  // }
  let payload = {
    sub_category_name: addSubProductCategoryData.sub_category_name,
    category_id: addSubProductCategoryData.category_id,
    sub_category_description: addSubProductCategoryData.sub_category_description,
  };
  try {
    let res = await productsStore.handleAddProductsSubCategory(payload);
    productsStore.handleGetProductSubCategories();
    loading.value = false;
    changeStep(1);
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    addSubProductCategoryData.product_name = "";
    addSubProductCategoryData.category_id = "";
    addSubProductCategoryData.sub_category_description = "";
  }
};
const addMeasurements = async () => {
  loading.value = true;
  // if (!validateForm()) {
  //   loading.value = false;
  //   return;
  // }
  let payload = {
    measurement_name: addMeasurementsData.measurement_name,
    unit: addMeasurementsData.unit,
  };
  try {
    let res = await productsStore.handleAddMeasurements(payload);
    productsStore.handleGetMeasurements();
    loading.value = false;
    changeStep(1);
    return res;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    addMeasurementsData.measurement_name = "";
    addMeasurementsData.unit = "";
  }
};
const fetchProducts = async (page) => {
  try {
    let res = await productsStore.handleGetProducts(page);
    return res;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
const setCurrentPage = (page) => {
  products.value.current_page = page;
  fetchProducts(page);
};
const filteredJobs = computed(() => {
  // Create a shallow copy of the jobs array
  let filtered = products.value?.data;

  // Filtering based on the search criteria
  if (sortInput.name) {
    return filtered.filter((item) =>
      item.product_name.toLowerCase().includes(sortInput.name.toLowerCase())
    );
  }

  return filtered; // Return the filtered array
});

onMounted(async () => {
  await productsStore.handleGetProducts(products?.value?.current_page);
  await productsStore.handleGetProductCategories();
  await productsStore.handleGetProductSubCategories();
  await productsStore.handleGetAllProductSubCategories();
  await productsStore.handleGetMeasurements();
  await store.handleUserProfile();
});
</script>
