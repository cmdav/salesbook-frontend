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

                  <div>
                    <h5 class="font-semibold mb-2">3. Licensing</h5>
                    <p>RDAS Software Limited provides users with a limited, non-exclusive, and revocable license to use iSalesBook in accordance with these terms:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li><strong>Ownership:</strong> The software, including its source code and underlying algorithms, remains the sole property of RDAS Software Limited.</li>
                      <li><strong>License Restrictions:</strong> Redistribution, sublicensing, or using iSalesBook for creating derivative works without explicit written permission is prohibited.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">4. User Responsibilities</h5>
                    <p>Users are responsible for:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li><strong>Compliance with Laws:</strong> Ensuring data entered and actions within the software comply with applicable laws.</li>
                      <li><strong>Accuracy of Data:</strong> Inputting accurate and up-to-date information.</li>
                      <li><strong>Data Backup:</strong> Regularly backing up data to minimize risks of loss.</li>
                      <li><strong>Account Security:</strong> Maintaining the confidentiality of login credentials and reporting security breaches immediately.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">5. Updates and Service Availability</h5>
                    <ul class="list-disc pl-5 space-y-2">
                      <li><strong>Updates:</strong> iSalesBook provides updates for performance and security. Users must install updates promptly.</li>
                      <li><strong>Downtime:</strong> Temporary unavailability may occur during maintenance. RDAS Software Limited will notify users of planned downtime where feasible.</li>
                      <li><strong>No Guarantee:</strong> The software is provided "as-is," without guarantees of uninterrupted access or error-free performance.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">6. Limitation of Liability</h5>
                    <p>RDAS Software Limited will not be held liable for:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Loss of data, revenue, or operational interruptions.</li>
                      <li>Errors caused by user negligence or non-compliance with these terms.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">7. Indemnity</h5>
                    <p>Users agree to indemnify, defend, and hold harmless RDAS Software Limited, its officers, employees, and agents against claims, losses, damages, or liabilities arising from:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Breaches of these terms.</li>
                      <li>Unauthorized disclosure or use of confidential information.</li>
                      <li>Any actions or omissions resulting in infringement of third-party rights.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">8. Governing Law</h5>
                    <p>These terms are governed by the laws of Nigeria. Disputes will be resolved under the exclusive jurisdiction of Nigerian courts.</p>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">9. Termination of Access</h5>
                    <p>RDAS Software Limited reserves the right to suspend or terminate access to iSalesBook for violations of these terms or non-payment of fees.</p>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">10. Contact Us</h5>
                    <p>Email: support@isalesbook.com</p>
                    <p>Website: www.isalesbook.com</p>
                  </div>
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

                  <div>
                    <h5 class="font-semibold mb-2">2. How We Use Your Data</h5>
                    <p>We use collected data to:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Deliver core features like inventory tracking.</li>
                      <li>Improve software performance and user experience.</li>
                      <li>Notify users of updates and promotions.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">3. Data Protection</h5>
                    <p>We employ strict measures such as:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Encryption of data in transit and storage.</li>
                      <li>Access Controls to protect sensitive information.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">4. Cookies and Tracking</h5>
                    <p>iSalesBook uses cookies and similar technologies to:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Personalize user experience and save preferences.</li>
                      <li>Analyze performance and user interactions to improve features.</li>
                      <li>Track usage patterns to enhance functionality.</li>
                    </ul>
                    <p class="mt-2">Users can manage cookies through browser settings, but disabling them may affect functionality.</p>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">5. Data Sharing</h5>
                    <p>We share data only when:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Required by law.</li>
                      <li>Necessary for services, with trusted partners under strict agreements.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">6. Your Rights</h5>
                    <p>You can:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Access and review your data.</li>
                      <li>Request corrections or deletion of personal information.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">7. Retention of Data</h5>
                    <p>We retain your data only as long as necessary to fulfill operational, legal, and business requirements.</p>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">8. Governing Law and Updates</h5>
                    <p>This policy is governed by Nigerian laws and may be updated periodically. Users are encouraged to review it regularly.</p>
                  </div>

                  <div>
                    <h5 class="font-semibold mb-2">9. Contact Us</h5>
                    <p>For inquiries: privacy@isalesbook.com</p>
                  </div>
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