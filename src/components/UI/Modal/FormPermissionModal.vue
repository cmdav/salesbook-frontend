<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[700px] bg-white m-0 md:px-5 py-4 px-4">
      <header class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">Add Permission</h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <form @submit.prevent="handleAddPermissions">
        <div class="flex flex-col overflow-y-auto h-[60vh] gap-4">
          <div>
            <label>Product Role</label>
            <select class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
              v-model="formData.role_id"
              @change="changePermission(formData.role_id)"
              >
              <option v-for="(option, optionIndex) in roles?.data" :key="optionIndex" :value="option.id">
                {{ option.role_name }}
              </option>
            </select>
          </div>
          <table>
            <tr>
              <th>Page Name</th>
              <th>View</th>
              <th>Create</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
            <tr v-for="(permission, index) in formData.permissions" :key="index">
              <td>{{ permission.page_name }}</td>
              <td><input type="checkbox" v-model="permission.read" :true-value="1" :false-value="0"></td>
              <td><input type="checkbox" v-model="permission.write" :true-value="1" :false-value="0"></td>
              <td><input type="checkbox" v-model="permission.update" :true-value="1" :false-value="0"></td>
              <td><input type="checkbox" v-model="permission.del" :true-value="1" :false-value="0"></td>
            </tr>
          </table>
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
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSecurityStore } from "@/stores/security";
const securityStore = useSecurityStore();
const { allPages, roles } = storeToRefs(securityStore);
let loading = ref(false);
const formData = reactive({
  role_id: "",
  permissions: [],
});

const emit = defineEmits(["close"]);

onMounted(async () => {
  try {
    await securityStore.handleGetAllRole();
    await securityStore.handleGetPages();
    formData.permissions = allPages.value.map(page => ({
      page_id: page.id,
      page_name: page.page_name, 
      read: 0,
      write: 0,
      update: 0,
      del: 0,
    }));
  } catch (error) {
    console.error(error);
  }
});
const changePermission = async (role_id) => {
  loading.value = true;
  console.log(role_id);  

  try {
    let res = await securityStore.handleGetPermissions(role_id);
    console.log(res);

    if (res.length === 0) {
    
      formData.permissions = allPages.value.map(page => ({
        page_id: page.id,
        page_name: page.page_name,
        read: 0,
        write: 0,
        update: 0,
        del: 0,
      }));
    } else {
  
      formData.permissions = res.map(perm => ({
        page_id: perm.page_id,
        page_name: perm.page_name,
        read: perm.read || 0,
        write: perm.write || 0,
        update: perm.update || 0,
        del: perm.del || 0,
      }));
    }

    loading.value = false;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    loading.value = false;
  }
};

const handleAddPermissions = async () => {
  loading.value = true;
  let payload = {
    role_id: formData.role_id,
    permissions: formData.permissions.map(({ page_id, read, write, update, del }) => ({
      page_id,
      read,
      write,
      update,
      del
    }))
  };
  try {
    let res = await securityStore.handleAddPermissions(payload);
    emit("close");
    loading.value = false;
    return res;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};
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
