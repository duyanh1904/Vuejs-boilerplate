<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <h2 class="text-2xl font-bold text-slate-800">Thống kê dữ liệu</h2>

      <div class="flex space-x-2 bg-slate-100 p-1.5 rounded-xl">
    <button
      v-for="period in ['week', 'month', 'year']"
      :key="period"
      @click="setFilter(period)"
      class="px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize"
      :class="reportFilter === period ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
    >
          {{ period === 'week' ? '7 Ngày qua' : period === 'month' ? 'Tháng này' : 'Năm nay' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-8">
      <div class="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
        <p class="text-sm font-medium text-emerald-600/80 mb-2">Tổng thu ({{ filterLabel }})</p>
        <p class="text-3xl font-bold text-emerald-600">{{ formatCurrency(filteredStats.income) }}</p>
      </div>
      <div class="p-6 rounded-2xl bg-rose-50/50 border border-rose-100">
        <p class="text-sm font-medium text-rose-600/80 mb-2">Tổng chi ({{ filterLabel }})</p>
        <p class="text-3xl font-bold text-rose-600">{{ formatCurrency(filteredStats.expense) }}</p>
      </div>
    </div>

    <div class="space-y-10 max-w-2xl pt-8">
      <div class="flex justify-between text-sm mb-2">
        <span class="font-medium text-slate-700">Tỷ lệ Chi / Thu</span>
        <span class="font-bold" :class="filteredStats.ratio > 80 ? 'text-rose-500' : 'text-slate-700'">
                {{ filteredStats.ratio }}%
              </span>
      </div>
      <div class="w-full h-6 bg-slate-100 rounded-full overflow-hidden relative">
        <div
            class="absolute top-0 left-0 h-full transition-all duration-700 rounded-full"
            :class="filteredStats.ratio > 80 ? 'bg-rose-500' : 'bg-blue-500'"
            :style="{ width: `${filteredStats.ratio}%` }"
        ></div>
      </div>
      <p v-if="filteredStats.ratio > 100" class="text-sm text-rose-500 font-medium">
        ⚠️ Cảnh báo: Bạn đã chi tiêu vượt quá thu nhập!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue';
import { useFinance } from '../composables/useFinance';
import type { ReportFilterPeriod } from '@/types/tabs';
import type { Ref } from 'vue';

const {
  formatCurrency,
  reportFilter,
  filterLabel,
  filteredStats
} = useFinance() as any;

// Setter helper used by the template to avoid inline TS casts
const setFilter = (period: string) => {
  // runtime assignment with a narrow cast to the typed ref
  reportFilter.value = period as ReportFilterPeriod;
};

// Lifecycle hooks for future optimizations when used under <KeepAlive>
onActivated(() => {
  // This will run when the tab component is activated from cache.
  // Keep here for future use-cases such as refreshing report data.
  if (import.meta.env.DEV) console.log('[TabReportFinance] activated');
});

onDeactivated(() => {
  // This will run when the tab component is deactivated and put into cache.
  // Useful for pausing background work or timers when inactive.
  if (import.meta.env.DEV) console.log('[TabReportFinance] deactivated');
});
</script>