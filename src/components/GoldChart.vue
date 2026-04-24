<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6 animate-slide-down">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Biểu đồ Giá Vàng (XAU/VND)</h2>
        <p class="text-sm text-slate-500">Cập nhật xu hướng 30 ngày qua</p>
      </div>
      <button 
        @click="refreshData" 
        :disabled="isLoading"
        class="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        <svg :class="{'animate-spin': isLoading}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        {{ isLoading ? 'Đang tải...' : 'Làm mới' }}
      </button>
    </div>

    <div class="relative w-full h-87.5">
      <div v-if="isLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
        <div class="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-100">
        <span class="text-2xl mb-2">⚠️</span>
        <p class="text-rose-600 font-medium">{{ error }}</p>
      </div>

      <Line 
        v-else-if="chartData" 
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { useGold } from '../composables/useGold';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const { isLoading, error, chartData, chartOptions, refreshData } = useGold();
</script>