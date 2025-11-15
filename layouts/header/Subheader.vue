<template>
    <div class="bg-white border-bottom px-4 py-3 mt-1 mb-1">
        <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3">

            <!-- Left Section: Title and Breadcrumbs -->
            <div class="flex-grow-1">
                <!-- Breadcrumbs -->
                <nav v-if="items.length" aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0 d-flex align-items-center">
                        <li v-for="(breadcrumb, index) in items" :key="index" class="d-flex align-items-center"
                            :class="{ active: index === items.length - 1 }" aria-current="page">
                            <!-- Home Icon for first item -->
                            <div v-if="index === 0" class="d-flex align-items-center">
                                <svg class="me-2 text-secondary" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>

                                <router-link v-if="breadcrumb.to && index < items.length - 1" :to="breadcrumb.to"
                                    class="text-decoration-none text-secondary small fw-medium">
                                    {{ breadcrumb.label }}
                                </router-link>
                                <span v-else class="text-dark small fw-semibold">
                                    {{ breadcrumb.label }}
                                </span>
                            </div>

                            <!-- Other items -->
                            <div v-else class="d-flex align-items-center">
                                <svg class="flex-shrink-0 text-muted mx-2" width="18" height="18" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 
                       7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 
                       010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>

                                <router-link v-if="breadcrumb.to && index < items.length - 1" :to="breadcrumb.to"
                                    class="text-decoration-none text-secondary small fw-medium">
                                    {{ breadcrumb.label }}
                                    </router-link>
                                    <span v-else class="text-dark small fw-semibold">
                                        {{ breadcrumb.label }}
                                    </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        default: () => []
    }
});
</script>