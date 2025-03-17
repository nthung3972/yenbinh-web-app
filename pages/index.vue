// Ví dụ sử dụng trong component Vue hoặc Page Nuxt
<script setup>
import { ref, onMounted } from 'vue';
import ApiService from '~/services/api.service';
import { useAuthStore } from '~/stores/auth';

const users = ref([]);
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();

// Lấy danh sách users
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await ApiService.get('buildings');
    console.log(response);
    
    users.value = response.data.users;
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu';
  } finally {
    loading.value = false;
  }
};

// Ví dụ thêm user mới
// const addUser = async (userData) => {
//   try {
//     const response = await ApiService.post('users', userData);
//     // Thêm user mới vào danh sách
//     users.value.push(response.data.user);
//     return response.data.user;
//   } catch (err) {
//     console.error('Error adding user:', err);
//     throw err;
//   }
// };

// Khởi tạo auth khi component mount
onMounted(async () => {
  await authStore.initAuth();
  await fetchUsers();
});
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h1>Users List</h1>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
