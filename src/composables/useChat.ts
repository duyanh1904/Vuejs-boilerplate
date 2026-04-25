// file: src/composables/useChat.ts
import { ref, watch, nextTick, onMounted } from 'vue';

// 1. Định nghĩa Type rõ ràng (Type Safety)
export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
}

// 2. Tách hằng số tránh hardcode (Clean Code)
const STORAGE_KEY = 'finance_chat_history';
const BOT_DELAY_MS = 1000;

export function useChat() {
    // ==========================================
    // STATE CỦA COMPOSABLE
    // ==========================================
    const isOpen = ref(false);
    const inputText = ref('');
    const messages = ref<Message[]>([]);
    const chatContainer = ref<HTMLElement | null>(null);

    // ==========================================
    // CÁC HÀM XỬ LÝ LOGIC (ACTIONS)
    // ==========================================
    const loadHistory = () => {
        const savedHistory = localStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
            messages.value = JSON.parse(savedHistory);
        } else {
            // Tin nhắn mặc định nếu chưa từng chat
            messages.value = [{
                id: Date.now(),
                text: 'Chào bạn! Mình có thể giúp gì cho việc quản lý chi tiêu của bạn hôm nay?',
                sender: 'bot',
                timestamp: Date.now()
            }];
        }
    };

    const scrollToBottom = async () => {
        await nextTick(); // Chờ DOM cập nhật
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    };

    const sendMessage = () => {
        const text = inputText.value.trim();
        if (!text) return;

        // 1. Đẩy tin nhắn của User vào
        messages.value.push({
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: Date.now()
        });

        // 2. Dọn dẹp UI
        inputText.value = '';
        scrollToBottom();

        // 3. Giả lập Bot phản hồi sau khoảng trễ
        setTimeout(() => {
            messages.value.push({
                id: Date.now() + 1,
                text: `Tôi đã ghi nhận yêu cầu: "${text}". Tính năng AI đang được nâng cấp!`,
                sender: 'bot',
                timestamp: Date.now()
            });
            scrollToBottom();
        }, BOT_DELAY_MS);
    };

    // ==========================================
    // LIFECYCLES & WATCHERS
    // ==========================================
    onMounted(() => {
        loadHistory();
        scrollToBottom();
    });

    // Tự động lưu lịch sử hễ mảng messages có sự thay đổi
    watch(messages, (newVal) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
    }, { deep: true });

    // ==========================================
    // EXPORT NHỮNG GÌ COMPONENT CẦN
    // ==========================================
    return {
        isOpen,
        inputText,
        messages,
        chatContainer,
        sendMessage
    };
}