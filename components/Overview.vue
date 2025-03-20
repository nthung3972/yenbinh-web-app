<template>
    <div>
        <h2 class="fw-bold">Dashboard</h2>
        <DashboardStats />
        <DashboardChart />
    </div>
</template>

<script setup>
import DashboardStats from '~/components/DashboardStats.vue';
import DashboardChart from '~/components/DashboardChart.vue';
</script>