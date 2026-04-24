# 🏛️ Architecture & Folder Structure

Dự án tuân thủ nghiêm ngặt **Clean Architecture** và nguyên tắc **Separation of Concerns** (Tách biệt mối quan tâm).

## 1. Components (`src/components/`)
- **Nhiệm vụ**: CHỈ chịu trách nhiệm hiển thị giao diện (UI) và nhận tương tác của người dùng.
- **Quy tắc**: Không chứa logic tính toán dữ liệu nội bộ. Phải gọi dữ liệu từ file Composable tương ứng.
- **Tối ưu**: Sử dụng `<KeepAlive>` kết hợp Dynamic Component (`<component :is="...">`) khi chuyển Tab để tránh hủy diệt DOM và block CPU. Dùng `v-show` cho các UI nhấp nháy liên tục.

## 2. Composables (`src/composables/`)
- **Nhiệm vụ**: Chứa toàn bộ Business Logic, định nghĩa các hàm, tính toán Computed.
- **Quy tắc**: File `.vue` gọi file `.ts` ở đây để lấy `state` và `actions`. 
- **Ví dụ**: `useFinance.ts` xử lý form thu/chi, filter. `useGold.ts` xử lý call API giá vàng, tính toán mảng dữ liệu đồ thị.

## 3. Stores (`src/stores/`)
- **Nhiệm vụ**: Lưu trữ Global State (dữ liệu dùng chung).
- **Quy tắc**: Không được sửa trực tiếp biến state từ Component (Anti-pattern). Mọi thay đổi phải đi qua hàm (action) được định nghĩa trong Store.

## 4. API (`src/api/`)
- Chứa các file định nghĩa Endpoint để kết nối Backend ngoài (VD: `gold.ts`, `weather.ts`).