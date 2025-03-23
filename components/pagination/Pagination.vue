<template>
    <div class="flex justify-center mt-4 space-x-2 d-flex" v-if="pagination">
        <button :disabled="pagination.current_page === 1" @click="$emit('page-change', pagination.current_page - 1)"
            class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
            Trước
        </button>
        <span>Trang {{ pagination.current_page }} / {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page === pagination.last_page"
            @click="$emit('page-change', pagination.current_page + 1)"
            class="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
            Sau
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    pagination: Object,
});
const emit = defineEmits(['page-change']);
</script>

<style scoped>
.d-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
</style>
