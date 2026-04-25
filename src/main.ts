import "./assets/main.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import piniaPluginPersistence from "pinia-plugin-persistedstate"

// 1. Khởi tạo một instance DUY NHẤT của ứng dụng
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistence)
// 2. Cài đặt các plugin (như Pinia) vào đúng instance đó
app.use(pinia)

// 3. Cuối cùng mới mount ứng dụng lên giao diện
app.mount("#app")
