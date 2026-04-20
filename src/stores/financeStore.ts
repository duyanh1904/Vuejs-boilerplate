import { defineStore } from 'pinia';
import type { Transaction } from '../types/finance';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: [] as Transaction[],
  }),
  getters: {
    totalIncome: (state): number => 
      state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
        
    totalExpense: (state): number => 
      state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
        
    balance(): number {
      return this.totalIncome - this.totalExpense;
    }
  },
  actions: {
    addTransaction(transaction: Omit<Transaction, 'id'>) {
      this.transactions.push({
        ...transaction,
        id: crypto.randomUUID()
      });
      this.saveToLocalStorage();
    },
    deleteTransaction(id: string) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('vue_finance_data', JSON.stringify(this.transactions));
    },
    loadFromLocalStorage() {
      const stored = localStorage.getItem('vue_finance_data');
      if (stored) {
        try {
          this.transactions = JSON.parse(stored);
        } catch (e) {
          console.error("Lỗi parse dữ liệu từ LocalStorage", e);
        }
      }
    }
  }
});