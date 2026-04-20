import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import type { TransactionType } from '../types/finance';

export function useFinance() {
  const store = useFinanceStore();

  // Trạng thái của Form
  const formType = ref<TransactionType>('expense');
  const formDate = ref<string>(new Date().toISOString().split('T')[0]);
  const formAmount = ref<number | null>(null);
  const formDescription = ref<string>('');
  const errorMessage = ref<string>('');

  // Khởi tạo dữ liệu khi module được gọi (onMounted ở component)
  onMounted(() => {
    store.loadFromLocalStorage();
  });

  // Xử lý submit form
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

    // Reset form
    formDescription.value = '';
    formAmount.value = null;
    formType.value = 'expense';
  };

  // Xử lý xoá
  const deleteItem = (id: string) => {
    store.deleteTransaction(id);
  };

  // Sắp xếp lịch sử giao dịch
  const sortedTransactions = computed(() => {
    return [...store.transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });

  // Tính tỷ lệ % cho biểu đồ
  const expenseRatio = computed(() => {
    if (store.totalIncome === 0) {
      return store.totalExpense > 0 ? 100 : 0;
    }
    const ratio = (store.totalExpense / store.totalIncome) * 100;
    return ratio > 100 ? 100 : Math.round(ratio);
  });

  // Helpers định dạng
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

  // Xuất các state và functions ra ngoài để Component sử dụng
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
    expenseRatio,
    formatCurrency,
    formatDate
  };
}
