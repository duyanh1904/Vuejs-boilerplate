import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"

export interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  timestamp: number
}

const STORAGE_KEY = "finance_community_chat_history"
const USER_ID_KEY = "finance_chat_user_id"
const PROFILE_NAME_KEY = "finance_chat_profile_name"
const MAX_STORED_MESSAGES = 200
const CHANNEL_NAME = "finance-community-chat"

export function useChat() {
  const isOpen = ref(false)
  const inputText = ref("")
  const messages = ref<Message[]>([])
  const chatContainer = ref<HTMLElement | null>(null)
  const currentUserId = ref("")
  const displayName = ref("")
  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null

  const canSend = computed(() => Boolean(inputText.value.trim() && displayName.value.trim()))

  const generateUserId = () => crypto.randomUUID()

  const generateGuestName = () => {
    const suffix = Math.floor(100 + Math.random() * 900)
    return `Guest-${suffix}`
  }

  const loadHistory = () => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        messages.value = JSON.parse(savedHistory)
      } catch {
        messages.value = []
      }
    }
  }

  const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }

  const syncUserProfile = () => {
    currentUserId.value = localStorage.getItem(USER_ID_KEY) || generateUserId()
    localStorage.setItem(USER_ID_KEY, currentUserId.value)

    displayName.value = localStorage.getItem(PROFILE_NAME_KEY) || generateGuestName()
    localStorage.setItem(PROFILE_NAME_KEY, displayName.value)
  }

  const mergeMessage = (newMessage: Message) => {
    const isDuplicated = messages.value.some((message) => message.id === newMessage.id)
    if (isDuplicated) return

    messages.value.push(newMessage)
    if (messages.value.length > MAX_STORED_MESSAGES) {
      messages.value = messages.value.slice(-MAX_STORED_MESSAGES)
    }

    scrollToBottom()
  }

  const sendMessage = () => {
    const text = inputText.value.trim()
    const name = displayName.value.trim()
    if (!text || !name) return

    const message: Message = {
      id: crypto.randomUUID(),
      text,
      senderId: currentUserId.value,
      senderName: name,
      timestamp: Date.now(),
    }

    mergeMessage(message)
    channel?.postMessage(message)
    inputText.value = ""
  }

  const updateDisplayName = (name: string) => {
    const normalizedName = name.trim().slice(0, 24)
    if (!normalizedName) return
    displayName.value = normalizedName
    localStorage.setItem(PROFILE_NAME_KEY, normalizedName)
  }

  const formatTime = (timestamp: number) =>
    new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp)

  const receiveMessage = (event: MessageEvent<Message>) => {
    mergeMessage(event.data)
  }

  const syncByStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        messages.value = JSON.parse(event.newValue)
      } catch {
        messages.value = []
      }
      scrollToBottom()
    }
  }

  onMounted(() => {
    syncUserProfile()
    loadHistory()
    channel?.addEventListener("message", receiveMessage)
    window.addEventListener("storage", syncByStorageEvent)
    scrollToBottom()
  })

  onUnmounted(() => {
    channel?.removeEventListener("message", receiveMessage)
    channel?.close()
    window.removeEventListener("storage", syncByStorageEvent)
  })

  watch(
    messages,
    (newVal) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal.slice(-MAX_STORED_MESSAGES)))
    },
    { deep: true },
  )

  return {
    isOpen,
    inputText,
    messages,
    chatContainer,
    displayName,
    currentUserId,
    canSend,
    formatTime,
    sendMessage,
    updateDisplayName,
  }
}