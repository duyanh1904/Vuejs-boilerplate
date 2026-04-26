<template>
  <button v-if="!isOpen" @click="isOpen = true"
    class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center justify-center z-50">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </button>

  <div v-else
    class="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out"
    style="height: 500px;">
    <div class="bg-blue-600 px-4 py-3 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <h3 class="text-white font-medium">Trợ lý Tài chính</h3>
      </div>
      <button @click="isOpen = false" class="text-white/80 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 scroll-smooth">
      <div v-if="messages.length === 0" class="text-center text-slate-400 text-sm mt-10">
        Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!
      </div>

      <div v-for="msg in messages" :key="msg.id"
           class="max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm"
           :class="msg.sender === 'user' ? 'bg-blue-600 text-white self-end rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 self-start rounded-bl-sm'">

        <template v-if="msg.sender === 'user'">
          {{ msg.text }}
        </template>

        <template v-else>
          <div
              v-html="msg.text"
              class="prose prose-sm prose-slate max-w-none ai-content"
          ></div>
        </template>

      </div>
    </div>

    <div class="p-3 border-t border-slate-100 bg-white flex gap-2">
      <input v-model="inputText" @keyup.enter="sendMessage" type="text" placeholder="Nhập câu hỏi của bạn..."
        class="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2 text-sm outline-none transition-all">
      <button @click="sendMessage" :disabled="!inputText.trim()"
        class="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
  sendMessage
} = useChat();
</script>