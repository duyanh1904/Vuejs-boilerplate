import { ref, onMounted } from "vue"
import axios from "axios"
import { fetchCurrentWeather, type CurrentWeather } from "../api/weather"

export function useWeather() {
  const weatherData = ref<CurrentWeather | null>(null)
  const isLoading = ref<boolean>(true)
  const isRefreshing = ref<boolean>(false) // Thêm trạng thái làm mới riêng
  const error = ref<string>("")

  const loadWeather = async (silent = false) => {
    // Nếu là 'silent', chúng ta dùng isRefreshing thay vì isLoading để tránh làm mất giao diện hiện tại
    if (silent) isRefreshing.value = true
    else isLoading.value = true

    error.value = ""

    try {
      // Tọa độ Hà Nội: 21.0285, 105.8542
      const data = await fetchCurrentWeather(21.0285, 105.8542)
      weatherData.value = data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response
          ? `Lỗi: ${err.response.status}`
          : "Lỗi kết nối mạng"
      } else {
        error.value = "Lỗi không xác định"
      }
    } finally {
      isLoading.value = false
      isRefreshing.value = false
    }
  }

  onMounted(() => {
    loadWeather()
  })

  // Các helper định dạng giữ nguyên như cũ...
  const getWeatherDescription = (code: number): string => {
    if (code === 0) return "Quang đãng"
    if (code >= 1 && code <= 3) return "Có mây"
    if (code >= 61 && code <= 65) return "Mưa rào"
    if (code >= 95) return "Giông bão"
    return "Thời tiết khác"
  }

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "☀️"
    if (code >= 1 && code <= 3) return "⛅"
    if (code >= 61 && code <= 65) return "🌧️"
    if (code >= 95) return "⛈️"
    return "🌡️"
  }

  return {
    weatherData,
    isLoading,
    isRefreshing, // Xuất thêm trạng thái này
    error,
    getWeatherDescription,
    getWeatherIcon,
    loadWeather, // Hàm này sẽ được gọi khi nhấn nút
  }
}
