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
                <h5 class="fw-bold">Danh sách nhân viên</h5>
                <div class="input-group w-50">
                    <span class="input-group-text">
                        <Icon name="material-symbols:search" />
                    </span>
                    <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
                        placeholder="Điền tên tòa nhà..." />
                    <button class="btn btn-primary" @click="onSearch">Tìm</button>
                </div>
                <NuxtLink to="/staff/create" class="btn btn-primary d-flex align-items-center">
                    <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Thêm nhân viên
                </NuxtLink>
            </div>
            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-light">
                    <tr>
                        <th style="width: 15%;">Tên nhân viên</th>
                        <th style="width: 20%;">Email</th>
                        <th style="width: 10%;">Vai trò</th>
                        <th style="width: 20%;">Tòa nhà quản lý</th>
                        <th style="width: 10%;">Chức vụ</th>
                        <th style="width: 25%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(staff, index) in staffStore.staffList" :key="index">
                        <td>{{ staff.name }}</td>
                        <td>{{ staff.email }}</td>
                        <td>{{ staff.role }}</td>
                        <td>{{ staff.building_name }}</td>
                        <td>{{ staff.building_role }}</td>
                        <td class="d-flex justify-content-center align-items-center gap-2">
                            <NuxtLink to="/"
                                class="btn btn-sm btn-success d-flex align-items-center text-white text-decoration-none">
                                <Icon name="bxs:detail" size="18" class="me-1" />
                                <span>Xem</span>
                            </NuxtLink>
                            <button type="button" class="btn btn-sm btn-danger d-flex align-items-center"
                                data-bs-toggle="modal" data-bs-target="#deleteApartmentModal"
                                @click="setSelectedApartment(staff.id)">
                                <Icon name="material-symbols:delete" size="18" class="me-1" />
                                <span>Xóa</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="staffStore.pagination" @page-change="handlePageChange" />
        </div>
    </div>


    <!-- Modal Xóa Căn Hộ -->
    <div class="modal fade" id="deleteApartmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="deleteStaff" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title">Xác Nhận Xóa Nhân Viên</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Bạn có chắc chắn muốn xóa nhân viên này không?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-danger">Xóa</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff'
import Pagination from '@/components/pagination/Pagination.vue'
import { useToast } from 'vue-toastification'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const staffStore = useStaffStore()
const currentPage = ref(1)
const searchKeyword = ref('')
const staff_id = ref('')
const toast = useToast()

const isLoading = computed(() => staffStore.isLoading);
const hasError = computed(() => staffStore.hasError);

const setSelectedApartment = (id) => {
    staff_id.value = parseInt(id);
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fectStaffList();
};

const onSearch = () => {
    currentPage.value = 1;
    fectStaffList();
};

const fectStaffList = () => {
    staffStore.fetchStaffList(currentPage.value, '', searchKeyword.value)
}

const deleteStaff = async () => {
    try {
        await staffStore.deleteStaff(staff_id.value)
        document.getElementById('deleteApartmentModal').querySelector('[data-bs-dismiss="modal"]').click()
        toast.success('Xóa nhân viên thành công!')
        fectStaffList();
    } catch (error) {
        toast.error('Đã xảy ra lỗi khi xóa nhân viên!')
    }
}

onMounted(fectStaffList)
</script>
