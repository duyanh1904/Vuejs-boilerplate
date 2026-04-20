import { ref, onMounted } from 'vue';
import axios from 'axios';
import { fetchCurrentWeather, type CurrentWeather } from '../api/weather';

export function useWeather() {
  // 1. State quản lý giao diện
  const weatherData = ref<CurrentWeather | null>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<string>('');

  // 2. Logic gọi API và xử lý lỗi
  const loadWeather = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      // Gọi hàm từ file service, truyền tọa độ Hà Nội
      const data = await fetchCurrentWeather(21.0285, 105.8542);
      weatherData.value = data;
    } catch (err) {
      // Xử lý lỗi Axios tại đây để báo ra UI
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          error.value = 'Kết nối quá hạn, vui lòng thử lại sau.';
        } else if (!err.response) {
          error.value = 'Mất kết nối mạng.';
        } else {
          error.value = `Lỗi máy chủ: ${err.response.status}`;
        }
      } else {
        error.value = 'Đã xảy ra lỗi không xác định.';
      }
      console.error("Lỗi lấy thời tiết:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // 3. Hàm gọi tự động khi Component xuất hiện
  onMounted(() => {
    loadWeather();
  });

  // 4. Các helper định dạng (Dịch mã API sang Text/Icon)
  const getWeatherDescription = (code: number): string => {
    if (code === 0) return 'Quang đãng';
    if (code >= 1 && code <= 3) return 'Có mây';
    if (code >= 45 && code <= 48) return 'Sương mù';
    if (code >= 51 && code <= 55) return 'Mưa phùn';
    if (code >= 61 && code <= 65) return 'Mưa rào';
    if (code >= 71 && code <= 75) return 'Tuyết rơi';
    if (code >= 80 && code <= 82) return 'Mưa rào mạnh';
    if (code >= 95) return 'Giông bão';
    return 'Không rõ';
  };

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return '☀️'; 
    if (code >= 1 && code <= 3) return '⛅'; 
    if (code >= 45 && code <= 48) return '🌫️'; 
    if (code >= 51 && code <= 65) return '🌧️'; 
    if (code >= 71 && code <= 75) return '❄️'; 
    if (code >= 80 && code <= 82) return '🌦️'; 
    if (code >= 95) return '⛈️'; 
    return '🌡️';
  };

  // Xuất ra để Component sử dụng
  return {
    weatherData,
    isLoading,
    error,
    getWeatherDescription,
    getWeatherIcon,
    loadWeather // Xuất thêm hàm này nếu sau này bạn muốn làm nút "Làm mới"
  };
}