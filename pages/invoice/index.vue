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
                🏢 Danh sách hóa đơn
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
        placeholder="Nhập tên căn hộ..."
      />
      <button class="btn btn-outline-primary" @click="onSearch">
        Tìm
      </button>
    </div>
    <NuxtLink
      to="/invoice/create"
      class="btn btn-primary d-flex align-items-center justify-content-center"
      style="white-space: nowrap;"
    >
      <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
      Tạo hóa đơn
    </NuxtLink>
            </div>
        </div>
            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
        <thead class="table-light sticky-top" style="z-index: 1;">
            <tr>
                <th style="width: 10%;">Mã căn hộ</th>
                <th style="width: 10%;">Thành tiền</th>
                <th style="width: 14%;">Ngày ban hành</th>
                <th style="width: 14%;">Ngày quá hạn</th>
                <th style="width: 13%;">Trạng thái</th>
                <th style="width: 13%;">Cập nhật bởi</th>
                <th style="width: 21%; text-align: center;">Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(invoice, index) in useInvoice.invoiceList" :key="index">
                <td>{{ invoice.apartment.apartment_number }}</td>
                <td>{{ formatVND(invoice.total_amount) }}</td>
                <td>{{ invoice.invoice_date }}</td>
                <td>{{ invoice.due_date }}</td>
                <td>
                    <span 
                        :class="[
                            'badge', 
                            invoice.status === 0 ? 'bg-info' 
                            : invoice.status === 1 ? 'bg-success' 
                            : 'bg-danger'
                        ]"
                    >
                        {{ invoice.status === 0 ? 'Chưa thanh toán' 
                            : invoice.status === 1 ? 'Đã thanh toán' 
                            : 'Quá hạn' }}
                    </span>
                </td>
                <td>{{ invoice.updated_by?.name ?? '----' }}</td>
                <td class="text-center">
                    <div class="btn-group gap-2">
                        <NuxtLink 
                            to="/" 
                            class="btn btn-sm btn-outline-success d-flex align-items-center px-3 py-2"
                        >
                            <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                        </NuxtLink>
                        <NuxtLink 
                            :to="`/invoice/edit/${invoice.invoice_id}`" 
                            class="btn btn-sm btn-outline-warning d-flex align-items-center px-3 py-2"
                        >
                            <Icon name="basil:edit-solid" size="16" class="me-1" /> Sửa
                        </NuxtLink>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
            <Pagination :pagination="useInvoice.pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useInvoiceStore } from '@/stores/invoice'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useInvoice = useInvoiceStore()
const currentPage = ref(1)
const searchKeyword = ref('')
const { formatVND } = useCurrencyFormat()

const isLoading = computed(() => useInvoice.isLoading);
const hasError = computed(() => useInvoice.hasError);

const handlePageChange = (page) => {
    currentPage.value = page;
    loadApartments();
};

const onSearch = () => {
    currentPage.value = 1;
    loadInvoices();
};

const loadInvoices = () => {
    useInvoice.fetchtInvoiceList(currentPage.value, '', searchKeyword.value)
}

onMounted(loadInvoices)
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
