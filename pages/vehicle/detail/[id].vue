<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="hasError">{{ hasError }}</div>
    <div v-else class="container-fluid">
    <!-- Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card shadow">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h4 class="fw-bold text-primary">
                        <Icon name="mdi:car" size="28" class="me-2" />
                        Thông tin phương tiện
                    </h4>
                    <button class="btn btn-outline-secondary" @click="goBack">
                        <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                        Quay lại
                    </button>
                </div>

                <div class="card-body">
                    <div class="row">
                        <!-- Hình ảnh phương tiện -->
                        <div class="col-md-3 text-center">
                            <div class="mb-3">
                                <img :src="defaultVehicle" alt="Hình ảnh phương tiện" class="img-fluid rounded mb-3"
                                     style="width: 150px; height: 150px; object-fit: cover;">
                                <h5 class="text-uppercase">{{ useVehicle.vehicle.vehicle_company }} {{ useVehicle.vehicle.vehicle_model }}</h5>
                                <p class="text-muted">Biển số: {{ useVehicle.vehicle.license_plate }}</p>
                                <span
                                    :class="{
                                        'badge bg-success': useVehicle.vehicle.status === 0,
                                        'badge bg-secondary': useVehicle.vehicle.status !== 0
                                    }">
                                    {{
                                        useVehicle.vehicle.status === 0
                                            ? 'Đang hoạt động'
                                            : 'Ngừng hoạt động'
                                    }}
                                </span>
                            </div>
                        </div>

                        <!-- Thông tin chi tiết -->
                        <div class="col-md-9">
                            <div class="profile-body">
                                <div class="info-section">
                                    <h4 class="section-title">
                                        <Icon name="mdi:card-text" size="20" /> Thông tin cơ bản
                                    </h4>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:car-info" size="18" /></span>
                                            <div>
                                                <p class="info-label">Loại phương tiện</p>
                                                <!-- <p class="info-value">{{ getVehicleTypeLabel(useVehicle.vehicle.vehicle_type) }}</p> -->
                                                 <p class="info-value">{{ useVehicle.vehicle.vehicle_type_name }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:tag-outline" size="18" /></span>
                                            <div>
                                                <p class="info-label">Hãng xe</p>
                                                <p class="info-value">{{ useVehicle.vehicle.vehicle_company }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:car-sports" size="18" /></span>
                                            <div>
                                                <p class="info-label">Dòng xe</p>
                                                <p class="info-value">{{ useVehicle.vehicle.vehicle_model }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:car-sports" size="18" /></span>
                                            <div>
                                                <p class="info-label">Màu xe</p>
                                                <p class="info-value">{{ useVehicle.vehicle.vehicle_color }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:calendar-check" size="18" /></span>
                                            <div>
                                                <p class="info-label">Ngày đăng ký</p>
                                                <p class="info-value">{{ useVehicle.vehicle.created_at }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <h4 class="section-title">
                                        <Icon name="ic:baseline-people" size="20" /> Cư dân sở hữu
                                    </h4>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:account" size="18" /></span>
                                            <div>
                                                <p class="info-label">Chủ sở hữu</p>
                                                <p class="info-value">{{ useVehicle.vehicle.resident_full_name ?? '---' }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="ion:home" size="18" /></span>
                                            <div>
                                                <p class="info-label">Số căn hộ</p>
                                                <p class="info-value">{{ useVehicle.vehicle.apartment_number ?? '---' }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:email-outline" size="18" /></span>
                                            <div>
                                                <p class="info-label">Email</p>
                                                <p class="info-value">{{ useVehicle.vehicle.resident_email ?? '---' }}</p>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <span class="info-icon"><Icon name="mdi:phone-outline" size="18" /></span>
                                            <div>
                                                <p class="info-label">Số điện thoại</p>
                                                <p class="info-value">{{ useVehicle.vehicle.resident_phone ?? '---' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <h4 class="section-title">
                                        <Icon name="mdi:note-text-outline" size="20" /> Ghi chú
                                    </h4>
                                    <div class="note-box">
                                        <p style="margin: unset;">{{ useVehicle.vehicle.notes ?? 'Không có ghi chú' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab thông tin khác -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-header bg-white p-0">
                        <ul class="nav nav-tabs" id="vehicleTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="entry-tab" data-bs-toggle="tab" data-bs-target="#entry"
                                    type="button" role="tab">
                                    Lịch sử ra vào
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="fee-tab" data-bs-toggle="tab" data-bs-target="#fee"
                                    type="button" role="tab">
                                    Phí gửi xe
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="vehicleTabContent">
                            <div class="tab-pane fade show active" id="entry" role="tabpanel">
                                <p class="text-muted">Hiển thị lịch sử ra vào phương tiện</p>
                                <!-- Nội dung lịch sử -->
                            </div>
                            <div class="tab-pane fade" id="fee" role="tabpanel">
                                <p class="text-muted">Hiển thị thông tin phí gửi xe</p>
                                <!-- Nội dung phí gửi xe -->
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
import defaultVehicle from '@/assets/images/vehicle-default.png'
import { useVehicleStore } from '@/stores/vehicle'
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useVehicle = useVehicleStore()
const route = useRoute()
const router = useRouter()
const isLoading = computed(() => useVehicle.isLoading);
const hasError = computed(() => useVehicle.hasError);

const vehicle_id = route.params.id

const goBack = () => {
    router.back()
}

const loadVehicle = async () => {
    await useVehicle.fechVehicle(vehicle_id)
    console.log('Vehicle data:', useVehicle.vehicle)
}

onMounted(loadVehicle)
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
  grid-template-columns: repeat(3, 1fr);
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