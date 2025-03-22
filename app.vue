<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- <NuxtLayout />
  <NuxtPage /> -->
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    router.push('/dashboard');
  }
});
</script>
