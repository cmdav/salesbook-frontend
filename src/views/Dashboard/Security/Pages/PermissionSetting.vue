<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-4xl bg-white rounded-lg shadow overflow-hidden">
      <form @submit.prevent="handleAddPermissions" class="p-8">
        <div class="mb-6">
          <label for="role" class="block mb-2 text-sm font-medium text-gray-900">Select Role</label>
          <select id="role"
            v-model="formData.role_id"
            @change="changePermission(formData.role_id)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option v-for="(option, optionIndex) in allRoles" :key="optionIndex" :value="option.id">
              {{ option.role_name }}
            </option>
          </select>
        </div>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th class="p-4">Page Name</th>
              <th class="p-4">View</th>
              <th class="p-4">Create</th>
              <th class="p-4">Update</th>
              <th class="p-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(permission, index) in formData.permissions" :key="index" class="border-b">
              <td class="p-4">{{ permission.page_name }}</td>
              <td class="p-4 text-center"><input type="checkbox" v-model="permission.read" :true-value="1" :false-value="0"></td>
              <td class="p-4 text-center"><input type="checkbox" v-model="permission.write" :true-value="1" :false-value="0"></td>
              <td class="p-4 text-center"><input type="checkbox" v-model="permission.update" :true-value="1" :false-value="0"></td>
              <td class="p-4 text-center"><input type="checkbox" v-model="permission.del" :true-value="1" :false-value="0"></td>
            </tr>
          </tbody>
        </table>
        <div class="mt-6 flex justify-center">
          <button type="submit" v-if="!loading" class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Submit</button>
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
const { allPages, allRoles } = storeToRefs(securityStore);
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
