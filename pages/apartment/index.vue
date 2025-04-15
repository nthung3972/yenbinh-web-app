<template>
    <div class="card shadow-lg p-4 m-4 border-0">
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p class="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="hasError" class="alert alert-danger text-center">{{ hasError }}</div>

        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h5 class="fw-bold text-primary mb-0">
                    <Icon name="ion:home" size="24" /> Danh sách căn hộ
                </h5>

                <div class="d-flex align-items-center gap-3">
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Nhập mã căn hộ..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink to="/apartment/create"
                        class="btn btn-primary d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm căn hộ
                    </NuxtLink>
                </div>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-4 border shadow-sm">
                <div class="card-body">
                    <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
                        <!-- Loại căn hộ -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Loại căn hộ</label>
                            <select v-model="filters.apartment_type" @change="onFilter" class="form-select">
                                <option value="">Tất cả</option>
                                <option :value="0">Chưa thanh toán</option>
                                <option :value="1">Đã thanh toán</option>
                                <option :value="2">Đã quá hạn</option>
                            </select>
                        </div>

                        <!-- Trạng thái -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Tình trạng</label>
                            <select v-model="filters.status" @change="onFilter" class="form-select">
                                <option value="">Tất cả</option>
                                <option :value="0">Chưa thanh toán</option>
                                <option :value="1">Đã thanh toán</option>
                                <option :value="2">Đã quá hạn</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="table-responsive">
                <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                    <thead class="table-light sticky-top" style="z-index: 1;">
                        <tr>
                            <th style="width: 10%;">Mã căn hộ</th>
                            <th style="width: 15%;">Loại căn hộ</th>
                            <th style="width: 20%;">Chủ sở hữu</th>
                            <th style="width: 20%;">Tình trạng</th>
                            <th style="width: 15%;">Cập nhật bởi</th>
                            <th style="width: 20%; text-align: center;">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(apartment, index) in apartmentStore.apartmentList" :key="index">
                            <td>{{ apartment.apartment_number }}</td>
                            <td>{{ apartment.ownership_type }}</td>
                            <td>{{ apartment.residents[0]?.full_name ?? '---' }}</td>
                            <td>
                                <span :class="[
                                    'badge rounded-pill px-3 py-2',
                                    apartment.residents[0]?.full_name ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'
                                ]">
                                    {{ apartment.residents[0]?.full_name ? 'Đang sử dụng' : 'Căn hộ trống' }}
                                </span>
                            </td>
                            <td>{{ apartment.updated_by?.name ?? '---' }}</td>
                            <td class="text-center">
                                <div class="btn-group gap-2">
                                    <NuxtLink :to="`/apartment/detail/${apartment.apartment_id}`" class="btn btn-sm btn-outline-success d-flex align-items-center">
                                        <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                                    </NuxtLink>
                                    <NuxtLink :to="`/apartment/${apartment.apartment_id}/edit`"
                                        class="btn btn-sm btn-outline-warning d-flex align-items-center">
                                        <Icon name="basil:edit-solid" size="16" class="me-1" /> Sửa
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <Pagination :pagination="apartmentStore.pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useApartmentStore } from '@/stores/apartment'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const apartmentStore = useApartmentStore();

const filters = ref({
    apartment_type: '',
    status: '',
    key_search: '',
    page: 1,
    per_page: 10,
})

const isLoading = computed(() => apartmentStore.isLoading);
const hasError = computed(() => apartmentStore.hasError);

const handlePageChange = (page) => {
    filters.value.page = 1
    loadApartments();
};

const onSearch = () => {
    filters.value.page = 1
    loadApartments();
};

const onFilter = () => {
    filters.value.page = 1
    loadApartments()
}

const loadApartments = () => {
    const params = { ...filters.value }
    apartmentStore.fetchApartmentListByBuilding(
        params.page,
        params.per_page,
        params.key_search,
        params.status,
        params.apartment_type
    )
}

onMounted(loadApartments);
</script>
