<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <div class="card shadow-sm w-100">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h4 class="mb-0 fw-bold text-primary">
                    <Icon name="ph:list-bullets" class="me-2" />
                    Danh mục loại phí
                </h4>
                <button class="btn btn-primary" @click="openCreateModal">+ Thêm loại phí</button>
            </div>

            <div class="card-body">
                <div v-for="type in feeTypeStore.feeTypes" :key="type.fee_type_id" class="mb-4 border rounded p-3">
                    <!-- Loại phí cha -->
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="fw-bold mb-0 text-dark">{{ type.name }}</h5>
                            <small class="text-muted">{{ type.code }}</small>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-2" @click="openCreateSubtypeModal(type.fee_types_id)">+ Phí
                                con</button>
                            <button class="btn btn-sm btn-outline-secondary me-2"
                                @click="openEditModal(type)">Sửa</button>
                        </div>
                    </div>

                    <!-- Phí con -->
                    <div v-if="type.fee_subtypes.length" class="mt-3 ps-3 border-start border-3 border-primary-subtle">
                        <table class="table table-sm table-hover align-middle">
                            <thead class="table-primary">
                                <tr>
                                    <th style="width: 20%">Tên phí con</th>
                                    <th style="width: 20%">Mã phí</th>
                                    <th style="width: 20%">Đơn vị</th>
                                    <th style="width: 30%">Mô tả</th>
                                    <th style="width: 10%" class="text-end">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="sub in type.fee_subtypes" :key="sub.id">
                                    <td>{{ sub.name }}</td>
                                    <td><span class="badge text-bg-secondary">{{ sub.code }}</span></td>
                                    <td>{{ sub.unit || '-' }}</td>
                                    <td>{{ sub.note || '-' }}</td>
                                    <td class="text-end">
                                        <button class="btn btn-sm btn-outline-secondary me-2"
                                            @click="openEditSubtypeModal(sub)">Sửa</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-else class="d-flex justify-content-center ps-4 mt-2 text-muted fst-italic">
                        Chưa có phí con nào
                    </div>
                </div>
            </div>
        </div>
    </div>

    <FeeTypeModal v-if="showModal" :edit-data="selectedType" @close="closeModal" @saved="getFeeTypes" />
    <FeeSubtypeModal v-if="showSubtypeModal" :edit-data="selectedSubtype" :fee-type-id="feeTypeId" @close="closeSubtypeModal" @saved="getFeeTypes" />
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useFeeTypeStore } from '@/stores/fee-type';
import FeeTypeModal from '~/components/modal/FeeTypeModal.vue';
import FeeSubtypeModal from '~/components/modal/FeeSubtypeModal.vue';

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    breadcrumb: 'Danh mục phí',
})

const feeTypeStore = useFeeTypeStore();
const showModal = ref(false)
const selectedType = ref(null)
const showSubtypeModal = ref(false)
const selectedSubtype = ref(null)
const feeTypeId = ref(null)

//Show type modal
const openCreateModal = () => {
    selectedType.value = null
    showModal.value = true
}

const openEditModal = (type) => {
    selectedType.value = type
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

// Show subtype modal
const openCreateSubtypeModal = (id) => {
    selectedSubtype.value = null
    showSubtypeModal.value = true
    feeTypeId.value = id
}

const openEditSubtypeModal = (subtype) => {
    selectedSubtype.value = subtype
    showSubtypeModal.value = true
}

const closeSubtypeModal = () => {
    showSubtypeModal.value = false
}

const isLoading = computed(() => feeTypeStore.isLoading);

const getFeeTypes = async () => {
    await feeTypeStore.getFeeTypes();
}

onMounted(() => {
    getFeeTypes();
})
</script>

<style scoped>
.table-sm th,
.table-sm td {
    vertical-align: middle !important;
}

.badge {
    font-size: 0.75rem;
}

.table-hover tbody tr:hover {
    background-color: #f8f9fa;
    transition: 0.2s;
}
</style>
