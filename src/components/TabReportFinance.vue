<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <h2 class="text-2xl font-bold text-slate-800">Thống kê dữ liệu</h2>

      <div class="flex space-x-2 bg-slate-100 p-1.5 rounded-xl">
        <button v-for="period in ['week', 'month', 'year']" :key="period" @click="setFilter(period)"
                class="px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize"
                :class="reportFilter === period ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
          {{ period === 'week' ? '7 Ngày qua' : period === 'month' ? 'Tháng này' : 'Năm nay' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-8 border-t border-slate-100">
      <div class="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        <p class="text-sm font-medium text-emerald-600/80 mb-2">Tổng thu ({{ filterLabel }})</p>
        <p class="text-3xl font-bold text-emerald-600">{{ formatCurrency(filteredStats.income) }}</p>
      </div>
      <div class="p-6 rounded-2xl bg-rose-50/50 border border-rose-100 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
        <p class="text-sm font-medium text-rose-600/80 mb-2">Tổng chi ({{ filterLabel }})</p>
        <p class="text-3xl font-bold text-rose-600">{{ formatCurrency(filteredStats.expense) }}</p>
      </div>
    </div>

    <div class="space-y-4 max-w-2xl mb-12 pt-5">
      <div class="flex justify-between text-sm mb-2">
        <span class="font-medium text-slate-700">Tỷ lệ Chi / Thu</span>
        <span class="font-bold" :class="filteredStats.ratio > 80 ? 'text-rose-500' : 'text-slate-700'">
          {{ filteredStats.ratio }}%
        </span>
      </div>
      <div class="w-full h-6 bg-slate-100 rounded-full overflow-hidden relative">
        <div class="absolute top-0 left-0 h-full transition-all duration-700 rounded-full"
             :class="filteredStats.ratio > 80 ? 'bg-rose-500' : 'bg-blue-500'"
             :style="{ width: `${filteredStats.ratio}%` }"></div>
      </div>
      <p v-if="filteredStats.ratio > 100" class="text-sm text-rose-500 font-medium animate-pulse">
        ⚠️ Cảnh báo: Bạn đã chi tiêu vượt quá thu nhập!
      </p>
    </div>

    <div class="pt-8 border-t border-slate-100">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 class="text-lg font-bold text-slate-800">Chi tiết dòng tiền năm {{ new Date().getFullYear() }}</h3>

        <div class="flex bg-slate-100 p-1 rounded-lg w-fit">
          <button
              @click="viewMode = 'chart'"
              class="px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2"
              :class="viewMode === 'chart' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            📊 Biểu đồ
          </button>
          <button
              @click="viewMode = 'table'"
              class="px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2"
              :class="viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            📋 Bảng
          </button>
        </div>
      </div>

      <div v-show="viewMode === 'chart'" class="relative h-80 w-full animate-slide-down">
        <Bar :data="monthlyChartData" :options="chartOptions" />
      </div>

      <div v-show="viewMode === 'table'" class="animate-slide-down">
        <div class="space-y-4">
          <Table>
            <TableBody>
              <TableRow v-for="item in paginatedTransactions" :key="item.id">
              </TableRow>
            </TableBody>
          </Table>

          <div class="flex items-center justify-between px-2 py-4 border-t border-slate-100">
            <p class="text-sm text-slate-500">
              Hiển thị trang {{ currentPage }} / {{ totalPages }}
              <span class="hidden sm:inline">({{ sortedTransactions.length }} giao dịch)</span>
            </p>

            <div class="flex items-center space-x-2">
              <button
                  @click="setPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeftIcon class="w-5 h-5" />
              </button>

              <div class="flex space-x-1">
                <button
                    v-for="p in totalPages"
                    :key="p"
                    v-show="p >= currentPage - 2 && p <= currentPage + 2"
                    @click="setPage(p)"
                    class="w-8 h-8 rounded-lg text-sm font-bold transition-all"
                    :class="currentPage === p ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'"
                >
                  {{ p }}
                </button>
              </div>

              <button
                  @click="setPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronRightIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue';
import { useFinance } from '../composables/useFinance';
import type { ReportFilterPeriod } from '@/types/tabs';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';

// Import Shadcn-Vue Table Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Biến quản lý chế độ xem (Mặc định là xem Biểu đồ)
const viewMode = ref<'chart' | 'table'>('chart');

// Destructuring lấy dữ liệu từ composable
const {
  formatCurrency,
  formatDate,
  reportFilter,
  filterLabel,
  filteredStats,
  chartOptions,
  monthlyChartData,
  sortedTransactions,
  currentPage,
  paginatedTransactions,
  totalPages,
  setPage
} = useFinance() as any;

const setFilter = (period: string) => {
  reportFilter.value = period as ReportFilterPeriod;
};

onActivated(() => {
  if (import.meta.env.DEV) console.log('[TabReportFinance] activated');
});

onDeactivated(() => {
  if (import.meta.env.DEV) console.log('[TabReportFinance] deactivated');
});
</script>