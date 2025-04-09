<template>
   <div class="card shadow-lg p-4 m-4 border-0">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p class="text-muted mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="alert alert-danger text-center">{{ hasError }}</div>

    <!-- Main Content -->
    <div v-else>
        <!-- Header Section -->
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <!-- <h5 class="fw-bold text-primary mb-0">Danh Sách Căn Hộ</h5> -->
            <h5 class="fw-bold text-primary mb-0">
                🏢 Danh sách căn hộ
            </h5>

            <div class="d-flex align-items-center gap-3">
                <!-- Ô tìm kiếm -->
    <div class="input-group">
      <span class="input-group-text bg-white">
        <Icon name="material-symbols:search" />
      </span>
      <input
        v-model="searchKeyword"
        @keyup.enter="onSearch"
        type="text"
        class="form-control"
        placeholder="Nhập mã căn hộ..."
      />
      <button class="btn btn-outline-primary" @click="onSearch">
        Tìm
      </button>
    </div>
    <NuxtLink
      to="/apartment/create"
      class="btn btn-primary d-flex align-items-center justify-content-center"
      style="white-space: nowrap;"
    >
      <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
      Thêm căn hộ
    </NuxtLink>
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
                                <NuxtLink 
                                    to="/" 
                                    class="btn btn-sm btn-outline-success d-flex align-items-center"
                                >
                                    <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                                </NuxtLink>
                                <NuxtLink 
                                    :to="`/apartment/${apartment.apartment_id}/edit`" 
                                    class="btn btn-sm btn-outline-warning d-flex align-items-center"
                                >
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
