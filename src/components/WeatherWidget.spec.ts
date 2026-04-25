// file: src/components/WeatherWidget.spec.ts
import { mount } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import WeatherWidget from "./WeatherWidget.vue"
import { ref } from "vue" // Nhớ import ref

// 1. Import module composable để có thể giả lập (mock) nó
import * as useWeatherModule from "../composables/useWeather"

// Giả lập module useWeather để không gọi API thật hay chạy logic phức tạp
vi.mock("../composables/useWeather", () => ({
  useWeather: vi.fn(),
}))

describe("Component: WeatherWidget.vue", () => {
  // Tạo một hàm giả lập để theo dõi xem nút Refresh có gọi đúng hàm không
  const mockLoadWeather = vi.fn()

  // Helper function giúp tạo dữ liệu giả lập cho từng test case nhanh hơn
  const setupMock = (overrides = {}) => {
    vi.mocked(useWeatherModule.useWeather).mockReturnValue({
      // Bọc các giá trị khởi tạo bằng ref() để tránh lỗi TS
      weatherData: ref(null),
      isLoading: ref(false),
      isRefreshing: ref(false),
      error: ref(""),
      getWeatherDescription: vi.fn(() => "Mô tả giả lập"),
      getWeatherIcon: vi.fn(() => "☀️"),
      loadWeather: mockLoadWeather,
      ...overrides, // Cho phép ghi đè state cụ thể tùy từng test case
    })
  }

  beforeEach(() => {
    // Xóa bộ nhớ của các hàm mock trước mỗi test
    vi.clearAllMocks()
  })

  // ==========================================
  // CÁC TEST CASE GIAO DIỆN
  // ==========================================

  it('1. Hiển thị thông báo "Đang tải..." khi isLoading = true', () => {
    setupMock({ isLoading: true }) // Ép state thành đang loading

    const wrapper = mount(WeatherWidget)

    // Kiểm tra xem giao diện có chứa chữ "Đang tải..." không
    expect(wrapper.text()).toContain("Đang tải...")
    // Đảm bảo không render các phần tử dữ liệu
    expect(wrapper.find(".text-4xl").exists()).toBe(false)
  })

  it("2. Hiển thị thông báo lỗi khi có biến error", () => {
    setupMock({ error: "Mất mạng rồi!" })

    const wrapper = mount(WeatherWidget)

    // Kiểm tra giao diện hiển thị đúng text lỗi
    expect(wrapper.text()).toContain("⚠️ Mất mạng rồi!")
  })

  it("3. Hiển thị đúng dữ liệu thời tiết khi load thành công", () => {
    // Giả lập API đã trả về dữ liệu thành công
    setupMock({
      weatherData: { temperature: 28, weathercode: 0 },
    })

    const wrapper = mount(WeatherWidget)

    // Kiểm tra các thông số hiển thị trên giao diện
    expect(wrapper.text()).toContain("28°")
    expect(wrapper.text()).toContain("Hà Nội")
    expect(wrapper.text()).toContain("Mô tả giả lập")
    expect(wrapper.text()).toContain("☀️")
  })

  it("4. Nút Refresh bị vô hiệu hóa (disabled) khi đang tải", () => {
    setupMock({ isLoading: true })

    const wrapper = mount(WeatherWidget)
    const button = wrapper.find("button")

    // Nút phải có thuộc tính disabled
    expect(button.attributes("disabled")).toBeDefined()
  })

  it("5. Nhấn nút Refresh sẽ gọi hàm loadWeather(true)", async () => {
    setupMock({
      weatherData: { temperature: 28, weathercode: 0 },
    })

    const wrapper = mount(WeatherWidget)
    const button = wrapper.find("button")

    // Giả lập thao tác click chuột của người dùng bằng hàm trigger (bất đồng bộ)
    await button.trigger("click")

    // Kiểm tra xem hàm mockLoadWeather có được gọi chính xác 1 lần với tham số true không
    expect(mockLoadWeather).toHaveBeenCalledTimes(1)
    expect(mockLoadWeather).toHaveBeenCalledWith(true)
  })

  it('6. Hiển thị chữ "Đang cập nhật..." khi isRefreshing = true', () => {
    setupMock({
      weatherData: { temperature: 28, weathercode: 0 },
      isRefreshing: true,
    })

    const wrapper = mount(WeatherWidget)

    expect(wrapper.text()).toContain("Đang cập nhật...")
    // Nút cũng phải bị disabled khi đang refresh
    const button = wrapper.find("button")
    expect(button.attributes("disabled")).toBeDefined()
  })
})
