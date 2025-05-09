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
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <!-- <h5 class="fw-bold text-primary mb-0">Danh Sách Căn Hộ</h5> -->
                <h5 class="fw-bold text-primary mb-0">
                    <Icon name="ic:baseline-people" size="24" /> Danh sách cư dân
                </h5>

                <div class="d-flex align-items-center gap-3">
                    <!-- Ô tìm kiếm -->
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Nhập tên cư dân..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink to="/resident/create"
                        class="btn btn-primary d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm cư dân
                    </NuxtLink>
                </div>
            </div>
            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-light sticky-top" style="z-index: 1;">
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 15%;">Họ và tên</th>
                        <th style="width: 15%;">Số CCCD</th>
                        <th style="width: 12%;">Điện thoại</th>
                        <th style="width: 20%;">Email</th>
                        <th style="width: 15%;">Cập nhật bởi</th>
                        <th style="width: 23%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(resident, index) in useResident.residentList" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ resident.full_name }}</td>
                        <td>{{ resident.id_card_number ?? '---' }}</td>
                        <td>{{ resident.phone_number ?? '---' }}</td>
                        <td>{{ resident.email ?? '---' }}</td>
                        <td>{{ resident.updated_by?.name ?? '---' }}</td>

                        <td class="text-center">
                            <ActionDropdown buttonText="Thao tác" iconName="bx:chevron-down">
                                <template #default="{ closeDropdown }">
                                    <DropdownItem tag="NuxtLink" :to="`/resident/detail/${resident.resident_id}`"
                                        iconName="bxs:detail">
                                        Xem
                                    </DropdownItem>

                                    <DropdownItem tag="NuxtLink" :to="`/resident/${resident.resident_id}/edit`"
                                        iconName="bxs:edit-alt">
                                        Sửa
                                    </DropdownItem>
                                </template>
                            </ActionDropdown>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="useResident.pagination" @page-change="handlePageChange" @rows-per-page-change="rowsPerPageChange"/>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useResidentStore } from '@/stores/resident'
import Pagination from '@/components/pagination/Pagination.vue'
import ActionDropdown from '@/components/dropdown/actionDropdown.vue'
import DropdownItem from '@/components/dropdown/dropdownItem.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useResident = useResidentStore();
const currentPage = ref(1);
const perPage = ref(10);
const searchKeyword = ref('');

const isLoading = computed(() => useResident.isLoading);
const hasError = computed(() => useResident.hasError);

const loadResidents = () => {
    useResident.fetchResidentList(currentPage.value, perPage.value, searchKeyword.value)
}

const handlePageChange = (page) => {
    currentPage.value = page;
    loadResidents();
};

const rowsPerPageChange = (per_page) => {
    perPage.value = per_page
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
