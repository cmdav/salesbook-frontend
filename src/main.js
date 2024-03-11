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
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(VueTelInput)
app.use(Toast, { position: POSITION.TOP_RIGHT })
app.use(VueQueryPlugin)

app.mount('#app')
