import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Transaction } from '../types/finance';

export const useFinanceStore = defineStore('finance', () => {
  // 1. STATE (Dùng ref)
  const transactions = ref<Transaction[]>([]);

  // 2. GETTERS (Dùng computed)
  const totalIncome = computed(() =>
      transactions.value
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpense = computed(() =>
      transactions.value
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = computed(() => totalIncome.value - totalExpense.value);

  // 3. ACTIONS (Dùng hàm thông thường)
  function addTransaction(transaction: Omit<Transaction, 'id'>) {
    transactions.value.push({
      ...transaction,
      id: crypto.randomUUID()
    });
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter(t => t.id !== id);
  }

  // 4. TRẢ VỀ CÁC THUỘC TÍNH ĐỂ COMPONENT SỬ DỤNG
  return {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    addTransaction,
    deleteTransaction
  };
}, {
  // Bật tính năng tự động lưu xuống LocalStorage
  persist: true
});