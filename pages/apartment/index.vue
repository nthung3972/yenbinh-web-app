<template>
    <div class="card shadow-sm p-4 m-4">

        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError">{{ hasError }}</div>
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-3 p-bottom">
                <h5 class="fw-bold">Danh sách căn hộ</h5>
                <div class="input-group w-50">
                    <span class="input-group-text">
                        <Icon name="material-symbols:search" />
                    </span>
                    <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
                        placeholder="Điền mã căn hộ..." />
                    <button class="btn btn-primary" @click="onSearch">Tìm</button>
                </div>
                <NuxtLink to="/apartment/create" class="btn btn-primary d-flex align-items-center">
                    <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Thêm căn hộ
                </NuxtLink>
            </div>
            <table class="table table-striped table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-light">
                    <tr>
                        <th style="width: 10%;">Số căn hộ</th>
                        <th style="width: 10%;">Số tầng</th>
                        <th style="width: 10%;">Loại căn hộ</th>
                        <th style="width: 12%;">Diện tích (m²)</th>
                        <th style="width: 15%;">Chủ căn hộ</th>
                        <th style="width: 10%;">Tình trạng</th>
                        <th style="width: 20%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(apartment, index) in apartmentStore.apartmentList" :key="index">
                        <td>{{ apartment.apartment_number }}</td>
                        <td>{{ apartment.floor_number }}</td>
                        <td>{{ apartment.ownership_type }}</td>
                        <td>{{ apartment.area }}</td>
                        <td>{{ apartment.residents[0]?.full_name ?? '' }}</td>
                        <td>
                            <span :class="apartment.residents[0]?.full_name ? 'badge bg-info' : 'badge bg-danger'">
                                {{ apartment.residents[0]?.full_name ? 'Đang sử dụng' : 'Căn hộ trống' }}
                            </span>
                        </td>
                        <td class="d-flex justify-content-center">
                            <NuxtLink to="/" class="btn btn-sm btn-success text-white d-flex align-items-center"
                                style="min-width: 100px;">
                                <Icon name="bxs:detail" size="20" class="me-1" /> Chi tiết
                            </NuxtLink>
                            <NuxtLink :to="`/apartment/${apartment.apartment_id}/edit`" class="btn btn-sm btn-warning text-white d-flex align-items-center">
                                <Icon name="basil:edit-solid" size="20" class="me-1" /> Chỉnh sửa
                            </NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
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

const currentPage = ref(1);
const searchKeyword = ref('');

const isLoading = computed(() => apartmentStore.isLoading);
const hasError = computed(() => apartmentStore.hasError);

const loadApartments = () => {
    apartmentStore.fetchApartmentListByBuilding(currentPage.value, '', searchKeyword.value);
}

const handlePageChange = (page) => {
    currentPage.value = page;
    loadApartments();
};


const onSearch = () => {
    currentPage.value = 1;
    loadApartments();
};

onMounted(loadApartments);
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    gap: 5px;
}

.p-bottom {
    padding: 0 0 20px 0;
}
</style>
