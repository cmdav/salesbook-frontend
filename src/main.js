import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import Toast, { POSITION, useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { VueQueryPlugin } from 'vue-query'
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import AngleRight from '@/components/icons/AngleRight.vue'
import CenteredModalLarge from '@/components/UI/CenteredModalLarge.vue'
import Loader from '@/components/UI/Loader.vue'
import CloudUploadIcon from '@/components/icons/cloudUploadIcon.vue'
import { registerSW } from 'virtual:pwa-register';
import syncData from '@/utils/sync';

const app = createApp(App)

app.use(Toast, { position: POSITION.TOP_RIGHT });
const toast = useToast();

const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content is available. Refresh?')) {
        updateSW(true); 
      }
    },
    onOfflineReady() {
      console.log('App is ready to work offline.');
      toast.info('Ready for work offline mode')
    },
  });



app.use(createPinia())
app.use(router)
app.use(Antd)
app.component('DashboardLayout', DashboardLayout)
app.component('CenteredModalLarge', CenteredModalLarge)
app.component('CloudUploadIcon', CloudUploadIcon)
app.component('Loader', Loader)
app.component('AngleRight', AngleRight)
app.use(VueTelInput)
app.use(Toast, { position: POSITION.TOP_RIGHT })
app.use(VueQueryPlugin)

syncData();

app.mount('#app')
