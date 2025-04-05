<template>
    <div class="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="card p-4 shadow text-center" style="max-width: 500px; width: 100%">
        <div class="mb-4">
          <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
              class="bi bi-exclamation-circle text-danger" viewBox="0 0 16 16">
              <path
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-13A6 6 0 1 1 8 14A6 6 0 0 1 8 2z" />
              <path
                d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.93-7.481a.5.5 0 0 1 .99 0l-.35 4.5a.5.5 0 0 1-.99 0l-.35-4.5z" />
            </svg>
          </div>
        </div>
  
        <h4 class="fw-bold text-danger">Đường dẫn không hợp lệ</h4>
        <p class="text-muted mt-2">
          Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.<br />
          Vui lòng yêu cầu lại liên kết đặt lại mật khẩu. Liên kết chỉ có hiệu lực trong vòng <strong>10 phút</strong>.
        </p>
  
        <nuxt-link to="/auth/password/forgot" class="btn btn-primary mt-4">
          Gửi lại liên kết đặt lại mật khẩu
        </nuxt-link>
      </div>
    </div>
  </template>