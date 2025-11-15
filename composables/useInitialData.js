import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '~/stores/dashboard';
import { useUserStore } from '@/stores/user';
import { useLoadingStore } from '@/stores/loading';
import { useToast } from 'vue-toastification';

let initialDataSingleton;

export function useInitialData() {
    if (initialDataSingleton) return initialDataSingleton;

    const dashboardStore = useDashboardStore();
    const userStore = useUserStore();
    const loadingStore = useLoadingStore();
    const router = useRouter();
    const toast = useToast();

    //computed 
    const buildings = computed(() => dashboardStore.buildings);
    const userInfo = computed(() => userStore.user);
    const selectedBuildingId = computed(() => dashboardStore.selectedBuildingId);
    const selectedStatsData = computed(() => dashboardStore.getSelectedStatsData);
    const isDataLoaded = computed(() => !!dashboardStore.buildings);

    console.log('userInfo', userInfo)

    /**
     * Fetch data ban đầu khi load trang
     * - Luôn fetch buildings
     * - Nếu có selectedBuildingId được persist, fetch stats của building đó
     */
    const fetchInitialData = async () => {
        try {
            loadingStore.showLoading();
            
            // Fetch user info và buildings
            const [buildingsData] = await Promise.all([
                dashboardStore.fetchStatsBuildings(),
                userStore.getUserInfo(),
            ]);

            // Nếu có building được chọn từ trước (persist), fetch stats của building đó
            if (dashboardStore.selectedBuildingId && dashboardStore.selectedBuildingId !== 'all') {
                await dashboardStore.fetchStatsBuilding(dashboardStore.selectedBuildingId);
            }

            toast.success('Tải dữ liệu thành công!', { timeout: 1000 });
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Lỗi khi tải dữ liệu ban đầu');
        } finally {
            loadingStore.hideLoading();
        }
    };

    /**
     * Xử lý khi chọn building
     */
    const handleBuildingChange = async (buildingId) => {
        try {
            loadingStore.showLoading();
            
            // Set selected building (sẽ tự động persist)
            dashboardStore.setSelectedBuilding(buildingId);

            if (buildingId === 'all') {
                // Reset stats building data
                dashboardStore.statsBuilding = null;
            } else {
                // Fetch stats của building được chọn
                await dashboardStore.fetchStatsBuilding(buildingId);
            }

            // Navigate về dashboard
            await router.push('/dashboard');
            
        } catch (error) {
            console.error('Error changing building:', error);
            toast.error('Lỗi khi cập nhật dữ liệu tòa nhà');
        } finally {
            loadingStore.hideLoading();
        }
    };

    /**
     * Kiểm tra xem đã chọn building chưa trước khi navigate
     */
    const checkBuildingAndNavigate = (route) => {
        if (dashboardStore.selectedBuildingId === 'all') {
            toast.warning('Vui lòng chọn tòa nhà!');
            return false;
        } else {
            router.push(route);
            return true;
        }
    };

    /**
     * Reset về trạng thái ban đầu
     */
    const resetSelection = () => {
        dashboardStore.resetStore();
        router.push('/dashboard');
    };

    // Gán vào singleton
    initialDataSingleton = {
        buildings,
        userInfo,
        selectedBuildingId,
        selectedStatsData,
        isDataLoaded,
        fetchInitialData,
        handleBuildingChange,
        checkBuildingAndNavigate,
        resetSelection,
    };

    return initialDataSingleton;
}
