// file: src/composables/useGold.ts
import { ref, computed, onMounted } from 'vue';
import type { ChartOptions, ChartData } from 'chart.js';

export function useGold() {
  // ==========================================
  // 1. STATE QUẢN LÝ DỮ LIỆU
  // ==========================================
  const isLoading = ref(true);
  const error = ref('');
  const goldPrices = ref<{ date: string, price: number }[]>([]);

  // ==========================================
  // 2. CẤU HÌNH CHART (UI & UX)
  // ==========================================
  const chartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 13, family: 'sans-serif' },
        bodyFont: { size: 14, weight: 'bold', family: 'sans-serif' },
        displayColors: false,
        callbacks: {
          label: (context) => {
            let value = context.parsed.y || 0;
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 7 }
      },
      y: {
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: (value) => (Number(value) / 1000000) + ' Tr'
        }
      }
    }
  }));

  // ==========================================
  // 3. TẠO GRADIENT VÀ ĐỔ DỮ LIỆU VÀO CHART
  // ==========================================
  const chartData = computed<ChartData<'line'>>(() => {
    if (goldPrices.value.length === 0) return { labels: [], datasets: [] };

    return {
      labels: goldPrices.value.map(item => {
        const parts = item.date.split('-');
        return `${parts[2]}/${parts[1]}`; 
      }),
      datasets: [
        {
          label: 'Giá Vàng',
          data: goldPrices.value.map(item => item.price),
          borderColor: '#eab308', 
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#eab308',
          pointBorderWidth: 2,
          pointRadius: 0, 
          pointHoverRadius: 6, 
          fill: true,
          tension: 0.4, 
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(234, 179, 8, 0.2)'); 
            gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');   
            return gradient;
          }
        }
      ]
    };
  });

  // ==========================================
  // 4. LOGIC FAKE DỮ LIỆU (THAY THẾ BẰNG API THẬT NẾU CÓ)
  // ==========================================
  const refreshData = () => {
    isLoading.value = true;
    error.value = '';
    
    setTimeout(() => {
      try {
        const mockData = [];
        let basePrice = 82000000; 
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          basePrice = basePrice + (Math.random() * 1000000 - 450000); 
          mockData.push({
            date: date.toISOString().split('T')[0]!,
            price: Math.floor(basePrice)
          });
        }
        goldPrices.value = mockData;
      } catch (err) {
        error.value = 'Lỗi kết nối máy chủ giá vàng!';
      } finally {
        isLoading.value = false;
      }
    }, 1000);
  };

  // Khởi chạy khi component mount
  onMounted(() => {
    refreshData();
  });

  // Xuất ra những gì Component cần dùng
  return {
    isLoading,
    error,
    chartOptions,
    chartData,
    refreshData
  };
}