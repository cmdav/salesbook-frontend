
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import SettingsLayout from "@/components/Layouts/settingsLayout.vue";
import FormModal from "@/components/UI/Modal/FormModal.vue";
import PermissionFormModal from "@/components/UI/Modal/PermissionFormModal.vue";
 import { defineEmits } from "vue";
import ViewModal from "@/components/UI/Modal/ViewModal.vue";
import ViewModalDetail from "@/components/UI/Modal/ViewModalDetail.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue";
import ReusablePermissionForm from "@/components/Form/ReusablePermissionForm.vue";
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from '@/composable/usePostComposable';
import {usePermissionPostComposable} from '@/composable/usePermissionPostComposable'
import { useSelectComposable } from '@/composable/useSelectComposable'
import { useUploadComposable } from '@/composable/useUploadComposable'
import { useEditComposable } from "@/composable/useEditComposable";
import { useReadComposable } from "@/composable/useReadComposable";
import { useDeleteComposable } from "@/composable/useDeleteComposable";
import DeleteModal from "@/components/UI/Modal/DeleteModal.vue";
import EditModal from "@/components/UI/Modal/EditModal.vue"; 
import UploadModal from "@/components/UI/Modal/UploadModal.vue";
import { useStore } from "@/stores/user";
import { computed } from 'vue';


export function useSharedComponent() {
  

    return {
      DataTableLayout,
      FormModal,
      ViewModal,
      ViewModalDetail,
      ReusableForm,
      Loader,
      usePostComposable,
      useSelectComposable,
      useEditComposable,
      useReadComposable,
      useDeleteComposable,
      useUploadComposable,
      usePermissionPostComposable,
      DeleteModal,
      EditModal,
      defineEmits,
      useStore,
      computed,
      UploadModal,
      ReusablePermissionForm,
      PermissionFormModal,
      SettingsLayout,
      
    }
}
