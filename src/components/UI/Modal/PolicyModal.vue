<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black/50 transition-opacity"></div>
        <div class="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
            <h2 class="text-xl font-semibold text-gray-900">Terms of Service & Privacy Policy</h2>
            <button 
              @click="$emit('close')" 
              class="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <!-- Terms of Service Section -->
            <section class="mb-8">
              <h3 class="text-2xl font-bold mb-4 text-gray-900">Terms of Service</h3>
              <div class="prose prose-sm max-w-none">
                <h4 class="text-lg font-semibold mb-4">Welcome to iSalesBook!</h4>
                <p class="mb-4">
                  Thank you for choosing iSalesBook, a software solution powered by RDAS Software Limited, designed to streamline 
                  and automate inventory, sales, supplier, purchase, and store management for businesses.
                </p>

                <div class="space-y-6">
                  <div>
                    <h5 class="font-semibold mb-2">1. Acceptance of Terms</h5>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>By accessing or using iSalesBook, you confirm that you have read, understood, and agree to be bound by these Terms of Service, as well as any applicable laws and regulations.</li>
                      <li>If you do not agree to these terms, you are advised to discontinue using the software immediately.</li>
                      <li>Continued use of iSalesBook implies acceptance of any updates or modifications to these terms.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">2. Scope of Use</h5>
                    <p>iSalesBook is developed to support businesses in managing their operational and supply chain needs effectively.</p>
                    <ul class="list-disc pl-5 space-y-2 mt-2">
                      <li><strong>Permitted Use:</strong> iSalesBook is intended solely for legitimate business purposes, including managing inventory, tracking sales, recording supplier and purchase details, and store operations.</li>
                      <li><strong>Prohibited Actions:</strong> Users are expressly forbidden from:
                        <ul class="list-disc pl-5 mt-1">
                          <li>Engaging in illegal, unauthorized, or fraudulent activities using the software.</li>
                          <li>Copying, modifying, replicating, reverse-engineering, or disrupting the software's functionality.</li>
                          <li>Sharing account access credentials with unauthorized parties.</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <!-- Additional Terms sections... -->
                </div>
              </div>
            </section>

            <!-- Privacy Policy Section -->
            <section class="mt-8">
              <h3 class="text-2xl font-bold mb-4 text-gray-900">Privacy Policy</h3>
              <div class="prose prose-sm max-w-none">
                <h4 class="text-lg font-semibold mb-4">Welcome to iSalesBook!</h4>
                <p class="mb-4">
                  At iSalesBook, powered by RDAS Software Limited, your privacy is a top priority. 
                  This policy explains how we collect, use, and protect your information.
                </p>

                <div class="space-y-6">
                  <div>
                    <h5 class="font-semibold mb-2">1. Information We Collect</h5>
                    <p>We collect:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Business Data: Inventory details, sales records, and supplier information.</li>
                      <li>Personal Data: Names, email addresses, and login credentials.</li>
                      <li>Usage Data: Logs of interactions for performance optimization.</li>
                    </ul>
                  </div>

                  <!-- Additional Privacy sections... -->
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.prose :deep(h5) {
  color: #374151;
  margin-top: 1.5em;
}

.prose :deep(ul) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>