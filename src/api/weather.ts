import apiClient from "./index"

// Định nghĩa Type
export interface CurrentWeather {
  temperature: number
  windspeed: number
  winddirection: number
  weathercode: number
  time: string
}

export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<CurrentWeather> => {
  // Ghi chú: Vì Open-Meteo có domain riêng, ta có thể ghi đè baseURL trực tiếp trong request này
  // (nếu apiClient có baseURL của backend dự án bạn)
  const response = await apiClient.get("/forecast", {
    baseURL: "https://api.open-meteo.com/v1",
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      timezone: "Asia/Bangkok",
    },
  })

  return response.data.current_weather
}
