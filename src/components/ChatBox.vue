<template>
  <button
    v-if="!isOpen"
    @click="isOpen = true"
    class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl transition-transform hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </button>

  <div
    v-else
    class="fixed bottom-6 right-6 z-50 flex h-[540px] w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out sm:w-96"
  >
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]"></div>
          <h3 class="font-semibold">Community Chat</h3>
        </div>
        <button @click="isOpen = false" class="text-white/80 transition-colors hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p class="mt-1 text-xs text-white/80">Chat realtime giua cac tab va nguoi dung trong phong.</p>
    </div>

    <div class="border-b border-slate-100 bg-slate-50/70 px-3 py-2">
      <label class="mb-1 block text-xs font-medium text-slate-500">Ten hien thi</label>
      <input
        :value="displayName"
        @change="onNameChange"
        type="text"
        maxlength="24"
        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
    </div>

    <div ref="chatContainer" class="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-3 py-4 scroll-smooth">
      <div v-if="messages.length === 0" class="mt-12 text-center text-sm text-slate-400">
        Chua co tin nhan. Hay gui loi chao dau tien!
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="max-w-[88%] rounded-2xl px-3 py-2 text-sm shadow-sm"
        :class="msg.senderId === currentUserId ? 'self-end rounded-br-sm bg-blue-600 text-white' : 'self-start rounded-bl-sm border border-slate-200 bg-white text-slate-700'"
      >
        <div class="mb-1 flex items-center gap-2 text-[11px]" :class="msg.senderId === currentUserId ? 'text-blue-100' : 'text-slate-400'">
          <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/10 font-semibold uppercase" :class="msg.senderId === currentUserId ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
            {{ msg.senderName.charAt(0) }}
          </span>
          <span class="font-medium">{{ msg.senderName }}</span>
          <span>{{ formatTime(msg.timestamp) }}</span>
        </div>
        <p class="whitespace-pre-wrap break-words leading-relaxed">{{ msg.text }}</p>
      </div>
    </div>

    <div class="flex gap-2 border-t border-slate-100 bg-white p-3">
      <input v-model="inputText" @keyup.enter="sendMessage" type="text" placeholder="Nhap tin nhan..."
             class="flex-1 rounded-full border border-transparent bg-slate-100 px-4 py-2 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200">

      <button @click="sendMessage" :disabled="!canSend"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform rotate-90" viewBox="0 0 20 20"
             fill="currentColor">
          <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '../composables/useChat';

const {
  isOpen,
  inputText,
  messages,
  chatContainer,
  displayName,
  currentUserId,
  canSend,
  formatTime,
  sendMessage,
  updateDisplayName
} = useChat();

const onNameChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateDisplayName(target.value)
};
</script>