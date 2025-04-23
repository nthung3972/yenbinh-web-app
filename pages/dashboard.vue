<template>
    <div>
        <h2 class="fw-bold">Dashboard</h2>
        <div v-if="!statsData">
            <div class="text-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Đang tải dữ liệu...</span>
                </div>
                <p>Đang tải dữ liệu...</p>
            </div>
        </div>
        <div v-else>
            <DashboardStats :data="statsData" />
            <DashboardTable :data="statsData" />
        </div>
    </div>
</template>

<script setup>
import DashboardStats from '~/components/dashboard/DashboardStats.vue';
import DashboardTable from '~/components/dashboard/DashboardTable.vue';

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard',
});

defineProps({
    statsData: Object,
});
</script>
