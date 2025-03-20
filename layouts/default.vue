<template>
    <div class="d-flex bg-light">
        <Sidebar />
        <div class="content flex-grow-1">
            <Header />
            <main class="container mt-4">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
</script>

<style>
.content {
    width: calc(100% - 250px);
}
</style>
