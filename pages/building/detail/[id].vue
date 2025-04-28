<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="hasError">
        {{ hasError }}
    </div>

    <div v-else>
        <div class="container-fluid">

            <!-- Thông tin tòa nhà -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-header bg-white d-flex justify-content-between align-items-center">
                            <h4 class="fw-bold text-primary">
                                <Icon name="mdi:office-building" size="24" class="me-2" />
                                Thông tin tòa nhà
                            </h4>
                            <button class="btn btn-outline-secondary" @click="goBack()">
                                <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                                Quay lại
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <!-- Avatar/logo tòa nhà -->
                                <div
                                    class="col-md-4 d-flex flex-column align-items-center justify-content-center border-end">
                                    <img :src="building.image || defaultBuildingLogo" alt="Logo tòa nhà"
                                        class="rounded-circle img-fluid mb-3"
                                        style="width: 200px; height: 200px; object-fit: cover; border: 1px solid #dee2e6;">
                                    <h5 class="mb-1">{{ building.name }}</h5>
                                    <p class="text-muted small mb-0">Mã tòa nhà: {{ building.building_id }}</p>
                                </div>

                                <!-- Thông tin chi tiết -->
                                <div class="col-md-8">
                                    <div class="col-md-9">
                                        <div class="row g-3">
                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Địa
                                                        chỉ</small>
                                                    <div>{{ building.address ?? '---' }}</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Loại căn
                                                        hộ</small>
                                                    <div>{{ getBuildingType(building.building_type) }}</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Số
                                                        tầng</small>
                                                    <div>{{ building.floors }}</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Diện
                                                        tích</small>
                                                    <div>{{ building.total_area }}(m²)</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Tổng số căn
                                                        hộ</small>
                                                    <div>{{ building.apartments_count }} căn</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Tổng số cư
                                                        dân</small>
                                                    <div>{{ building.residents_count }} người</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Giá dịch
                                                        vụ</small>
                                                    <div>{{ formatVND(building.management_fee_per_m2) }}đ</div>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="border-bottom pb-2">
                                                    <small class="text-secondary text-uppercase fw-semibold">Thù lao Ban
                                                        quản trị</small>
                                                    <div>{{ formatVND(building.management_board_fee_per_m2) }}đ</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-4">
                                            <h6 class="text-secondary fw-bold text-uppercase mb-2">Mô tả</h6>
                                            <p class="text-muted">{{ building.description || 'Không có mô tả.' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs thông tin thêm -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-header bg-white p-0">
                        <ul class="nav nav-tabs" id="buildingTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="services-tab" data-bs-toggle="tab"
                                    data-bs-target="#services" type="button" role="tab">
                                    Dịch vụ
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="staffs-tab" data-bs-toggle="tab" data-bs-target="#staffs"
                                    type="button" role="tab">
                                    Nhân sự
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="events-tab" data-bs-toggle="tab" data-bs-target="#events"
                                    type="button" role="tab">
                                    Sự kiện
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="buildingTabContent">
                            <div class="tab-pane fade show active" id="services" role="tabpanel">
                                <p class="text-muted">Hiển thị danh sách dịch vụ của tòa nhà</p>
                                <!-- Nội dung dịch vụ -->
                            </div>
                            <div class="tab-pane fade" id="staffs" role="tabpanel">
                                <p class="text-muted">Hiển thị danh sách nhân sự</p>
                                <!-- Nội dung nhân sự -->
                            </div>
                            <div class="tab-pane fade" id="events" role="tabpanel">
                                <p class="text-muted">Hiển thị sự kiện</p>
                                <!-- Nội dung sự kiện -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBuildingStore } from '@/stores/building'
import defaultBuildingLogo from '@/assets/images/avatar-default.jpg'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const buildingId = route.params.id
const { formatVND } = useCurrencyFormat()

const buildingStore = useBuildingStore()
const isLoading = computed(() => buildingStore.isLoading)
const hasError = computed(() => buildingStore.hasError)
const building = computed(() => buildingStore.building)

const formatDate = (date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('vi-VN')
}

const getBuildingType = (type) => {
    if (type === 'residential') return 'Chung cư'
    if (type === 'commercial') return 'Văn phòng'
    if (type === 'mixed') return ''
}

const goBack = () => {
    router.back()
}

onMounted(() => {
    buildingStore.getBuilding(buildingId)
})
</script>