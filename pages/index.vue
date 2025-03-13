<template>
    <div>
      <h1>Trang Quản lý Tòa nhà</h1>
      <Buildings />  <!-- Sử dụng component -->
    </div>
  </template>
  
  <script>
  import Buildings from '~/components/Buildings.vue';
  
  export default {
    components: {
        Buildings
    }
  };
  </script>