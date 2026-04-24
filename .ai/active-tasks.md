# 🚧 Active Tasks & WIP (Work in Progress)

**Current Sprint:** Tối ưu hóa hiệu năng và mở rộng tính năng Dashboard.

## Đang làm dở (In Progress)
- [ ] Thay thế Mock Data của Giá vàng bằng việc kết nối API thật (Cần đăng ký `GoldAPI.io`).
- [ ] Chuyển đổi `<KeepAlive>` sang dạng Object mapping (`tabComponents`) ở `FinanceManager.vue`.

## Lên kế hoạch (To-Do)
- [ ] Áp dụng Virtual Scrolling (Cuộn ảo) cho danh sách lịch sử giao dịch (Khắc phục hoàn toàn tình trạng render 10,000 thẻ `<li>`).
- [ ] Tích hợp API Thời tiết thực tế (Open-Meteo) thay vì dữ liệu fix cứng.
- [ ] Config Axios Interceptors ở thư mục `api/` để chuẩn bị xử lý token (nếu sau này có làm tính năng Đăng nhập).

## Known Bugs (Cần sửa)
- Khi dùng `<KeepAlive>`, Chart.js ở tab Giá vàng đôi khi không tự động resize khi quay lại tab. Cần hook vào sự kiện `onActivated` để trigger `chart.update()`.