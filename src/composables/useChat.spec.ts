import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, nextTick } from "vue"
import { useChat } from "./useChat"

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

vi.stubGlobal("localStorage", localStorageMock)

class BroadcastChannelMock {
  postMessage = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  close = vi.fn()
}
vi.stubGlobal("BroadcastChannel", BroadcastChannelMock)

const TestComponent = defineComponent({
  setup() {
    return { ...useChat() }
  },
  template: "<div></div>",
})

describe("Composable: useChat", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("khoi tao user profile khi mount", () => {
    const wrapper = mount(TestComponent)

    expect(localStorage.getItem).toHaveBeenCalledWith("finance_chat_user_id")
    expect(localStorage.getItem).toHaveBeenCalledWith("finance_chat_profile_name")
    expect(wrapper.vm.currentUserId).toBeTruthy()
    expect(wrapper.vm.displayName).toContain("Guest-")
  })

  it("gui tin nhan thanh cong va reset input", () => {
    const wrapper = mount(TestComponent)

    wrapper.vm.updateDisplayName("An")
    wrapper.vm.inputText = "Xin chao moi nguoi"
    wrapper.vm.sendMessage()

    expect(wrapper.vm.messages.length).toBe(1)
    expect(wrapper.vm.messages[0]!.senderName).toBe("An")
    expect(wrapper.vm.inputText).toBe("")
  })

  it("khong gui neu display name rong", () => {
    const wrapper = mount(TestComponent)

    wrapper.vm.displayName = "   "
    wrapper.vm.inputText = "Message"
    wrapper.vm.sendMessage()

    expect(wrapper.vm.messages.length).toBe(0)
  })

  it("watcher luu messages vao localStorage", async () => {
    const wrapper = mount(TestComponent)

    wrapper.vm.updateDisplayName("An")
    wrapper.vm.inputText = "Test Storage"
    wrapper.vm.sendMessage()

    await nextTick()

    expect(localStorage.setItem).toHaveBeenCalled()
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "finance_community_chat_history",
      expect.stringContaining("Test Storage"),
    )
  })
})
