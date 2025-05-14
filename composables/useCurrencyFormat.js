export function useCurrencyFormat() {
    const formatVND = (amount) => {
        if (isNaN(amount)) return '0 VNĐ'
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
    }

    const formatVNDWithSymbol = (amount) => {
        if (isNaN(amount)) return '0 ₫'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    const unformatVND = (formatted) => {
        // Xóa mọi ký tự không phải số
        return Number(formatted.replace(/[^\d]/g, ''))
    }

    return {
        formatVND,
        formatVNDWithSymbol,
        unformatVND,
    }
}
