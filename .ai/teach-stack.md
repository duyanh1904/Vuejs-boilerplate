# 🛠️ Tech Stack & Configurations

## Core Framework
- **Vue.js 3**: Sử dụng hoàn toàn Composition API với cú pháp `<script setup>`. KHÔNG dùng Options API.
- **TypeScript**: Bật chế độ Strict Mode. Ưu tiên khai báo `interface` rõ ràng. Dùng Non-null assertion (`!`) khi truy xuất phần tử mảng có độ dài cố định.
- **Build Tool**: Vite.

## State Management
- **Pinia**: Setup store dạng Composition API (dùng `ref` cho state, `computed` cho getters, `function` cho actions).
- **Persistence**: Sử dụng `pinia-plugin-persistedstate`. Key mặc định lưu LocalStorage là tên của store.

## Styling & UI
- **Tailwind CSS 4.0**: Sử dụng Utility-first. 
  - Thứ tự class: Layout (`flex`, `grid`) -> Kích thước (`w-`, `h-`) -> Typography (`text-`) -> Visual (`bg-`, `border`, `shadow-sm`) -> Trạng thái (`hover:`).
  - Không dùng màu đậm cho nền. Thường xuyên dùng `rounded-2xl` cho thẻ lớn và `shadow-sm`.

## Libraries
- **Biểu đồ**: Dùng `Chart.js` kết hợp `vue-chartjs`. Áp dụng kỹ thuật Smooth Curve (`tension: 0.4`) và Gradient Fill qua Context 2D.
- **Testing**: `Vitest` kết hợp `@vue/test-utils` và môi trường giả lập DOM `jsdom`.

## Data Loading
- Sử dụng `defineAsyncComponent` để Lazy load các component nặng (như biểu đồ).
- API Client: Axios (Tương lai sẽ config interceptors).