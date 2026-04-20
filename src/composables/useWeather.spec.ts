// file: src/composables/useWeather.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeather } from './useWeather';
import * as weatherApi from '../api/weather'; // Import toàn bộ module api để mock
import axios from 'axios';

// ==========================================
// 1. MOCKING (GIẢ LẬP MÔI TRƯỜNG)
// ==========================================
// Giả lập module gọi API để nó không bắn request thật ra ngoài internet
vi.mock('../api/weather', () => ({
    fetchCurrentWeather: vi.fn(),
}));

// Giả lập axios để có thể kiểm soát hàm isAxiosError
vi.mock('axios', () => ({
    default: {
        isAxiosError: vi.fn(),
    },
}));

describe('Composable: useWeather', () => {
    // Dữ liệu giả lập chuẩn xác theo interface CurrentWeather
    const mockWeatherData = {
        temperature: 25,
        windspeed: 10,
        winddirection: 180,
        weathercode: 1, // 1 = Có mây
        time: '2026-04-20T10:00:00',
    };

    // Reset lại toàn bộ các mock (giả lập) trước mỗi test case để tránh dữ liệu bị lẫn lộn
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ==========================================
    // 2. CÁC TEST CASE CHI TIẾT
    // ==========================================

    it('1. Khởi tạo đúng các giá trị mặc định ban đầu', () => {
        const { weatherData, isLoading, isRefreshing, error } = useWeather();

        // Kiểm chứng các biến state (phải dùng .value vì chúng là ref)
        expect(weatherData.value).toBeNull();
        expect(isLoading.value).toBe(true); // Trạng thái ban đầu luôn là true vì onMounted sẽ gọi load
        expect(isRefreshing.value).toBe(false);
        expect(error.value).toBe('');
    });

    it('2. Gọi API thành công và cập nhật weatherData (Chế độ mặc định)', async () => {
        // Ép hàm fetchCurrentWeather trả về dữ liệu giả lập của chúng ta
        vi.mocked(weatherApi.fetchCurrentWeather).mockResolvedValue(mockWeatherData);

        const { weatherData, isLoading, loadWeather } = useWeather();

        // Gọi hàm loadWeather và đợi nó chạy xong (await)
        await loadWeather();

        // Kiểm chứng
        expect(weatherApi.fetchCurrentWeather).toHaveBeenCalledWith(21.0285, 105.8542); // Hàm phải được gọi đúng tọa độ Hà Nội
        expect(weatherData.value).toEqual(mockWeatherData); // Dữ liệu phải được gán vào state
        expect(isLoading.value).toBe(false); // Xong thì loading phải tắt
    });

    it('3. Chế độ Silent Refresh (Tải lại ngầm) hoạt động đúng', async () => {
        vi.mocked(weatherApi.fetchCurrentWeather).mockResolvedValue(mockWeatherData);

        const { isLoading, isRefreshing, loadWeather } = useWeather();

        // Gọi API ở chế độ silent = true
        const promise = loadWeather(true);

        // KIỂM CHỨNG NGAY TRONG LÚC ĐANG CHỜ API:
        expect(isRefreshing.value).toBe(true); // isRefreshing phải bật
        expect(isLoading.value).toBe(true); // Ghi chú: Trong code gốc của bạn, isLoading ban đầu là true. Nhưng ở lần gọi silent, nó k bị ép về true nữa.

        // Đợi API chạy xong
        await promise;

        // KIỂM CHỨNG SAU KHI XONG:
        expect(isRefreshing.value).toBe(false);
    });

    it('4. Bắt lỗi chuẩn xác khi mất mạng hoặc API lỗi (Axios Error)', async () => {
        // Ép API ném ra lỗi
        const mockError = new Error('Network Error');
        // Gắn thêm object response giả lập lỗi 500 từ server
        (mockError as any).response = { status: 500 };

        vi.mocked(weatherApi.fetchCurrentWeather).mockRejectedValue(mockError);
        // Ép axios nhận diện đây là lỗi của Axios
        vi.mocked(axios.isAxiosError).mockReturnValue(true);

        const { error, isLoading, loadWeather } = useWeather();

        await loadWeather();

        expect(error.value).toBe('Lỗi: 500'); // Đoạn catch trong code của bạn quy định in ra 'Lỗi: 500'
        expect(isLoading.value).toBe(false); // Dù lỗi vẫn phải tắt loading
    });

    it('5. Bắt lỗi không xác định (Non-Axios Error)', async () => {
        // Ép hàm ném ra một lỗi JS thông thường (ví dụ lỗi cú pháp, k phải lỗi mạng)
        vi.mocked(weatherApi.fetchCurrentWeather).mockRejectedValue(new Error('Lỗi lạ'));
        // Axios nhận diện không phải lỗi của nó
        vi.mocked(axios.isAxiosError).mockReturnValue(false);

        const { error, loadWeather } = useWeather();

        await loadWeather();

        expect(error.value).toBe('Lỗi không xác định');
    });

    // ==========================================
    // 3. TEST CÁC HÀM HELPER (LOGIC THUẦN TÚY)
    // ==========================================
    it('6. Helper: getWeatherDescription dịch đúng mã code', () => {
        const { getWeatherDescription } = useWeather();

        expect(getWeatherDescription(0)).toBe('Quang đãng');
        expect(getWeatherDescription(63)).toBe('Mưa rào');
        expect(getWeatherDescription(99)).toBe('Giông bão'); // Hoặc 'Không rõ' tùy theo code hiện tại của bạn
    });

    it('7. Helper: getWeatherIcon trả về đúng Icon Emoji', () => {
        const { getWeatherIcon } = useWeather();

        expect(getWeatherIcon(0)).toBe('☀️');
        expect(getWeatherIcon(61)).toBe('🌧️');
        expect(getWeatherIcon(95)).toBe('⛈️');
    });
});