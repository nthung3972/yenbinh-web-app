<template>
  <div class="chart-container row">
    <div class="col-6">
      <canvas ref="chartRef"></canvas>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useDashboardStore } from "~/stores/dashboard";

Chart.register(...registerables);

const useDashboard = useDashboardStore();
const chartRef = ref(null);
let chart = null;

// Cấu hình biểu đồ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Báo cáo thu phí dịch vụ',
      font: {
        size: 18
      }
    },
    legend: {
      position: 'bottom'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      titleFont: { size: 14 },
      bodyFont: { size: 14 }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: { display: true, text: 'Tỷ lệ (%)' }
    },
    x: {
      title: { display: true, text: 'Thời gian' }
    }
  }
};

// Hàm cập nhật dữ liệu biểu đồ
const updateChart = () => {
  if (!chart || !useDashboard.collectionRate.length) return;

  // Danh sách 12 tháng đầy đủ
  const fullMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  // Tạo danh sách nhãn (Tháng 1 - Tháng 12)
  const labels = fullMonths.map(month => `Tháng ${month}`);

  // Tạo dữ liệu, mặc định là 0 nếu API không trả về tháng đó
  const data = fullMonths.map(month => {
    const found = useDashboard.collectionRate.find(item => item.month === month);
    return found ? found.collection_rate : 0;
  });

  // Cập nhật dữ liệu vào biểu đồ
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
};

onMounted(async () => {
  await useDashboard.fetchCollectionRate();

  const fullMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  // Tạo dữ liệu biểu đồ với mặc định là 0 nếu không có dữ liệu từ API
  const chartDataset = fullMonths.map(month => {
    const found = useDashboard.collectionRate.find(item => item.month === month);
    return found ? found.collection_rate : 0;
  });
  console.log('dsadsdasdasd', chartDataset);
  

  const ctx = chartRef.value.getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ],
      datasets: [{
        label: 'Tỷ lệ đóng phí dịch vụ (%)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.3,
        data: chartDataset
      }]
    },
    options: chartOptions
  });

  updateChart(); // Cập nhật dữ liệu lần đầu tiên
});

// Theo dõi khi dữ liệu từ API thay đổi
watch(() => useDashboard.collectionRate, updateChart, { deep: true });

onBeforeUnmount(() => {
  if (chart) chart.destroy();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  margin: 20px 0;
}
</style>
