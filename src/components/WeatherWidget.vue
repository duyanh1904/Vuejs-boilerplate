<template>
  <div class="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 w-fit transition-all hover:shadow-md">
    <div v-if="isLoading" class="flex items-center gap-2 text-slate-500 text-sm animate-pulse">
      <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      Đang tải thời tiết...
    </div>

    <div v-else-if="error" class="text-rose-500 text-sm font-medium">
      ⚠️ {{ error }}
    </div>

    <div v-else-if="weatherData" class="flex items-center gap-3">
      <div class="text-4xl" title="Biểu tượng thời tiết">
        {{ getWeatherIcon(weatherData.weathercode) }}
      </div>
      
      <div class="flex flex-col">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Hà Nội, VN</span>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-slate-800">{{ weatherData.temperature }}°C</span>
        </div>
        <span class="text-sm font-medium text-slate-600 capitalize">
          {{ getWeatherDescription(weatherData.weathercode) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeather } from '../composables/useWeather';

// Rút gọn toàn bộ logic vào đúng 1 dòng này
const { weatherData, isLoading, error, getWeatherDescription, getWeatherIcon } = useWeather();
</script>