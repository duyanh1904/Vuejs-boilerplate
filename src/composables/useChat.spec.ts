// file: src/composables/useChat.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, nextTick } from "vue"
import { useChat } from "./useChat"

// =================================================================
// TẠO MỘT LOCALSTORAGE GIẢ LẬP (MOCK) HOÀN HẢO CHO NODE.JS
// =================================================================
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
})()

// Ép môi trường Node.js nhận diện localStorageMock này là localStorage thật
vi.stubGlobal("localStorage", localStorageMock)

// Dummy Component
const TestComponent = defineComponent({
  setup() {
    return { ...useChat() }
  },
  template: "<div></div>",
})

describe("Composable: useChat", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    // Bây giờ bạn có thể gọi .clear() thoải mái mà không sợ lỗi!
    localStorage.clear()

    // Xóa lịch sử gọi hàm của các vi.fn() ở bài test trước
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("1. Khởi tạo Component - Load đúng tin nhắn chào mừng mặc định", () => {
    const wrapper = mount(TestComponent)

    // Vì getItem đã được khai báo là vi.fn() ở trên, ta có thể dùng toHaveBeenCalledWith
    expect(localStorage.getItem).toHaveBeenCalledWith("finance_chat_history")
    expect(wrapper.vm.messages.length).toBe(1)
    expect(wrapper.vm.messages[0]!.sender).toBe("bot")
  })

  it("2. Gửi tin nhắn thành công, đẩy vào mảng và xóa ô input", () => {
    const wrapper = mount(TestComponent)

    wrapper.vm.inputText = "Hôm nay tôi ăn phở hết 50k"
    wrapper.vm.sendMessage()

    expect(wrapper.vm.messages.length).toBe(2)
    expect(wrapper.vm.messages[1]!.sender).toBe("user")
    expect(wrapper.vm.inputText).toBe("")
  })

  it("3. Bot phản hồi tự động sau 1 giây (1000ms)", () => {
    const wrapper = mount(TestComponent)

    wrapper.vm.inputText = "Chào bot"
    wrapper.vm.sendMessage()

    expect(wrapper.vm.messages.length).toBe(2)

    vi.advanceTimersByTime(1000)

    expect(wrapper.vm.messages.length).toBe(2)
  })

  it("4. Watcher tự động lưu mảng xuống LocalStorage khi có thay đổi", async () => {
    const wrapper = mount(TestComponent)

    wrapper.vm.inputText = "Test Storage"
    wrapper.vm.sendMessage()

    await nextTick()

    // Khẳng định hàm setItem giả lập đã được gọi
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "finance_chat_history",
      expect.stringContaining("Test Storage"),
    )
  })
})
