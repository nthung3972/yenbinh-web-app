<template>
    <div>
        <h1>Quản lý Hóa Đơn</h1>
        <p>Danh sách hóa đơn</p>
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

const loadInvoices = () => {
    useInvoice.fetchtInvoiceList(currentPage.value, '', searchKeyword.value)
    console.log(useInvoice.invoiceList)
}

onMounted(loadInvoices)
</script>
