<template>
    <div class="pagination-container" v-if="pagination">
        <div class="pagination-wrapper">
            <!-- Rows per page selector -->
            <div class="rows-per-page">
                <span class="rows-label">Hiển thị hàng:</span>
                <div class="select-wrapper">
                    <select v-model="rowsPerPage" @change="changeRowsPerPage" class="rows-select">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <div class="triangle"></div>
                </div>
            </div>

            <!-- Page information -->
            <div class="page-info">
                Từ {{ calculateStart() }} đến {{ calculateEnd() }} của {{ pagination.total }} hàng
            </div>

            <!-- Navigation buttons -->
            <div class="navigation-buttons">
                <button :disabled="pagination.current_page === 1"
                    @click="$emit('page-change', pagination.current_page - 1)" class="nav-button prev-button"
                    :class="{ 'disabled': pagination.current_page === 1 }">
                    <div class="arrow-left"></div>
                </button>

                <!-- Current page display -->
                <div class="current-page">{{ pagination.current_page }}</div>

                <button :disabled="pagination.current_page === pagination.last_page"
                    @click="$emit('page-change', pagination.current_page + 1)" class="nav-button next-button"
                    :class="{ 'disabled': pagination.current_page === pagination.last_page }">
                    <div class="arrow-right"></div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    pagination: Object,
});

const emit = defineEmits(['page-change', 'rows-per-page-change']);

const rowsPerPage = ref(props.pagination.per_page);

const calculateStart = () => {
    if (props.pagination.total === 0) return 0;
    return (props.pagination.current_page - 1) * props.pagination.per_page + 1;
};

const calculateEnd = () => {
    const end = props.pagination.current_page * props.pagination.per_page;
    return end > props.pagination.total ? props.pagination.total : end;
};

const changeRowsPerPage = () => {
    emit('rows-per-page-change', rowsPerPage.value);
};
</script>

<style scoped>
.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 1.5rem;
    font-family: Arial, sans-serif;
    font-size: 0.9rem;
}

.pagination-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.rows-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.rows-label {
    color: #666;
    font-size: 0.85rem;
}

.select-wrapper {
    position: relative;
    min-width: 45px;
    border-bottom: 1px solid #000;
}

.rows-select {
    appearance: none;
    width: 100%;
    padding: 0.25rem 0.25rem 0rem 0.5rem;
    font-size: 0.85rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
}

.select-arrow {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 0.6rem;
    color: #666;
}

.triangle {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 0.3rem solid transparent;
    border-right: 0.3rem solid transparent;
    border-top: 0.4rem solid #000;
}

.page-info {
    color: #666;
    min-width: 80px;
}

.navigation-buttons {
    display: flex;
    align-items: center;
}

.navigation-buttons {
    display: flex;
    align-items: center;
    gap: 5px;
}

.nav-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.arrow-left {
    width: 12px;
    height: 12px;
    border-left: 2px solid #b0b0b0;
    border-bottom: 2px solid #b0b0b0;
    transform: rotate(45deg);
    /* Xoay để tạo hình < */
}

.arrow-right {
    width: 12px;
    height: 12px;
    border-right: 2px solid #b0b0b0;
    border-top: 2px solid #b0b0b0;
    transform: rotate(45deg);
    /* Xoay để tạo hình > */
}

.current-page {
    background-color: #00c4b4;
    color: white;
    font-size: 18px;
    font-weight: bold;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
}

.nav-button:hover:not(.disabled) {
    border-color: #5cb85c;
}

.nav-button:active:not(.disabled) {
    background-color: #f9f9f9;
}

.nav-button.disabled {
    color: #ccc;
    border-color: #eee;
    cursor: not-allowed;
}

.nav-icon {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>