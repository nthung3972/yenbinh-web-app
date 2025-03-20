<template>
    <nav class="navbar navbar-light px-4">
        <div class="header-title">
            <h1>Dashboard</h1>
            <p>Quản lý tổng thể các tòa nhà</p>
        </div>
        <button @click="logout">
            Logout
        </button>
        <div class="user-info">
            <div class="search-box bg-light">
                <input type="text" class="form-control" placeholder="Tìm kiếm..." />
            </div>
            <div class="info">
                <span>TT</span>
            </div>
        </div>
    </nav>
</template>

<script setup>
import AuthService from '~/services/auth.service';

const logout = async () => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
}
</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 20px;
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-title h1 {
    margin: 0;
    font-size: 28px;
    color: var(--dark);
    font-weight: bold;
}

.header-title p {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}

.user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.user-info .info {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #4895ef;
    color: white;
    font-weight: bold;
    text-align: center;
}

.search-box {
    background-color: var(--light);
    border-radius: 20px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    padding: 5px;
    width: 300px;
}
</style>
