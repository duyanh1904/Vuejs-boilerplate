import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import type { TransactionType } from '../types/finance';

export function useFinance() {
  const store = useFinanceStore();

  // ==========================================
  // 1. STATE QUẢN LÝ FORM & TỔNG QUAN
  // ==========================================
  const formType = ref<TransactionType>('expense');
  const formDate = ref<string>(new Date().toISOString().split('T')[0] as string);
  const formAmount = ref<number | null>(null);
  const formDescription = ref<string>('');
  const errorMessage = ref<string>('');

  onMounted(() => {
    store.loadFromLocalStorage();
  });

  const submitForm = () => {
    errorMessage.value = '';
    
    if (!formDescription.value.trim()) {
      errorMessage.value = 'Vui lòng nhập mô tả.';
      return;
    }
    if (!formAmount.value || formAmount.value <= 0) {
      errorMessage.value = 'Số tiền phải lớn hơn 0.';
      return;
    }

    store.addTransaction({
      type: formType.value,
      amount: formAmount.value,
      description: formDescription.value,
      date: formDate.value
    });

    formDescription.value = '';
    formAmount.value = null;
    formType.value = 'expense';
  };

  const deleteItem = (id: string) => {
    store.deleteTransaction(id);
  };

  const sortedTransactions = computed(() => {
    return [...store.transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });

  // ==========================================
  // 2. STATE QUẢN LÝ GIAO DIỆN (UI) & BÁO CÁO
  // ==========================================
  const activeTab = ref<'home' | 'report'>('home');
  const reportFilter = ref<'week' | 'month' | 'year'>('month');

  const filterLabel = computed(() => {
    if (reportFilter.value === 'week') return '7 ngày qua';
    if (reportFilter.value === 'month') return 'Tháng này';
    return 'Năm nay';
  });

  const filteredStats = computed(() => {
    const now = new Date();
    
    const filtered = store.transactions.filter(t => {
      const tDate = new Date(t.date);
      if (reportFilter.value === 'year') {
        return tDate.getFullYear() === now.getFullYear();
      }
      if (reportFilter.value === 'month') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }
      if (reportFilter.value === 'week') {
        const diffTime = Math.abs(now.getTime() - tDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      return true;
    });

    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    let ratio = 0;
    if (income === 0) {
      ratio = expense > 0 ? 100 : 0;
    } else {
      ratio = (expense / income) * 100;
    }

    return {
      income,
      expense,
      ratio: Math.round(ratio)
    };
  });

  // ==========================================
  // 3. HELPERS FORMATTER
  // ==========================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return {
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
    
    activeTab,
    reportFilter,
    filterLabel,
    filteredStats
  };
}