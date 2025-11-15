<template>
  <Transition name="fade">
    <div v-if="loading.isLoading" class="loading-overlay">
      <div class="loading-card">
        <!-- Logo/Icon -->
        <div class="logo-container">
          <div class="logo-circle">
            <img 
              src="@/assets/images/logo-yb.png" 
              alt="Logo" 
              class="logo-image"
            />
          </div>
        </div>

        <!-- Text -->
        <h2 class="loading-title">Đang tải dữ liệu...</h2>
        <p class="loading-subtitle">
          Vui lòng chờ trong giây lát - chúng tôi<br />
          đang chuẩn bị mọi thứ cho bạn.
        </p>

        <!-- Progress Bar -->
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>

        <!-- Footer -->
        <p class="loading-footer">PHẦN MỀM QUẢN LÝ YÊN BÌNH</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();
</script>

<style scoped>
/* Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 22, 40, 0.5); 
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Card Container */
.loading-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 60px 80px;
  text-align: center;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 500px;
  animation: slideUp 0.6s ease-out;
}

/* Logo Container */
.logo-container {
  margin-bottom: 32px;
}

.logo-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: linear-gradient(135deg, #00b4d8 0%, #0096c7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 40px rgba(0, 180, 216, 0.4),
    0 0 80px rgba(0, 180, 216, 0.2);
  animation: pulse 2s ease-in-out infinite;
  position: relative;
}

.logo-circle::before {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px solid rgba(0, 180, 216, 0.3);
  animation: ripple 2s ease-out infinite;
}

.logo-image {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

/* Text */
.loading-title {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.loading-subtitle {
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.6;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 24px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00b4d8, #0096c7, #00b4d8);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: progress 1.5s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
}

/* Footer */
.loading-footer {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.loading-footer::before {
  content: '©';
  font-size: 14px;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 0 40px rgba(0, 180, 216, 0.4),
      0 0 80px rgba(0, 180, 216, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 0 60px rgba(0, 180, 216, 0.6),
      0 0 100px rgba(0, 180, 216, 0.3);
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .loading-card {
    padding: 48px 40px;
    margin: 20px;
    border-radius: 24px;
  }

  .logo-circle {
    width: 100px;
    height: 100px;
  }

  .loading-title {
    font-size: 24px;
  }

  .loading-subtitle {
    font-size: 14px;
  }
}
</style>
