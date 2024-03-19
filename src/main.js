import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { VueQueryPlugin } from 'vue-query'
import DashboardLayout from "@/components/Layouts/dashboardLayout.vue";
import AngleRight from '@/components/icons/AngleRight.vue'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.component('DashboardLayout', DashboardLayout)
app.component('AngleRight', AngleRight)
app.use(VueTelInput)
app.use(Toast, { position: POSITION.TOP_RIGHT })
app.use(VueQueryPlugin)

app.mount('#app')
