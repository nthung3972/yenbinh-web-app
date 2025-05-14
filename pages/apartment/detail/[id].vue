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
                                Thông tin căn hộ
                            </h4>
                            <button class="btn btn-outline-secondary" @click="goBack()">
                                <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                                Quay lại
                            </button>
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <strong> Số căn hộ:</strong> {{ useApartment.apartment.apartment_number }}
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong>Trạng thái:</strong>
                                        <span :class="[
                                            'badge rounded-pill px-3 py-2 ms-2',
                                            useApartment.apartment.status === 'occupied'
                                            ? 'bg-success-subtle text-success'
                                            : 'bg-secondary-subtle text-muted'
                                        ]">
                                            {{ useApartment.apartment.status === 'occupied' ? 'Đang sử dụng' : 'Căn hộ trống' }}
                                        </span>   
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong> Tầng:</strong> {{ useApartment.apartment.floor_number }}
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong> Diện tích:</strong> {{ useApartment.apartment.area }} m²
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong> Loại căn hộ:</strong> {{ getApartmentTypeLabel(useApartment.apartment.apartment_type) }}
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong> Loại sở hữu:</strong> {{ getOwnershipTypeLabel(useApartment.apartment.ownership_type) }}
                                </div>
                                <div class="col-md-12 mb-3">
                                    <strong> Ghi chú:</strong> {{ useApartment.apartment.notes ?? 'Không có ghi chú' }}
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
                            <h5 class="fw-bold text-primary">
                                <Icon name="ep:list" size="20" class="me-1" />
                                Danh sách cư dân
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-primary sticky-top">
                                        <tr>
                                            <th>Họ tên</th>
                                            <!-- <th>CMND/CCCD</th> -->
                                            <th>Email</th>
                                            <th>SĐT</th>
                                            <th>Vai trò</th>
                                            <th>Ngày đăng ký</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày chuyển đi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="resident in useApartment.apartment.residents" :key="resident.id">
                                            <td>{{ resident.full_name }}</td>
                                            <!-- <td>{{ resident.id_card_number }}</td> -->
                                            <td>{{ resident.email ?? '———'}}</td>
                                            <td>{{ resident.phone_number ?? '———'}}</td>
                                            <td>
                                                <span :class="{
                                                    'badge bg-primary': resident.pivot.role_in_apartment === 0,
                                                    'badge bg-warning': resident.pivot.role_in_apartment === 1,
                                                    'badge bg-info': resident.pivot.role_in_apartment === 2,
                                                    'badge bg-success': resident.pivot.role_in_apartment === 3,
                                                }">
                                                    {{
                                                        resident.pivot.role_in_apartment === 0
                                                            ? 'Chủ căn hộ'
                                                            : resident.pivot.role_in_apartment === 1
                                                                ? 'Người thuê chính'
                                                                : resident.pivot.role_in_apartment === 2
                                                                    ? 'Người thân'
                                                                    : resident.pivot.role_in_apartment === 3
                                                                        ? 'Người thuê'
                                                                        : '———'
                                                    }}
                                                </span>
                                            </td>
                                            <td>{{ formatDate(resident.pivot?.registration_date) }}</td>
                                            <td>
                                                <span class="badge" :class="{
                                                    'bg-primary': resident.pivot?.registration_status === 0,
                                                    'bg-secondary': resident.pivot?.registration_status === 1
                                                }">
                                                    {{
                                                        resident.pivot?.registration_status === 0
                                                            ? 'Đang cư trú'
                                                            : resident.pivot?.registration_status === 1
                                                                ? 'Đã rời đi'
                                                                : '———'
                                                    }}
                                                </span>
                                            </td>
                                            <td>
                                                {{ resident.pivot.move_out_date ?
                                                    formatDate(resident.pivot.move_out_date) :
                                                    '———'
                                                }}
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
                                    <p class="text-muted">Hiển thị lịch sử thanh toán của căn hộ</p>
                                    <!-- Nội dung lịch sử thanh toán -->
                                </div>
                                <div class="tab-pane fade" id="complaints" role="tabpanel">
                                    <p class="text-muted">Hiển thị phản ánh và khiếu nại của căn hộ</p>
                                    <!-- Nội dung phản ánh và khiếu nại -->
                                </div>
                                <div class="tab-pane fade" id="activity" role="tabpanel">
                                    <p class="text-muted">Hiển thị hoạt động gần đây của căn hộ</p>
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
import { useApartmentStore } from '@/stores/apartment'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useApartment = useApartmentStore()
const route = useRoute();
const router = useRouter();
const apartmentId = route.params.id;
const isLoading = computed(() => useApartment.isLoading);
const hasError = computed(() => useApartment.hasError);

const formatDate = (date) => {
    if (!date) return 'Chưa cập nhật'
    return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const getApartmentTypeLabel = (type) => {
    const labels = {
        'studio': 'Phòng thu',
        '1bedroom': '1 Phòng ngủ',
        '2bedroom': '2 Phòng ngủ',
        '3bedroom': '3 Phòng ngủ',
        'dualkey': 'Căn hộ song lập',
        'penthouse': 'Căn hộ áp mái',
        'duplex': 'Căn hộ thông tầng',
    }

    return labels[type] || 'Không xác định'
}

const getOwnershipTypeLabel = (type) => {
    const labels = {
        'own': 'Sở hữu',
        'lease': 'Cho thuê',
        'lease_back': 'Cho thuê lại',
        'mortgage': 'Thế chấp',
        'shared_ownership': 'Sở hữu chung',
    }

    return labels[type] || 'Không xác định'
}


const goBack = () => {
    router.back()
}

const loadApartmentInfo = async () => {
    await useApartment.detailApartment(apartmentId)
}

onMounted(() => {
    loadApartmentInfo()
})
</script>