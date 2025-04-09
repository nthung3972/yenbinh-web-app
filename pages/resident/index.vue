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
                <h5 class="fw-bold">Danh sách cư dân</h5>
                <div class="input-group w-50">
                    <span class="input-group-text">
                        <Icon name="material-symbols:search" />
                    </span>
                    <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
                        placeholder="Điền mã căn hộ..." />
                    <button class="btn btn-primary" @click="onSearch">Tìm</button>
                </div>
                <NuxtLink to="/resident/create" class="btn btn-primary d-flex align-items-center">
                    <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Thêm cư dân
                </NuxtLink>
            </div>
            <table class="table table-hover" style="table-layout: fixed; width: 100%;">
                <thead class="table-light">
                    <tr>
                        <th style="width: 15%;">Họ và tên</th>
                        <th style="width: 15%;">Số CCCD</th>
                        <th style="width: 15%;">Năm sinh</th>
                        <th style="width: 15%;">Số điện thoại</th>
                        <th style="width: 15%;">Email</th>
                        <th style="width: 15%;">Cập nhật</th>
                        <th style="width: 25%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(resident, index) in useResident.residentList" :key="index">
                        <td class="align-middle">{{ resident.full_name }}</td>
                        <td class="align-middle">{{ resident.id_card_number }}</td>
                        <td class="align-middle">{{ resident.date_of_birth }}</td>
                        <td class="align-middle">{{ resident.phone_number }}</td>
                        <td class="align-middle">{{ resident.email }}</td>
                        <td class="align-middle">{{ resident.updated_by?.name ? resident.updated_by?.name : '' }}</td>
                        <td class="align-middle text-center">
                            <div class="d-inline-flex gap-2">
                                <NuxtLink to="/" class="btn btn-sm btn-success text-white d-flex align-items-center">
                                    <Icon name="bxs:detail" size="20" class="me-1" />Xem
                                </NuxtLink>
                                <NuxtLink :to="`/resident/${resident.resident_id}/edit`"
                                    class="btn btn-sm btn-warning text-white d-flex align-items-center">
                                    <Icon name="basil:edit-solid" size="20" class="me-1" /> Sửa
                                </NuxtLink>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="useResident.pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useResidentStore } from '@/stores/resident'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useResident = useResidentStore();
const currentPage = ref(1);
const searchKeyword = ref('');

const isLoading = computed(() => useResident.isLoading);
const hasError = computed(() => useResident.hasError);

const loadResidents = () => {
    useResident.fetchResidentList(currentPage.value, '', searchKeyword.value)
}


const handlePageChange = (page) => {
    currentPage.value = page;
    loadResidents();
};


const onSearch = () => {
    currentPage.value = 1;
    loadResidents();
};

onMounted(loadResidents);
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
