<template>
    <div class="d-flex bg-light">
      <Sidebar />
      <div class="content flex-grow-1">
        <Header />
        <main>
          <slot />
        </main>
      </div>
    </div>
  </template>

<script setup>
import Sidebar from '~/components/sidebar/Sidebar.vue'
import Header from '~/components/header/Header.vue'

definePageMeta({
  middleware: "auth",
});

</script>

<style>
main {
    margin: 20px;
    overflow-y: auto;
    scrollbar-width: thin;
    height: calc(100% - 135px);
}
.content {
    width: calc(100% - 250px);
    max-height: 100vh;
    overflow-y: hidden;
}

slot {
    width: calc(100% - 250px);
}
</style>
