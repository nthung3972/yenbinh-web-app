export default function useDateFormat() {
    /**
     * Chuyển đổi datetime ISO thành định dạng YYYY-MM-DD để hiển thị trong <input type="date">
     */
    const formatDate = (dateString) => {

      if (!dateString) return '';
      return dateString.split('T')[0];
    };
  
    /**
     * Hàm xử lý reactive ngày tháng dùng cho v-model
     */
    const useDateModel = (dateRef) => {
      return computed({
        get: () => formatDate(dateRef.value),
        set: (newDate) => {
          dateRef.value = newDate; // Chỉ lấy ngày, bỏ phần thời gian
        }
      });
    };
  
    return { formatDate, useDateModel };
  }
