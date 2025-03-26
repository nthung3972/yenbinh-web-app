export const useScrollToError = () => {
    const scrollToError = (errorFields, formRefs) => {
        // Kiểm tra nếu có lỗi
        if (errorFields.length > 0) {
            // Lấy trường lỗi đầu tiên
            const firstErrorField = errorFields[0]

            // Tìm ref tương ứng với trường lỗi
            const errorElement = formRefs[firstErrorField]?.value

            if (errorElement) {
                // Cuộn tới phần tử với offset để hiển thị rõ
                errorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }
    }

    return { scrollToError }
}