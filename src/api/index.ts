import axios from 'axios';

// 1. Khởi tạo Axios Instance
const apiClient = axios.create({
  // baseURL: 'https://api.yourdomain.com', // Base URL cho API chính của dự án (mở comment khi làm dự án thật)
  timeout: 10000, // Quá 10s không phản hồi thì báo lỗi
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. Request Interceptor: Chạy TRƯỚC khi gửi request lên server
apiClient.interceptors.request.use(
  (config) => {
    // 💡 Ví dụ thực tế: Tự động lấy Token từ localStorage và gắn vào Header
    // const token = localStorage.getItem('access_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Chạy SAU khi server trả data về, TRƯỚC khi vào Component
apiClient.interceptors.response.use(
  (response) => {
    // Nếu API trả về OK (200), cứ cho qua
    return response;
  },
  (error) => {
    // 💡 Xử lý lỗi tập trung ở đây (rất tiện!)
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.error('Hết hạn Token, vui lòng đăng nhập lại!');
        // Code chuyển hướng về trang Login: router.push('/login')
      } else if (status === 403) {
        console.error('Bạn không có quyền truy cập!');
      } else if (status >= 500) {
        console.error('Lỗi hệ thống từ Server!');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;