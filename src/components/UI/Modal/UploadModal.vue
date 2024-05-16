<template>
  <CenteredModalLarge>
    <div class="p-4">
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] pb-[35px] mb-[35px] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
          Upload {{ props.type }}
        </h4>
        <button @click="$emit('close')" class="text-[30px]">X</button>
      </header>
      <div>
        <form
          class="flex flex-col gap-[17px]"
          action="POST"
          @submit.prevent="handleUpload()"
        >
          <div class="flex flex-col gap-[17px]">
            <div class="flex flex-col w-full gap-[10px]">
              <div class="flex h-40 rounded-lg flex-col w-full">
                <label
                  for="upload_file"
                  class="bg-secondary-800 border-dashed h-full items-center cursor-pointer border-[#254035AB] border-[1.789px] p-2 py-6 flex flex-col text-center relative rounded-[5.982px]"
                >
                  <div class="flex flex-col">
                    <p class="text-[#000000] text-[12.516px] font-Satoshi500">
                      Upload file, max 10MB each.
                    </p>
                    <CloudUploadIcon class="mx-auto text-primary-900 mt-4" />
                  </div>
                  <span>{{ fileName }} </span>
                </label>
                <input
                  type="file"
                  name=""
                  ref="fileInput"
                  @change="handleFileChange"
                  accept=".csv"
                  hidden
                  id="upload_file"
                />
              </div>
              <button class="bg-brand text-center p-2 rounded-lg w-full">
                Download Sample
              </button>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row w-full gap-[30px]">
            <div class="w-full flex justify-center">
              <button
                type="submit"
                class="btn-brand !border-none !w-[30%] mx-auto !py-3 lg:!px-10 !px-5 !text-[#FFFFFF] text-center"
              >
                <span v-if="!loading" class="text-[12.067px]">Upload</span>
                <Loader v-else />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </CenteredModalLarge>
</template>

<script setup>
import { ref, toRefs } from "vue";
// import { useSharedComponent } from "@/composable/useSharedComponent";

// const { useUploadComposable } = useSharedComponent();
import { useUploadComposable } from "@/composable/useUploadComposable";
const emit = defineEmits(["close", "updated"]);

const fileInput = ref(null);
const fileName = ref("");
let uploadedFile = ref(null);
const props = defineProps({
  type: String,
  url: String,
});
const handleFileChange = () => {
  const file = fileInput.value.files[0];
  if (file) {
    fileName.value = file.name;
    uploadedFile.value = file;
    console.log(uploadedFile);
  } else {
    fileName.value = "";
  }
};
const { type, url } = toRefs(props);
const { uploadForm, loading, forceUpdate, showUploadModal } = useUploadComposable(
  url,
  uploadedFile,
  type,
  emit
);

const forceRefresh = () => {
  forceUpdate.value++;
};

const handleUpload = async () => {
  await uploadForm();
  console.log()
  if (showUploadModal.value === false) {
    emit("updated");
    emit("close");
    forceRefresh()
    console.log("It entered the refresh function")
  }
  // emit("close");
};

// const handleUploadFile = () => {
//   try {
//   } catch {}
// };
</script>
