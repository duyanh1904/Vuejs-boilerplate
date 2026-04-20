import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'

// 1. Khởi tạo một instance DUY NHẤT của ứng dụng
const app = createApp(App)

// 2. Cài đặt các plugin (như Pinia) vào đúng instance đó
app.use(createPinia())

// 3. Cuối cùng mới mount ứng dụng lên giao diện
app.mount('#app')