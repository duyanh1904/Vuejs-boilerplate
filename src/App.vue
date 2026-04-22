<script setup lang="ts">
import FinanceManager from './components/FinanceManager.vue'
import WeatherWidget from './components/WeatherWidget.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center">

    <header class="w-1/2 bg-white shadow-sm border-b border-slate-200 rounded-xl">
      <div
        class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Ví Của Bạn</h1>
          <p class="text-slate-500 text-sm mt-1">Quản lý chi tiêu thông minh</p>
        </div>
        <WeatherWidget />
      </div>
    </header>

    <main class="w-1/2 mx-auto py-8 flex-1">
      <FinanceManager />
    </main>

  </div>
</template>