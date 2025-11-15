export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';

  const num = parseFloat(value);
  if (isNaN(num)) return '';

  const isInteger = Number.isInteger(num);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function handlePriceInput(event) {
  // Chỉ cho phép số và dấu chấm
  const raw = event.target.value.replace(/[^\d.]/g, '');

  // Lấy giá trị thật (số)
  const numericValue = parseFloat(raw || 0);

  // Hiển thị format đẹp
  event.target.value = formatPrice(numericValue);

  // 👉 Không dispatch lại input nữa (gây lặp vô hạn)
  return numericValue;
}