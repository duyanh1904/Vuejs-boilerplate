<template>
  <div class="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 w-fit relative group">
    
    <button 
      @click="loadWeather(true)" 
      :disabled="isLoading || isRefreshing"
      class="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 hover:shadow-md transition-all disabled:opacity-50"
      title="Cập nhật thời tiết"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" height="14" 
        viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="3" 
        stroke-linecap="round" stroke-linejoin="round"
        :class="{ 'animate-spin': isRefreshing }"
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
      </svg>
    </button>

    <div v-if="isLoading" class="flex items-center gap-2 text-slate-500 text-sm py-2 px-4">
      <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      Đang tải...
    </div>

    <div v-else-if="error" class="text-rose-500 text-sm px-2">
      ⚠️ {{ error }}
    </div>

    <div v-else-if="weatherData" class="flex items-center gap-3">
      <div class="text-4xl">
        {{ getWeatherIcon(weatherData.weathercode) }}
      </div>
      
      <div class="flex flex-col">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hà Nội</span>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-black text-slate-800">{{ weatherData.temperature }}°</span>
          <span class="text-[10px] text-slate-400 font-medium">{{ isRefreshing ? 'Đang cập nhật...' : 'Hiện tại' }}</span>
        </div>
        <span class="text-xs font-semibold text-slate-500">
          {{ getWeatherDescription(weatherData.weathercode) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeather } from '../composables/useWeather';

const { 
  weatherData, 
  isLoading, 
  isRefreshing, 
  error, 
  getWeatherDescription, 
  getWeatherIcon,
  loadWeather 
} = useWeather();
</script>