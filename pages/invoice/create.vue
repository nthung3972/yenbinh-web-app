<template>
    <div class="invoice-container">
      <div class="invoice-header">
        <h1>Tạo Hóa Đơn Chung Cư</h1>
      </div>
      
      <form @submit.prevent="taoHoaDon">
        <div class="form-group">
          <label>Mã Căn Hộ</label>
          <input 
            v-model="maCanHo" 
            type="text" 
            class="form-control" 
            placeholder="Nhập mã căn hộ" 
            required
          >
        </div>
        
        <div class="form-group">
          <label>Kỳ Hóa Đơn</label>
          <input 
            v-model="kyHoaDon" 
            type="month" 
            class="form-control" 
            required
          >
        </div>
        
        <div class="invoice-details">
          <div class="invoice-details-header">
            <span>Các Khoản Phí</span>
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="themKhoanPhi"
            >
              + Thêm Khoản Phí
            </button>
          </div>
          
          <div 
            v-for="(phi, index) in danhSachPhi" 
            :key="index" 
            class="invoice-detail-row"
          >
            <select 
              v-model="phi.loaiPhi" 
              class="form-control" 
              style="width: 40%;"
            >
              <option value="">Chọn loại phí</option>
              <option value="DIEN">Tiền điện</option>
              <option value="NUOC">Tiền nước</option>
              <option value="QUANLY">Phí quản lý</option>
              <option value="GUIXE">Phí gửi xe</option>
            </select>
            <input 
              v-model.number="phi.soLuong" 
              type="number" 
              class="form-control" 
              placeholder="Số lượng" 
              style="width: 20%;"
              @input="tinhTongTien"
            >
            <input 
              v-model.number="phi.donGia" 
              type="number" 
              class="form-control" 
              placeholder="Đơn giá" 
              style="width: 20%;"
              @input="tinhTongTien"
            >
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="xoaKhoanPhi(index)"
            >
              Xóa
            </button>
          </div>
          
          <div class="total-section">
            Tổng Tiền: {{ tongTien.toLocaleString() }} VNĐ
          </div>
        </div>
        
        <div class="form-group" style="margin-top: 20px;">
          <button type="submit" class="btn">Tạo Hóa Đơn</button>
          <button type="reset" class="btn btn-secondary" @click="lamMoi">
            Làm Mới
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useToast } from 'vue-toastification'

  definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})
  
  // Khai báo state
  const maCanHo = ref('')
  const kyHoaDon = ref('')
  const danhSachPhi = ref([
    { loaiPhi: '', soLuong: 0, donGia: 0 }
  ])
  const tongTien = ref(0)
  const toast = useToast()
  
  // Thêm khoản phí
  const themKhoanPhi = () => {
    danhSachPhi.value.push({ 
      loaiPhi: '', 
      soLuong: 0, 
      donGia: 0 
    })
  }
  
  // Xóa khoản phí
  const xoaKhoanPhi = (index) => {
    if (danhSachPhi.value.length > 1) {
      danhSachPhi.value.splice(index, 1)
      tinhTongTien()
    } else {
      toast.warning('Phải có ít nhất một khoản phí')
    }
  }
  
  // Tính tổng tiền
  const tinhTongTien = () => {
    tongTien.value = danhSachPhi.value.reduce((total, phi) => {
      return total + (phi.soLuong * phi.donGia)
    }, 0)
  }
  
  // Tạo hóa đơn
  const taoHoaDon = async () => {
    // Validate dữ liệu
    if (!maCanHo.value) {
      toast.error('Vui lòng nhập mã căn hộ')
      return
    }
  
    if (!kyHoaDon.value) {
      toast.error('Vui lòng chọn kỳ hóa đơn')
      return
    }
  
    // Validate danh sách phí
    const phiHopLe = danhSachPhi.value.every(phi => 
      phi.loaiPhi && phi.soLuong > 0 && phi.donGia > 0
    )
  
    if (!phiHopLe) {
      toast.error('Vui lòng điền đầy đủ thông tin các khoản phí')
      return
    }
  
    // Chuẩn bị dữ liệu
    const hoaDon = {
      maCanHo: maCanHo.value,
      kyHoaDon: kyHoaDon.value,
      danhSachPhi: danhSachPhi.value,
      tongTien: tongTien.value
    }
  
    try {
      // Gọi API tạo hóa đơn
      const response = await $fetch('/api/hoadon', {
        method: 'POST',
        body: hoaDon
      })
  
      toast.success('Tạo hóa đơn thành công')
      lamMoi()
    } catch (error) {
      toast.error('Lỗi khi tạo hóa đơn: ' + error.message)
    }
  }
  
  // Làm mới form
  const lamMoi = () => {
    maCanHo.value = ''
    kyHoaDon.value = ''
    danhSachPhi.value = [{ loaiPhi: '', soLuong: 0, donGia: 0 }]
    tongTien.value = 0
  }
  </script>
  
  <style scoped>
  .invoice-container {
            background-color: white;
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .invoice-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .invoice-header h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }
        .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .invoice-details {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .invoice-details-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .invoice-detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }
        .btn-secondary {
            background-color: #f0f0f0;
            color: #333;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .total-section {
            margin-top: 20px;
            text-align: right;
            font-weight: bold;
        }
  </style>
