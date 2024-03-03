import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import vuetify from "@/plugins/vuetify.js";
import router from "@/router/index.js";
const app = createApp(App)
app.use(createPinia()).use(router).use(vuetify)
app.mount('#app')
