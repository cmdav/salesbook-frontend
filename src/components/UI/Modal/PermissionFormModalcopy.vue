<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div
      class="modal__body relative w-full md:max-w-[700px] bg-white m-0 md:px-5 py-4 px-4"
    >
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add permission</h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>

      <form @submit.prevent="handleAddPermissions">
        <div class="flex flex-col overflow-y-auto h-[60vh] gap-4">
          <div>
            <label>Product Role</label>
            <select
              class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
              v-model="formData.role_id"
            >
              <option
                v-for="(option, optionIndex) in roles?.data"
                :key="optionIndex"
                :value="option.id"
              >
                {{ option.role_name }}
              </option>
            </select>
          </div>
          <div
            class="flex flex-col gap-2"
            v-for="(field, index) in allPages"
            :key="index"
          >
            <label class="!capitalize font-extrabold text-xl underline"
              >{{ field.page_name }} Page
            </label>
            <div class="flex flex-row gap-3">
              <div>
                <label class="!capitalize">View Access</label>

                <select
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  v-model="formData.permissions[index].read"
                >
                  <option
                    v-for="(option, optionIndex) in [
                      { label: 'Remove access', value: 0 },
                      { label: 'Grant access', value: 1 },
                    ]"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label>Create Access </label>

                <select
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  v-model="formData.permissions[index].write"
                >
                  <option
                    v-for="(option, optionIndex) in [
                      { label: 'Remove access', value: 0 },
                      { label: 'Grant access', value: 1 },
                    ]"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label>Edit Access</label>
                <select
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  v-model="formData.permissions[index].update"
                >
                  <option
                    v-for="(option, optionIndex) in [
                      { label: 'Remove access', value: 0 },
                      { label: 'Grant access', value: 1 },
                    ]"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label>Delete</label>

                <select
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                  v-model="formData.permissions[index].delete"
                >
                  <option
                    v-for="(option, optionIndex) in [
                      { label: 'Remove access', value: 0 },
                      { label: 'Grant access', value: 1 },
                    ]"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-3">
          <input type="submit" v-if="!loading" class="btn-brand" />
          <Loader v-else />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSecurityStore } from "@/stores/security";
const securityStore = useSecurityStore();
const { allRoles, allPages, roles, pages, permissions } = storeToRefs(securityStore);
let loading = ref(false);
const formData = reactive({
  role_id: "",
  permissions: Array.from({ length: allPages?.value?.length }, () => ({
    page_id: allPages.value?.map((item) => item.id)[
      Math.floor(Math.random() * allPages.value?.length)
    ],
    read: 0,
    write: 0,
    update: 0,
    delete: 0,
  })),
});
const emit = defineEmits(["close"]);

// {
//   "page_id": "9bb548f7-b6ad-4963-8893-dda9e660d6e9",
//   "read": "1",
//   "write": "0",
//   "update": "1",
//   "delete": "0"
// },

const handleAddPermissions = async () => {
  loading.value = true;
  let payload = {
    role_id: formData.role_id,
    permissions: formData.permissions,
  };
  try {
    let res = await securityStore.handleAddPermissions(payload);
    await securityStore.handleGetPermissions();

    emit("close");
    loading.value = false;

    return res;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};
onMounted(async () => {
  try {
    await securityStore.handleGetAllRole();
    await securityStore.handleGetRole();
    await securityStore.handleGetPages();
    await securityStore.handleGetAllPages();
    await securityStore.handleGetPermissions();
    // await securityStore.handleAddPermissions();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
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

.modal__body {
  position: relative;
  max-width: 900px; // Consider using max-width for better responsiveness
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh; // Set a maximum height
  overflow-y: auto; // Enable vertical scrolling
}

.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
}
</style>
