<template>
    <li>
        <button :disabled="disabled" :class="['dropdown-item', { disabled: disabled }]" :title="title"
            @click="handleClick">
            <Icon v-if="iconName" :name="iconName" :size="iconSize" />
            <slot></slot>
        </button>
    </li>
</template>

<script setup>
import { computed } from 'vue'
import { navigateTo } from '#app'

const props = defineProps({
    tag: { type: String, default: 'button' },
    to: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    title: { type: String, default: '' },
    iconName: { type: String, default: null },
    iconSize: { type: Number, default: 16 },
    onClick: { type: Function, default: null },
    onClose: { type: Function, default: null }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
    if (props.disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
    }

    if (props.onClick) {
        props.onClick(event)
    }

    emit('click', event)

    if (props.onClose) {
        props.onClose()
    }

    if (props.to) {
        navigateTo(props.to)
    }
}
</script>

<style scoped>
.dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    color: #333;
    text-decoration: none;
    cursor: pointer;
}

.dropdown-item:hover {
    background: #f5f5f5;
}

.dropdown-item.disabled {
    color: #aaa;
    cursor: not-allowed;
}
</style>
