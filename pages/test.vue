<script setup>
import apiService from '~/services/api.service'

onMounted(async () => {
  try {
    const res = await apiService.get('/auth/check')
    console.log("✅ Success:", res.data)
  } catch (err) {
    console.error("❌ Error test:", err)
  }
})
</script>

<template>
  <div>Test API Page</div>
</template>