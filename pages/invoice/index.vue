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
                <h5 class="fw-bold">Danh sách hóa đơn</h5>
                <div class="input-group w-50">
                    <span class="input-group-text">
                        <Icon name="material-symbols:search" />
                    </span>
                    <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
                        placeholder="Điền tên hóa đơn..." />
                    <button class="btn btn-primary" @click="onSearch">Tìm</button>
                </div>
                <NuxtLink to="/invoice/create" class="btn btn-primary d-flex align-items-center">
                    <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Tạo hóa đơn
                </NuxtLink>
            </div>
            <table class="table table-hover" style="table-layout: fixed; width: 100%;">
                <thead class="table-light">
                    <tr>
                        <th style="width: 15%;">Số căn hộ</th>
                        <th style="width: 15%;">Tổng tiền</th>
                        <th style="width: 15%;">Ngày phát hành</th>
                        <th style="width: 15%;">Hạn thanh toán</th>
                        <th style="width: 15%;">Trạng thái</th>
                        <th style="width: 15%;">Cập nhật</th>
                        <th style="width: 25%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(invoice, index) in useInvoice.invoiceList" :key="index">
                        <td class="align-middle">{{ invoice.apartment.apartment_number }}</td>
                        <td class="align-middle">{{ formatVND(invoice.total_amount) }}</td>
                        <td class="align-middle">{{ invoice.invoice_date }}</td>
                        <td class="align-middle">{{ invoice.due_date }}</td>
                        <td class="align-middle">
                            <span :class="invoice.status === 0 ? 'badge bg-info'
                                : invoice.status === 1 ? 'badge bg-warning'
                                    : 'badge bg-danger'">
                                {{ invoice.status === 0 ? 'Chưa thanh toán'
                                    : invoice.status === 1 ? 'Đã thanh toán'
                                        : 'Đã quá hạn' }}
                            </span>
                        </td>
                        <td class="align-middle">{{ invoice.updated_by?.name ? invoice.updated_by?.name : '' }}</td>
                        <td class="align-middle text-center">
                            <div class="d-inline-flex gap-2">
                                <NuxtLink to="/" class="btn btn-sm btn-success text-white d-flex align-items-center">
                                    <Icon name="bxs:detail" size="20" class="me-1" />Xem
                                </NuxtLink>
                                <NuxtLink :to="`/invoice/edit/${invoice.invoice_id}`"
                                    class="btn btn-sm btn-warning text-white d-flex align-items-center">
                                    <Icon name="basil:edit-solid" size="20" class="me-1" /> Sửa
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
