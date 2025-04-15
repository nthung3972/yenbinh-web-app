<!-- pages/residents/[id].vue -->
<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="hasError">{{ hasError }}</div>
    <div v-else>
        <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h4 class="fw-bold text-primary">
                            <Icon name="mdi:receipt-text" size="24" class="me-2" />
                            Thông tin cư dân
                        </h4>
                        <button class="btn btn-outline-secondary" @click="goBack()">
                            <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                            Quay lại
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Avatar và thông tin cơ bản -->
                            <div class="col-md-3 text-center">
                                <div class="avatar-wrapper mb-3">
                                    <img :src="defaultAvatar" alt="Avatar" class="rounded-circle img-fluid mb-3"
                                        style="width: 150px; height: 150px; object-fit: cover;">
                                    <h5>{{ useResident.resident.full_name }}</h5>
                                    <p class="text-muted">ID: {{ useResident.resident.resident_id }}</p>
                                </div>
                                <div class="mt-3">
                                    <button class="btn btn-primary btn-sm w-100 mb-2">
                                        <i class="fas fa-envelope me-1"></i> Gửi thông báo
                                    </button>
                                    <button class="btn btn-info btn-sm w-100">
                                        <i class="fas fa-history me-1"></i> Xem lịch sử
                                    </button>
                                </div>
                            </div>

                            <div class="col-md-9">
                                <!-- Thông tin chính -->
                                <div class="profile-body">
                                    <div class="info-section">
                                        <h4 class="section-title">
                                            <Icon name="mdi:account-circle" size="20" /> Thông tin cá nhân
                                        </h4>
                                        <div class="info-grid">
                                            <div class="info-item">
                                                <span class="info-icon"><Icon name="mdi:card-account-details-outline" size="18" /></span>
                                                <div>
                                                    <p class="info-label">CMND/CCCD</p>
                                                    <p class="info-value">{{ useResident.resident.id_card_number }}</p>
                                                </div>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-icon"><Icon name="mdi:cake-variant" size="18" /></span>
                                                <div>
                                                    <p class="info-label">Ngày sinh</p>
                                                    <p class="info-value">{{ formatDate(useResident.resident.date_of_birth) }}</p>
                                                </div>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-icon"><Icon name="mdi:gender-male-female" size="18" /></span>
                                                <div>
                                                    <p class="info-label">Giới tính</p>
                                                    <p class="info-value">{{ useResident.resident.gender }}</p>
                                                </div>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-icon"><Icon name="mdi:calendar-plus" size="18" /></span>
                                                <div>
                                                    <p class="info-label">Ngày đăng ký</p>
                                                    <p class="info-value">{{ formatDate(useResident.resident.created_at) }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="info-section">
                                        <h4 class="section-title">
                                            <Icon name="mdi:phone" size="20" /> Liên hệ
                                        </h4>
                                        <div class="info-grid">
                                            <div class="info-item">
                                                <span class="info-icon"><Icon name="mdi:phone-outline" size="18" /></span>
                                                <div>
                                                    <p class="info-label">Điện thoại</p>
                                                    <p class="info-value">{{ useResident.resident.phone_number }}</p>
                                                </div>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-icon"><Icon name="mdi:email-outline" size="18" /></span>
                                                <div>
                                                    <p class="info-label">Email</p>
                                                    <p class="info-value">{{ useResident.resident.email }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="info-section">
                                        <h4 class="section-title">
                                            <Icon name="mdi:note-text-outline" size="20" /> Ghi chú
                                        </h4>
                                        <div class="note-box">
                                            <p style="margin: unset;">{{ useResident.resident.notes ?? 'Không có ghi chú' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Căn hộ sở hữu -->
        <div class="row">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Danh sách căn hộ sở hữu</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-light sticky-top">
                                    <tr>
                                        <th>Căn hộ</th>
                                        <th>Tầng</th>
                                        <th>Diện tích</th>
                                        <th>Loại căn hộ</th>
                                        <th>Vai trò</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="apartment in useResident.resident.apartments" :key="apartment.id">
                                        <td>{{ apartment.apartment_number }}</td>
                                        <td>{{ apartment.floor_number }}</td>
                                        <td>{{ apartment.area }} m²</td>
                                        <td>{{ apartment.ownership_type }}</td>
                                        <td>
                                            <span
                                            :class="{
                                            'badge bg-success': apartment.pivot.role_in_apartment === 0,
                                            'badge bg-info': apartment.pivot.role_in_apartment === 1,
                                            'badge bg-warning text-dark': apartment.pivot.role_in_apartment === 2
                                            }"
                                            >
                                                {{
                                                    apartment.pivot.role_in_apartment === 0
                                                    ? 'Chủ hộ'
                                                    : apartment.pivot.role_in_apartment === 1
                                                    ? 'Người thuê'
                                                    : apartment.pivot.role_in_apartment === 2
                                                    ? 'Người thân'
                                                    : '----'
                                                }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(apartment.pivot.registration_date) }}</td>
                                        <td>
                                            <span
                                            :class="{
                                            'badge bg-primary': apartment.pivot.registration_status === 0,
                                            'badge bg-secondary': apartment.pivot.registration_status === 1
                                            }"
                                            >
                                                {{
                                                    apartment.pivot.registration_status === 0
                                                    ? 'Đang cư trú'
                                                    : apartment.pivot.registration_status === 1
                                                    ? 'Đã rời đi'
                                                    : '----'
                                                }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab navigation cho thông tin khác -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-header bg-white p-0">
                        <ul class="nav nav-tabs" id="residentTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="payments-tab" data-bs-toggle="tab"
                                    data-bs-target="#payments" type="button" role="tab">
                                    Lịch sử thanh toán
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="complaints-tab" data-bs-toggle="tab"
                                    data-bs-target="#complaints" type="button" role="tab">
                                    Phản ánh & khiếu nại
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="documents-tab" data-bs-toggle="tab"
                                    data-bs-target="#documents" type="button" role="tab">
                                    Tài liệu
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="activity-tab" data-bs-toggle="tab"
                                    data-bs-target="#activity" type="button" role="tab">
                                    Hoạt động gần đây
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="residentTabContent">
                            <div class="tab-pane fade show active" id="payments" role="tabpanel">
                                <p class="text-muted">Hiển thị lịch sử thanh toán của cư dân</p>
                                <!-- Nội dung lịch sử thanh toán -->
                            </div>
                            <div class="tab-pane fade" id="complaints" role="tabpanel">
                                <p class="text-muted">Hiển thị phản ánh và khiếu nại của cư dân</p>
                                <!-- Nội dung phản ánh và khiếu nại -->
                            </div>
                            <div class="tab-pane fade" id="documents" role="tabpanel">
                                <p class="text-muted">Hiển thị tài liệu của cư dân</p>
                                <!-- Nội dung tài liệu -->
                            </div>
                            <div class="tab-pane fade" id="activity" role="tabpanel">
                                <p class="text-muted">Hiển thị hoạt động gần đây của cư dân</p>
                                <!-- Nội dung hoạt động gần đây -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useResidentStore } from '@/stores/resident'
import defaultAvatar from '@/assets/images/avatar-default.jpg'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useResident = useResidentStore()
const route = useRoute();
const router = useRouter();
const residentId = route.params.id;
const isLoading = computed(() => useResident.isLoading);
const hasError = computed(() => useResident.hasError);

const formatDate = (date) => {
  if (!date) return 'Chưa cập nhật'
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const goBack = () => {
    router.back()
}

const loadResidentInfo = async () => {
    await useResident.fetchResident(residentId)
}

onMounted(() => {
    loadResidentInfo()
})
</script>

<style scoped>
.avatar-wrapper {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #f8f9fa;
}

.form-control-plaintext {
    padding: 0.375rem 0;
    font-weight: 500;
}

.form-label {
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.nav-tabs .nav-link {
    border: none;
    color: #6c757d;
    padding: 1rem 1.5rem;
}

.nav-tabs .nav-link.active {
    border-bottom: 2px solid #0d6efd;
    color: #0d6efd;
    font-weight: 500;
}

.table th {
    font-weight: 500;
    color: #495057;
}

.table td {
    vertical-align: middle;
}

.badge {
    font-weight: 500;
    padding: 0.5em 0.65em;
}

.resident-profile {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  max-width: 700px;
  margin: 0 auto;
}

.profile-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 30px 20px;
  text-align: center;
  color: white;
  position: relative;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
  border: 3px solid white;
}

.online-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: #4ade80;
  border-radius: 50%;
  border: 2px solid white;
}

.resident-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
}

.resident-id {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 0;
}

.profile-body {
  padding: 0 25px;
}

.section-title {
  color: #4a5568;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background-color: #f8fafc;
  transform: translateY(-2px);
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5568;
  font-size: 18px;
}

.info-label {
  font-size: 13px;
  color: #718096;
  margin-bottom: 3px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0;
}

.note-box {
  background-color: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
  font-size: 14px;
  line-height: 1.6;
}

.profile-footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 25px;
  background-color: #f8fafc;
  border-top: 1px solid #eee;
}

.btn-action {
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-print {
  background-color: #bee3f8;
  color: #2b6cb0;
}

.btn-message {
  background-color: #c6f6d5;
  color: #2f855a;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-footer {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn-action {
    width: 100%;
    justify-content: center;
  }
}
</style>
