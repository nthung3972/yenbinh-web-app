export const useFormErrors = () => {
    const formatErrors = (errors) => {
        const formattedErrors = {};

        Object.keys(errors).forEach(key => {
            // Chọn lấy lỗi đầu tiên của mỗi trường
            formattedErrors[key] = errors[key][0];
        });

        return formattedErrors;
    };

    return { formatErrors };
};