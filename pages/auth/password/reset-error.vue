<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
        <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
            <div class="mb-6 flex justify-center">
                <div class="rounded-full bg-red-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>

            <h1 class="mb-4 text-xl font-bold text-gray-800">Đường dẫn không hợp lệ</h1>

            <p class="mb-6 text-gray-600">
                Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                Đường dẫn đặt lại mật khẩu chỉ có hiệu lực trong 10 phút.
            </p>

            <nuxt-link to="/forgot-password"
                class="inline-block rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700">
                Yêu cầu đường dẫn mới
            </nuxt-link>
        </div>
    </div>
</template>
