<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center">
        <div class="card shadow border-0 p-4 p-md-5 text-center" style="max-width: 500px;">
            <!-- Icon thất bại -->
            <div class="mb-4">
                <div class="bg-danger bg-opacity-10 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style="width: 80px; height: 80px;">
                    <i class="bi bi-x-circle-fill fs-1 text-danger"></i>
                </div>
            </div>

            <h1 class="card-title fw-bold mb-3 text-danger">Xác minh thất bại!</h1>

            <div class="card-body px-0">
                <p class="text-muted mb-4">
                    Đường dẫn xác minh không hợp lệ hoặc đã hết hạn.
                    Vui lòng thử lại hoặc yêu cầu gửi email xác minh mới.
                </p>

                <div class="d-grid gap-3">
                    <NuxtLink to="/auth/verify-email" class="btn btn-primary w-100 py-2">
                        Yêu cầu email xác minh mới
                    </NuxtLink>

                    <NuxtLink to="/support" class="text-decoration-none d-block mt-2">
                        <i class="bi bi-question-circle me-1"></i> Cần hỗ trợ?
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
