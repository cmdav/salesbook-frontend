
import DataTableLayout from "@/components/Layouts/dataTableLayout.vue";
import FormModal from "@/components/UI/Modal/FormModal.vue";
import ViewModal from "@/components/UI/Modal/ViewModal.vue";
import ViewModalDetail from "@/components/UI/Modal/ViewModalDetail.vue";
import ReusableForm from "@/components/Form/ReusableForm.vue";
import Loader from "@/components/UI/Loader.vue";
import { usePostComposable } from '@/composable/usePostComposable';
import { useSelectComposable } from '@/composable/useSelectComposable';
import { useEditComposable } from "@/composable/useEditComposable";
import { useReadComposable } from "@/composable/useReadComposable";
import { useDeleteComposable } from "@/composable/useDeleteComposable";
import EditModal from "@/components/UI/Modal/EditModal.vue"; 

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
        EditModal
      
    };
}
