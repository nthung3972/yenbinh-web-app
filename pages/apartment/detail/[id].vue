<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="hasError">{{ hasError }}</div>
    <div v-else>
        <div class="container">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-4 d-flex align-items-center">
                <Icon name="ion:home" size="24" />
                Thông tin chi tiết căn hộ
            </h4>
            <button class="btn btn-outline-secondary" @click="goBack()">
                <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                Quay lại
            </button>
            </div>
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <strong>Số căn hộ:</strong> {{ useApartment.apartment.apartment_number }}
                        </div>
                        <div class="col-md-6 mb-3">
                            <strong>Diện tích:</strong> {{ useApartment.apartment.area }} m²
                        </div>
                        <div class="col-md-6 mb-3">
                            <strong>Tầng:</strong> {{ useApartment.apartment.floor_number }}
                        </div>
                        <div class="col-md-6 mb-3">
                            <strong>Loại căn hộ:</strong> {{ useApartment.apartment.ownership_type }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Danh sách cư dân -->
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title mb-3">
                        <Icon name="ic:baseline-people" size="24" /> Danh sách cư dân
                    </h5>
                    <div v-if="useApartment.apartment.residents.length > 0">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th>Họ tên</th>
                                        <th>CMND/CCCD</th>
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
                                        <td>{{ resident.id_card_number }}</td>
                                        <td>{{ resident.email }}</td>
                                        <td>{{ resident.phone_number }}</td>
                                        <td>
                                            <span :class="{
                                                'badge bg-success': resident.pivot.role_in_apartment === 0,
                                                'badge bg-info': resident.pivot.role_in_apartment === 1,
                                                'badge bg-warning text-dark': resident.pivot.role_in_apartment === 2
                                            }">
                                                {{
                                                    resident.pivot.role_in_apartment === 0
                                                        ? 'Chủ căn hộ'
                                                        : resident.pivot.role_in_apartment === 1
                                                            ? 'Người thuê'
                                                            : resident.pivot.role_in_apartment === 2
                                                                ? 'Người thân'
                                                                : '----'
                                                }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(resident.pivot?.registration_date) }}</td>
                                        <td>
                                            <span class="badge" :class="{
                                                'bg-success': resident.pivot?.registration_status === '0',
                                                'bg-secondary': resident.pivot?.registration_status === '1'
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
                                            {{ resident.pivot.move_out_date ? formatDate(resident.pivot.move_out_date) :
                                                '———'
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div v-else>
                        <p>Chưa có cư dân nào trong căn hộ này.</p>
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