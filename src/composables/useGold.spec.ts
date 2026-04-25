import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useGold } from './useGold';

// TẠO MỘT DUMMY COMPONENT ĐỂ MÔ PHỎNG VÒNG ĐỜI (LIFECYCLE) CỦA VUE
// Điều này giúp hàm onMounted() bên trong useGold được kích hoạt tự nhiên
const TestComponent = defineComponent({
    setup() {
        return { ...useGold() };
    },
    template: '<div></div>',
});

describe('Composable: useGold.ts', () => {
    beforeEach(() => {
        // Kích hoạt đồng hồ giả (Fake Timers) trước mỗi test case
        // Giúp chúng ta "tua nhanh" thời gian của setTimeout mà không phải chờ đợi thật
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Dọn dẹp và trả lại đồng hồ thật cho hệ thống
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('1. Trạng thái ban đầu và tự động fetch data khi mounted', () => {
        const wrapper = mount(TestComponent);

        // Ngay khi vừa mount, isLoading phải là true và mảng dữ liệu trống
        expect(wrapper.vm.isLoading).toBe(true);
        expect(wrapper.vm.error).toBe('');
        // chartData.datasets sẽ rỗng theo logic if (goldPrices.value.length === 0)
        expect(wrapper.vm.chartData.datasets).toEqual([]);
    });

    it('2. Nạp dữ liệu thành công sau 1 giây (Tua nhanh thời gian)', async () => {
        const wrapper = mount(TestComponent);

        // Tua nhanh đồng hồ đi 1000ms (1 giây) để bỏ qua setTimeout
        vi.advanceTimersByTime(1000);

        // Kiểm tra trạng thái sau khi đã nạp xong
        expect(wrapper.vm.isLoading).toBe(false);
        expect(wrapper.vm.error).toBe('');

        // Kiểm tra mảng dữ liệu đã được khởi tạo với 31 ngày (từ 30 đến 0)
        expect(wrapper.vm.chartData.labels?.length).toBe(31);
        expect(wrapper.vm.chartData.datasets[0]?.data.length).toBe(31);
    });

    it('3. Hàm Computed chartData định dạng nhãn ngày tháng (labels) chính xác', async () => {
        // Thay vì mount component, ta gọi trực tiếp để test hàm refreshData
        const { refreshData, chartData } = useGold();

        refreshData();
        vi.advanceTimersByTime(1000); // Đợi load data

        // Lấy nhãn đầu tiên (ngày cách đây 30 ngày) và nhãn cuối cùng (hôm nay)
        const labels = chartData.value.labels as string[];
        const firstLabel = labels[0];
        const lastLabel = labels[labels.length - 1];

        // Định dạng mong đợi là DD/MM (có chứa dấu /)
        expect(firstLabel).toContain('/');
        expect(lastLabel).toContain('/');
        // Khẳng định chắc chắn đó là một chuỗi
        expect(typeof firstLabel).toBe('string');
    });

    it('4. Định dạng Tooltip trong chartOptions chuyển đổi đúng tiền tệ VNĐ', () => {
        const { chartOptions } = useGold();

        // "Móc" (extract) hàm callback label ra từ cấu hình option lồng sâu
        const labelCallback = chartOptions.value.plugins?.tooltip?.callbacks?.label as Function;

        // Tạo một context giả lập giống hệt cách Chart.js truyền vào
        const mockContext = {
            parsed: { y: 82500000 }
        };

        const result = labelCallback(mockContext);

        // Kiểm tra xem số 82,500,000 đã biến thành tiền Việt chưa (VD: 82.500.000 ₫)
        // Dùng regex để tránh lỗi sai khác ký tự khoảng trắng non-breaking space
        expect(result).toMatch(/82\.500\.000/);
        expect(result).toContain('₫');
    });

    it('5. Định dạng Trục Y (y-axis) trong chartOptions chuyển đổi đúng đuôi "Tr"', () => {
        const { chartOptions } = useGold();

        // Móc hàm callback định dạng trục y ra
        const yAxisCallback = (chartOptions.value.scales?.y as any).ticks.callback as Function;

        const result = yAxisCallback(82500000); // Truyền vào 82.5 triệu

        // Kết quả mong muốn: Lấy giá trị chia 1.000.000 và nối chữ " Tr"
        expect(result).toBe('82.5 Tr');
    });
});