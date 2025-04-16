<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="hasError">{{ hasError }}</div>
    <div v-else class="container py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-primary">
                <Icon name="mdi:receipt-text" size="24" class="me-2" />
                Thông tin xe
            </h3>
            <button class="btn btn-outline-secondary" @click="goBack">
                <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                Quay lại
            </button>
        </div>

        <!-- Vehicle Card -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-light d-flex justify-content-between align-items-center py-3">
                <h2 class="h5 mb-0">{{ useVehicle.vehicle.vehicle_company }} | {{ useVehicle.vehicle.vehicle_model }} |
                    {{ useVehicle.vehicle.license_plate }}</h2>
                <span v-if="useVehicle.vehicle.status === 0" class="badge bg-success">Đang hoạt động</span>
                <span v-else class="badge bg-secondary">Ngừng hoạt động</span>
            </div>

            <div class="card-body">
                <!-- Vehicle Image -->
                <div class="text-center mb-4">
                    <img :src="defaultVehicle" alt="Hình ảnh xe" class="img-fluid rounded" style="max-height: 200px;">
                </div>

                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info"
                            type="button" role="tab" aria-controls="info" aria-selected="true">
                            Thông tin cơ bản
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history"
                            type="button" role="tab" aria-controls="history" aria-selected="false">
                            Lịch sử ra vào
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="payment-tab" data-bs-toggle="tab" data-bs-target="#payment"
                            type="button" role="tab" aria-controls="payment" aria-selected="false">
                            Phí gửi xe
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Basic Information Tab -->
                    <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Biển số xe:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.license_plate }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Chủ xe:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.full_name }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Căn hộ:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.apartment_number }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Hãng xe:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.vehicle_company }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Mẫu xe:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.vehicle_model }}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Màu sắc:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.vehicle_color }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Vị trí đậu xe:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.parking_slot ?? '----' }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Ngày đăng ký:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.created_at }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Ngày hủy đăng ký:</div>
                                    <div class="col-7">{{ useVehicle.vehicle.inactive_date ?? '----' }}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-5 fw-bold text-secondary">Trạng thái:</div>
                                    <div class="col-7">
                                        <span v-if="useVehicle.vehicle.status === 0" class="badge bg-success">Đang hoạt
                                            động</span>
                                        <span v-else class="badge bg-secondary">Ngừng hoạt động</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- History Tab -->
                    <div class="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
                        <div class="list-group">
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1">Ra khỏi bãi đậu xe</h6>
                                        <p class="mb-0 text-secondary small">Xác nhận bởi: Hệ thống tự động</p>
                                    </div>
                                    <span class="badge bg-light text-dark">16/04/2025 - 08:15</span>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1">Vào bãi đậu xe</h6>
                                        <p class="mb-0 text-secondary small">Xác nhận bởi: Hệ thống tự động</p>
                                    </div>
                                    <span class="badge bg-light text-dark">15/04/2025 - 19:30</span>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1">Ra khỏi bãi đậu xe</h6>
                                        <p class="mb-0 text-secondary small">Xác nhận bởi: Hệ thống tự động</p>
                                    </div>
                                    <span class="badge bg-light text-dark">15/04/2025 - 08:20</span>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1">Vào bãi đậu xe</h6>
                                        <p class="mb-0 text-secondary small">Xác nhận bởi: Hệ thống tự động</p>
                                    </div>
                                    <span class="badge bg-light text-dark">14/04/2025 - 18:45</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Tab -->
                    <div class="tab-pane fade" id="payment" role="tabpanel" aria-labelledby="payment-tab">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-md-4 fw-bold text-secondary">Gói đăng ký:</div>
                                    <div class="col-md-8">Gói thường trú (12 tháng)</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4 fw-bold text-secondary">Ngày bắt đầu:</div>
                                    <div class="col-md-8">01/01/2025</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4 fw-bold text-secondary">Ngày kết thúc:</div>
                                    <div class="col-md-8">31/12/2025</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4 fw-bold text-secondary">Phí hàng tháng:</div>
                                    <div class="col-md-8">1,200,000 VNĐ</div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4 fw-bold text-secondary">Trạng thái thanh toán:</div>
                                    <div class="col-md-8">
                                        <span class="badge bg-success">Đã thanh toán (Tháng 4/2025)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header bg-light">
                                <h5 class="card-title mb-0">Lịch sử thanh toán</h5>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Ngày thanh toán</th>
                                            <th>Kỳ thanh toán</th>
                                            <th>Số tiền</th>
                                            <th>Phương thức</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>01/04/2025</td>
                                            <td>Tháng 4/2025</td>
                                            <td>1,200,000 VNĐ</td>
                                            <td>Chuyển khoản</td>
                                            <td><span class="badge bg-success">Thành công</span></td>
                                        </tr>
                                        <tr>
                                            <td>01/03/2025</td>
                                            <td>Tháng 3/2025</td>
                                            <td>1,200,000 VNĐ</td>
                                            <td>Chuyển khoản</td>
                                            <td><span class="badge bg-success">Thành công</span></td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2025</td>
                                            <td>Tháng 2/2025</td>
                                            <td>1,200,000 VNĐ</td>
                                            <td>Chuyển khoản</td>
                                            <td><span class="badge bg-success">Thành công</span></td>
                                        </tr>
                                        <tr>
                                            <td>01/01/2025</td>
                                            <td>Tháng 1/2025</td>
                                            <td>1,200,000 VNĐ</td>
                                            <td>Chuyển khoản</td>
                                            <td><span class="badge bg-success">Thành công</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="card-footer bg-white d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary">
                    <i class="bi bi-printer me-1"></i> In thông tin
                </button>
                <button type="button" class="btn btn-outline-primary">
                    <i class="bi bi-pencil-square me-1"></i> Cập nhật
                </button>
                <button type="button" class="btn btn-primary">
                    <i class="bi bi-arrow-clockwise me-1"></i> Gia hạn đăng ký
                </button>
            </div> -->
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
}

onMounted(loadVehicle)
</script>

<style scoped>
.badge {
    font-size: 0.85rem;
}
</style>