import { ref, computed } from "vue" // Đã xóa onMounted vì không còn cần thiết
import { useFinanceStore } from "../stores/financeStore"
import type { TransactionType } from "../types/finance"
import type { TabId, ReportFilterPeriod } from "../types/tabs"

// Module-level singletons shared across all consumers of the composable
// (keeps a single source of truth for tab state and report filter)
const activeTab = ref<TabId>("home")
const reportFilter = ref<ReportFilterPeriod>("month")

export function useFinance() {
  const store = useFinanceStore()

  // ==========================================
  // 1. STATE QUẢN LÝ FORM & TỔNG QUAN
  // ==========================================
  const formType = ref<TransactionType>("expense")
  const formDate = ref<string>(new Date().toISOString().split("T")[0] as string)
  const formAmount = ref<number | null>(null)
  const formDescription = ref<string>("")
  const errorMessage = ref<string>("")

  // ❌ Đã xóa onMounted(() => { store.loadFromLocalStorage(); })
  // Vì pinia-plugin-persistedstate đã tự động làm việc này ngay khi store được khởi tạo!

  const submitForm = () => {
    errorMessage.value = ""

    if (!formDescription.value.trim()) {
      errorMessage.value = "Vui lòng nhập mô tả."
      return
    }
    if (!formAmount.value || formAmount.value <= 0) {
      errorMessage.value = "Số tiền phải lớn hơn 0."
      return
    }

    // Cú pháp gọi action vẫn giữ nguyên, rất tiện lợi!
    store.addTransaction({
      type: formType.value,
      amount: formAmount.value,
      description: formDescription.value,
      date: formDate.value,
    })

    formDescription.value = ""
    formAmount.value = null
    formType.value = "expense"
  }

  const deleteItem = (id: string) => {
    store.deleteTransaction(id)
  }

  const sortedTransactions = computed(() => {
    // Truy cập mảng giao dịch trực tiếp từ store
    return [...store.transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  // ==========================================
  // 2. STATE QUẢN LÝ GIAO DIỆN (UI) & BÁO CÁO
  // ==========================================
  // NOTE: `activeTab` and `reportFilter` are defined at module scope
  // (see top of file) so they act as singletons shared across all
  // consumers of this composable.

  const filterLabel = computed(() => {
    if (reportFilter.value === "week") return "7 ngày qua"
    if (reportFilter.value === "month") return "Tháng này"
    return "Năm nay"
  })

  const filteredStats = computed(() => {
    const now = new Date()

    const filtered = store.transactions.filter((t) => {
      const tDate = new Date(t.date)
      if (reportFilter.value === "year") {
        return tDate.getFullYear() === now.getFullYear()
      }
      if (reportFilter.value === "month") {
        return (
          tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear()
        )
      }
      if (reportFilter.value === "week") {
        const diffTime = Math.abs(now.getTime() - tDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7
      }
      return true
    })

    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    let ratio = 0
    if (income === 0) {
      ratio = expense > 0 ? 100 : 0
    } else {
      ratio = (expense / income) * 100
    }

    return {
      income,
      expense,
      ratio: Math.round(ratio),
    }
  })

  // ==========================================
  // 3. HELPERS FORMATTER
  // ==========================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  // ==========================================
  // THÊM MỚI: Dữ liệu cho Biểu đồ Chart.js (Theo 12 tháng của năm hiện tại)
  // ==========================================
  const monthlyChartData = computed(() => {
    const currentYear = new Date().getFullYear();
    const incomes = new Array(12).fill(0);
    const expenses = new Array(12).fill(0);

    // Duyệt qua toàn bộ giao dịch, nhặt ra các giao dịch trong năm nay
    store.transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear) {
        const monthIndex = d.getMonth(); // Trả về từ 0 (Tháng 1) đến 11 (Tháng 12)
        if (t.type === 'income') {
          incomes[monthIndex] += t.amount;
        } else {
          expenses[monthIndex] += t.amount;
        }
      }
    });

    // Trả về cấu trúc Data chuẩn mực mà Chart.js yêu cầu
    return {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Thu nhập',
          backgroundColor: '#10b981', // Màu emerald-500 của Tailwind
          data: incomes,
          borderRadius: 4, // Bo góc cho cột đẹp hơn
        },
        {
          label: 'Chi tiêu',
          backgroundColor: '#f43f5e', // Màu rose-500 của Tailwind
          data: expenses,
          borderRadius: 4,
        }
      ]
    };
  });

  // ==========================================
// CẤU HÌNH GIAO DIỆN CHART.JS
// ==========================================
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Bắt buộc false để thẻ cha điều khiển độ cao (h-80)
    interaction: {
      mode: 'index' as const, // Hiển thị tooltip của cả Cột Thu & Chi cùng lúc khi trỏ chuột vào tháng
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true, // Biến ô vuông chú thích thành hình tròn nhỏ cho hiện đại
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        callbacks: {
          // Tùy biến Tooltip để hiển thị tiền có chữ "đ" chuẩn Việt Nam
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false } // Xóa kẻ sọc dọc cho UI sạch sẽ
      },
      y: {
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: {
          // Tùy biến trục Y: Chia cho 1 Triệu để nhãn (label) không bị dài loằng ngoằng
          callback: (value: any) => {
            if (value === 0) return '0';
            return (Number(value) / 1000000) + ' Tr';
          }
        }
      }
    }
  };

  return {
    store, // Trả về store để template có thể gọi store.totalIncome, store.balance...
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
    monthlyChartData,
    chartOptions,
    reportFilter,
    filterLabel,
    filteredStats,
  }
}
