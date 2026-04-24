<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
      <p class="text-sm font-medium text-slate-500 mb-2">Tổng Số Dư</p>
      <p class="text-3xl font-bold text-slate-800 tracking-tight">{{ formatCurrency(store.balance) }}</p>
    </div>

    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
      <p class="text-sm font-medium text-slate-500 mb-2">Tổng Thu Nhập</p>
      <p class="text-2xl font-bold text-emerald-600 tracking-tight">+{{ formatCurrency(store.totalIncome) }}</p>
    </div>

    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
      <p class="text-sm font-medium text-slate-500 mb-2">Tổng Chi Tiêu</p>
      <p class="text-2xl font-bold text-rose-600 tracking-tight">-{{ formatCurrency(store.totalExpense) }}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">

    <div class="lg:col-span-5 space-y-6">
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-semibold mb-6 text-slate-800">Thêm giao dịch</h2>

        <form @submit.prevent="submitForm" class="space-y-5">
          <div class="flex rounded-xl overflow-hidden bg-slate-100 p-1">
            <button
                type="button"
                @click="formType = 'expense'"
                class="flex-1 py-3 text-sm font-semibold rounded-lg transition-all"
                :class="formType === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              Khoản Chi
            </button>
            <button
                type="button"
                @click="formType = 'income'"
                class="flex-1 py-3 text-sm font-semibold rounded-lg transition-all"
                :class="formType === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              Khoản Thu
            </button>
          </div>

          <div class="space-y-4 pb-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1.5">Ngày giao dịch</label>
              <input
                  type="date"
                  v-model="formDate"
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1.5">Số tiền (VNĐ)</label>
              <input
                  type="number"
                  v-model="formAmount"
                  placeholder="Nhập số tiền..."
                  min="1"
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-lg font-medium"
                  required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1.5">Mô tả</label>
              <input
                  type="text"
                  v-model="formDescription"
                  placeholder="Ví dụ: Ăn sáng, Đổ xăng..."
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
              />
            </div>
          </div>

          <div v-if="errorMessage" class="p-4 bg-red-50/50 border border-red-100 text-red-600 text-sm rounded-xl">
            {{ errorMessage }}
          </div>

          <button
              type="submit"
              class="w-full py-3.5 rounded-xl text-white font-semibold text-lg transition-all active:scale-[0.98]"
              :class="formType === 'income' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25 shadow-lg' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25 shadow-lg'"
          >
            Xác nhận lưu
          </button>
        </form>
      </div>
    </div>

    <div class="lg:col-span-7">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div class="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 class="text-xl font-semibold text-slate-800">Lịch sử gần đây</h2>
        </div>

        <div class="p-0 overflow-y-auto max-h-125">
          <div v-if="store.transactions.length === 0" class="p-12 text-center text-slate-400">
            <p>Chưa có giao dịch nào.</p>
            <p class="text-sm mt-1">Hãy thêm khoản thu/chi đầu tiên của bạn!</p>
          </div>

          <ul v-else class="divide-y divide-slate-50">
            <li
                v-for="transaction in sortedTransactions"
                :key="transaction.id"
                class="p-4 sm:p-6 hover:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div class="flex items-center gap-4 sm:gap-5">
                <div
                    class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    :class="transaction.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'"
                >
                  <svg v-if="transaction.type === 'income'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-800 text-base">{{ transaction.description }}</p>
                  <p class="text-sm text-slate-500 mt-0.5">{{ formatDate(transaction.date) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <span
                    class="font-bold text-base sm:text-lg whitespace-nowrap"
                    :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'"
                >
                  {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                </span>
                <button
                    @click="deleteItem(transaction.id)"
                    class="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Xóa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue';
import { useFinance } from '../composables/useFinance';

const {
  store,
  formType,
  formDate,
  formAmount,
  formDescription,
  errorMessage,
  submitForm,
  deleteItem,
  sortedTransactions,
  formatCurrency,
  formatDate,
} = useFinance();

// Lifecycle hooks available for future use when the component is wrapped with <KeepAlive>
onActivated(() => {
  // Runs when this tab component is activated from cache.
  // Use this to refresh lightweight data or restart timers if needed.
  if (import.meta.env.DEV) console.log('[TabStoreFinance] activated');
});

onDeactivated(() => {
  // Runs when this tab component is deactivated and cached.
  // Use this to pause background activity to save resources.
  if (import.meta.env.DEV) console.log('[TabStoreFinance] deactivated');
});
</script>