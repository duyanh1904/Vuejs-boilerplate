# 💼 Business Logic & Rules

## 1. Quản lý Thu/Chi (Finance)
- **Công thức cốt lõi**: `Số Dư` (Balance) = Tổng `Thu` (Income) - Tổng `Chi` (Expense).
- **Quy tắc Báo cáo**: Tỷ lệ chi tiêu = `(Tổng Chi / Tổng Thu) * 100`. Nếu Thu = 0 mà Chi > 0 thì mặc định tỷ lệ là 100%. Nếu Tỷ lệ > 100% (Chi vượt thu), cảnh báo text đỏ (`text-rose-500`).
- **Data Mocking**: Để test hiệu năng, dự án đang dùng script giả lập 10,000 bản ghi lịch sử, ép kiểu dữ liệu vào thẻ HTML tĩnh (`mock-btn` trong `index.html`) để nạp thẳng vào LocalStorage (key: `vue_finance_data`).
- **Tối ưu Load data lớn**: Khuyến nghị tương lai sử dụng Virtual Scrolling và `shallowRef` cho mảng `transactions`.

## 2. Giá Vàng (Gold Tracking)
- Cập nhật tự động hoặc bấm nút "Làm mới" trên giao diện.
- Hiện đang dùng Mock Data (tạo mảng 30 phần tử, biên độ giá dao động ngẫu nhiên +- 500,000 VNĐ).
- Cần làm tròn hoặc format số tiền ngắn gọn cho trục Y của biểu đồ (VD: `82000000` -> `82 Tr`).

## 3. Thời tiết (Weather Widget)
- Component nhỏ gắn Header, tự động load nhiệt độ và hiển thị Icon tương ứng với mã `weathercode`.