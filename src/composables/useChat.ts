// file: src/composables/useChat.ts
import { ref, watch, nextTick, onMounted } from "vue"
// 1. Nhập Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai"

export interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: number
}

const STORAGE_KEY = "finance_chat_history"

// 2. Khởi tạo Gemini AI bên ngoài composable để tránh tạo lại nhiều lần
// Nhớ đảm bảo bạn đã tạo file .env.local và có VITE_AI_API_KEY
const apiKey = import.meta.env.VITE_AI_API_KEY || ""
const genAI = new GoogleGenerativeAI(apiKey)

export function useChat() {
  // ==========================================
  // STATE CỦA COMPOSABLE
  // ==========================================
  const isOpen = ref(false)
  const inputText = ref("")
  const messages = ref<Message[]>([])
  const chatContainer = ref<HTMLElement | null>(null)

  // Thêm state isLoading để quản lý trạng thái chờ AI phản hồi
  const isLoading = ref(false)

  // ==========================================
  // CÁC HÀM XỬ LÝ LOGIC (ACTIONS)
  // ==========================================
  const loadHistory = () => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      messages.value = JSON.parse(savedHistory)
    } else {
      messages.value = [
        {
          id: Date.now(),
          text: "Chào bạn! Mình có thể giúp gì cho việc quản lý chi tiêu của bạn hôm nay?",
          sender: "bot",
          timestamp: Date.now(),
        },
      ]
    }
  }

  const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }

  // 3. Chuyển hàm thành async để xử lý API call
  const sendMessage = async () => {
    const text = inputText.value.trim()
    // Chặn gửi nếu input rỗng hoặc đang chờ AI trả lời
    if (!text || isLoading.value) return

    // 1. Đẩy tin nhắn của User vào
    messages.value.push({
      id: Date.now(),
      text,
      sender: "user",
      timestamp: Date.now(),
    })

    // 2. Dọn dẹp UI
    inputText.value = ""
    scrollToBottom()

    // 3. Gọi Gemini AI
    isLoading.value = true // Bật trạng thái loading

    try {
      if (!apiKey) throw new Error("Thiếu API Key")

      // Khởi tạo model (sử dụng gemini-1.5-flash cho tốc độ phản hồi nhanh)
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

      // Gửi prompt tới AI
      const result = await model.generateContent(text)
      const responseText = result.response.text()

      // Đẩy tin nhắn của AI vào
      messages.value.push({
        id: Date.now(),
        text: responseText,
        sender: "bot",
        timestamp: Date.now(),
      })

    } catch (error) {
      console.error("Lỗi khi gọi AI:", error)
      messages.value.push({
        id: Date.now(),
        text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với hệ thống. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: Date.now(),
      })
    } finally {
      // 4. Tắt loading và cuộn xuống cuối cùng dù thành công hay thất bại
      isLoading.value = false
      scrollToBottom()
    }
  }

  // ==========================================
  // LIFECYCLES & WATCHERS
  // ==========================================
  onMounted(() => {
    loadHistory()
    scrollToBottom()
  })

  watch(
      messages,
      (newVal) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
      },
      { deep: true },
  )

  // ==========================================
  // EXPORT NHỮNG GÌ COMPONENT CẦN
  // ==========================================
  return {
    isOpen,
    inputText,
    messages,
    chatContainer,
    isLoading, // Export thêm isLoading để UI có thể disable nút gửi
    sendMessage,
  }
}