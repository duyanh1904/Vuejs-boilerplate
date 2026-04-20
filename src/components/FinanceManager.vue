<template>
  <!-- Xóa min-h-screen để component ôm vừa với layout của App.vue -->
  <div class="bg-slate-50 py-8 px-4 font-sans text-slate-800 rounded-xl w-full">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Bỏ Header ở đây vì App.vue đã có Header, hoặc giữ lại tùy ý bạn. -->

      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Số dư -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div class="absolute top-0 w-full h-1 bg-blue-500"></div>
          <p class="text-sm font-medium text-slate-500 mb-1">Tổng Số Dư</p>
          <p class="text-2xl font-bold text-slate-800">{{ formatCurrency(store.balance) }}</p>
        </div>
        
        <!-- Tổng Thu -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div class="absolute top-0 w-full h-1 bg-emerald-500"></div>
          <p class="text-sm font-medium text-slate-500 mb-1">Tổng Thu Nhập</p>
          <p class="text-2xl font-bold text-emerald-600">+{{ formatCurrency(store.totalIncome) }}</p>
        </div>

        <!-- Tổng Chi -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div class="absolute top-0 w-full h-1 bg-rose-500"></div>
          <p class="text-sm font-medium text-slate-500 mb-1">Tổng Chi Tiêu</p>
          <p class="text-2xl font-bold text-rose-600">-{{ formatCurrency(store.totalExpense) }}</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column: Form Thêm Giao Dịch -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Ghi chép mới
            </h2>
            
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- Loại giao dịch -->
              <div class="flex rounded-lg overflow-hidden border border-slate-200">
                <button 
                  type="button"
                  @click="formType = 'expense'"
                  class="flex-1 py-2 text-sm font-medium transition-colors"
                  :class="formType === 'expense' ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'"
                >
                  Khoản Chi
                </button>
                <button 
                  type="button"
                  @click="formType = 'income'"
                  class="flex-1 py-2 text-sm font-medium transition-colors"
                  :class="formType === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'"
                >
                  Khoản Thu
                </button>
              </div>

              <!-- Ngày tháng -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Ngày</label>
                <input 
                  type="date" 
                  v-model="formDate" 
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <!-- Số tiền -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Số tiền (VNĐ)</label>
                <input 
                  type="number" 
                  v-model="formAmount" 
                  placeholder="0"
                  min="1"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <!-- Mô tả -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Mô tả</label>
                <input 
                  type="text" 
                  v-model="formDescription" 
                  placeholder="Ví dụ: Ăn trưa, Nhận lương..."
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                {{ errorMessage }}
              </div>

              <button 
                type="submit" 
                class="w-full py-2.5 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="formType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'"
              >
                Thêm giao dịch
              </button>
            </form>
          </div>
        </div>

        <!-- Right Column: Báo Cáo & Lịch Sử -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Báo Cáo Trực Quan (Progress Bar) -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              Báo cáo nhanh
            </h2>
            <div class="space-y-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-500">Tỷ lệ Chi / Thu</span>
                <span class="font-medium">{{ expenseRatio }}%</span>
              </div>
              <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
                <div 
                  class="absolute top-0 left-0 h-full bg-rose-500 transition-all duration-500"
                  :style="{ width: `${expenseRatio}%` }"
                ></div>
                <!-- Vạch mức 100% (Thu nhập) -->
                <div class="absolute top-0 left-0 h-full w-full bg-emerald-500 opacity-20 pointer-events-none"></div>
              </div>
              <p class="text-xs text-slate-500 text-right">
                *Thanh màu đỏ thể hiện mức chi tiêu so với tổng thu nhập.
              </p>
            </div>
          </div>

          <!-- Lịch Sử Giao Dịch -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 class="text-lg font-semibold flex items-center gap-2">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                Lịch sử gần đây
              </h2>
            </div>
            
            <div class="p-0">
              <div v-if="store.transactions.length === 0" class="p-8 text-center text-slate-500">
                Chưa có dữ liệu giao dịch nào.
              </div>
              <ul v-else class="divide-y divide-slate-100">
                <li 
                  v-for="transaction in sortedTransactions" 
                  :key="transaction.id"
                  class="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      :class="transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'"
                    >
                      <svg v-if="transaction.type === 'income'" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                      <svg v-else xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                    </div>
                    <div>
                      <p class="font-medium text-slate-800">{{ transaction.description }}</p>
                      <p class="text-xs text-slate-500">{{ formatDate(transaction.date) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <span 
                      class="font-semibold whitespace-nowrap"
                      :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'"
                    >
                      {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                    </span>
                    <button 
                      @click="deleteItem(transaction.id)"
                      class="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa"
                    >
                      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFinance } from '../composables/useFinance';

// Gọi composable chứa toàn bộ logic
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
  expenseRatio,
  formatCurrency,
  formatDate
} = useFinance();
</script>