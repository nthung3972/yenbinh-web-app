import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboard';
import { useUserStore } from '@/stores/user';
import { useLoadingStore } from '@/stores/loading';
import { useToast } from 'vue-toastification';

export function useInitialData() {
    const dashboardStore = useDashboardStore();
    const userStore = useUserStore();
    const loadingStore = useLoadingStore();
    const router = useRouter();
    const toast = useToast();

    // Dữ liệu
    const buildings = ref(null); // Dữ liệu từ fetchStatsBuildings
    const userInfo = ref(null); // Dữ liệu từ getUserInfo
    const selectedBuildingId = ref('all'); // Đồng bộ với dashboardStore
    const statsData = ref(null); // Dữ liệu thống kê cho building cụ thể hoặc tất cả
    const isDataLoaded = ref(false);

    // Computed để lấy dữ liệu thống kê dựa trên selectedBuildingId
    const selectedStatsData = computed(() => {
        return selectedBuildingId.value === 'all' ? buildings.value : statsData.value;
    });

    // Gọi tất cả API cần thiết khi tải trang
    const fetchInitialData = async () => {
        try {
            loadingStore.showLoading();
            const [buildingsResponse, userInfoResponse] = await Promise.all([
                dashboardStore.fetchStatsBuildings(),
                userStore.getUserInfo(),
            ]);
            buildings.value = buildingsResponse;
            userInfo.value = userInfoResponse;
            isDataLoaded.value = true;
            console.log('Dữ liệu ban đầu đã được tải thành công:', buildings.value, userInfo.value);
            toast.success('Tải dữ liệu thành công!');
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
            toast.error('Lỗi khi tải dữ liệu ban đầu');
        } finally {
            loadingStore.hideLoading();
        }
    };

    // Xử lý thay đổi tòa nhà
    const handleBuildingChange = async (buildingId) => {
        try {
            selectedBuildingId.value = buildingId;
            dashboardStore.setSelectedBuilding(buildingId);

            if (buildingId === 'all') {
                statsData.value = null; // Reset dữ liệu building cụ thể
                await router.push('/dashboard');
            } else {
                loadingStore.showLoading();
                statsData.value = await dashboardStore.fetchStatsBuilding(buildingId);
                await router.push('/dashboard');
            }
        } catch (error) {
            console.error('Lỗi khi thay đổi tòa nhà:', error);
            toast.error('Lỗi khi cập nhật dữ liệu tòa nhà');
        } finally {
            loadingStore.hideLoading();
        }
    };

    // Kiểm tra và điều hướng
    const checkBuildingAndNavigate = (route) => {
        if (selectedBuildingId.value === 'all') {
            toast.warning('Vui lòng chọn tòa nhà!');
        } else {
            router.push(route);
        }
    };

    return {
        buildings,
        userInfo,
        selectedBuildingId,
        selectedStatsData,
        isDataLoaded,
        fetchInitialData,
        handleBuildingChange,
        checkBuildingAndNavigate,
    };
}