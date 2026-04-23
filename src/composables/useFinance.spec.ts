import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFinance } from './useFinance';
import { useFinanceStore } from '../stores/financeStore';

describe('Composable: useFinance.ts', () => {
    beforeEach(() => {
        // Khởi tạo một Pinia instance mới tinh trước MỖI test case.
        // Điều này đảm bảo state không bị rò rỉ (leak) từ test case này sang test case khác.
        setActivePinia(createPinia());
    });

    it('1. Khởi tạo với các giá trị state mặc định chính xác', () => {
        const { formType, formAmount, formDescription, errorMessage, activeTab, reportFilter } = useFinance();

        expect(formType.value).toBe('expense');
        expect(formAmount.value).toBeNull();
        expect(formDescription.value).toBe('');
        expect(errorMessage.value).toBe('');
        expect(activeTab.value).toBe('home');
        expect(reportFilter.value).toBe('month');
    });

    it('2. Báo lỗi khi submit form nhưng để trống mô tả', () => {
        const { submitForm, errorMessage, formAmount } = useFinance();

        // Giả lập nhập đủ tiền nhưng quên nhập mô tả
        formAmount.value = 50000;
        submitForm();

        expect(errorMessage.value).toBe('Vui lòng nhập mô tả.');
    });

    it('3. Báo lỗi khi submit form với số tiền không hợp lệ (âm hoặc bằng 0)', () => {
        const { submitForm, errorMessage, formDescription, formAmount } = useFinance();

        // Giả lập nhập mô tả nhưng nhập tiền sai
        formDescription.value = 'Mua cafe';
        formAmount.value = -10000;
        submitForm();

        expect(errorMessage.value).toBe('Số tiền phải lớn hơn 0.');
    });

    it('4. Thêm giao dịch thành công và reset form về mặc định', () => {
        const { submitForm, formDescription, formAmount, formType, errorMessage } = useFinance();
        const store = useFinanceStore();

        // Giả lập hành vi người dùng nhập liệu
        formDescription.value = 'Nhận lương tháng';
        formAmount.value = 15000000;
        formType.value = 'income';

        // Bấm submit
        submitForm();

        // Kiểm tra form đã được dọn sạch chưa
        expect(errorMessage.value).toBe('');
        expect(formDescription.value).toBe('');
        expect(formAmount.value).toBeNull();
        expect(formType.value).toBe('expense'); // Phải reset về expense

        // Kiểm tra dữ liệu đã vào Pinia Store chưa
        expect(store.transactions.length).toBe(1);
        expect(store.transactions[0]?.description).toBe('Nhận lương tháng');
        expect(store.transactions[0]?.amount).toBe(15000000);
        expect(store.transactions[0]?.type).toBe('income');
    });

    it('5. Hàm deleteItem gọi đúng hành động trong store', () => {
        const { deleteItem } = useFinance();
        const store = useFinanceStore();

        // Mock hàm deleteTransaction của store
        store.deleteTransaction = vi.fn();

        deleteItem('mock-id-123');

        expect(store.deleteTransaction).toHaveBeenCalledWith('mock-id-123');
    });

    it('6. Hàm formatCurrency định dạng đúng tiền tệ Việt Nam', () => {
        const { formatCurrency } = useFinance();
        const result = formatCurrency(2500000);

        // Regex kiểm tra số 2.500.000 (loại bỏ lỗi non-breaking space tùy môi trường Node)
        expect(result).toMatch(/2\.500\.000/);
        expect(result).toContain('₫'); // Symbol tiền Việt
    });

    it('7. Hàm filterLabel tính toán chính xác label dựa trên reportFilter', () => {
        const { filterLabel, reportFilter } = useFinance();

        reportFilter.value = 'week';
        expect(filterLabel.value).toBe('7 ngày qua');

        reportFilter.value = 'month';
        expect(filterLabel.value).toBe('Tháng này');

        reportFilter.value = 'year';
        expect(filterLabel.value).toBe('Năm nay');
    });
});