<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6 transition-all duration-300">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">Biểu đồ Giá Vàng (XAU/VND)</h2>
        <p class="text-sm text-slate-500">Xu hướng biến động 30 ngày gần nhất</p>
      </div>

      <button
          @click="refreshData"
          :disabled="isLoading"
          class="group flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        <svg
            :class="{ 'animate-spin': isLoading }"
            class="w-4 h-4 transition-transform group-hover:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
        <span>{{ isLoading ? 'Đang cập nhật...' : 'Làm mới' }}</span>
      </button>
    </div>

    <div class="relative w-full h-[350px]">
      <div v-if="isLoading && !chartData" class="absolute inset-0 flex flex-col gap-4 animate-pulse">
        <div class="w-full h-full bg-slate-100 rounded-xl"></div>
      </div>

      <div v-else-if="error" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-rose-50/50 rounded-xl border border-rose-100 border-dashed p-6">
        <div class="bg-rose-100 p-3 rounded-full mb-3">
          <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <p class="text-rose-600 font-bold">Không thể tải dữ liệu</p>
        <p class="text-rose-500 text-sm text-center">{{ error }}</p>
      </div>

      <div v-else class="h-full w-full" :class="{ 'opacity-50 pointer-events-none': isLoading }">
        <Line v-if="chartData" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useGold } from '../composables/useGold';

// Tối ưu: Chỉ đăng ký các thành phần ChartJS một lần tại Composable hoặc main.ts
// Nhưng nếu muốn giữ tại đây, hãy gom nhóm lại.
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Lazy load chart component để tăng tốc độ load trang đầu
const Line = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Line));

const { isLoading, error, chartData, chartOptions, refreshData } = useGold();
</script>