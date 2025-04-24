import { ref, computed } from 'vue';
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

    const buildings = ref(null);
    const userInfo = ref(null);
    const selectedBuildingId = ref('all');
    const statsData = ref(null);
    const isDataLoaded = ref(false);

    const selectedStatsData = computed(() => {
        return selectedBuildingId.value === 'all' ? buildings.value : statsData.value || [];
    });

    const fetchInitialData = async () => {
        try {
            loadingStore.showLoading();
            const [buildingsResponse, userInfoResponse] = await Promise.all([
                dashboardStore.fetchStatsBuildings(),
                userStore.getUserInfo(),
            ]);
            buildings.value = Array.isArray(buildingsResponse) ? buildingsResponse : [];
            userInfo.value = userInfoResponse || {};
            isDataLoaded.value = true;
            toast.success('Tải dữ liệu thành công!');
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu ban đầu');
            buildings.value = [];
        } finally {
            loadingStore.hideLoading();
        }
    };

    const handleBuildingChange = async (buildingId) => {
        try {
            selectedBuildingId.value = buildingId;
            dashboardStore.setSelectedBuilding(buildingId);

            if (buildingId === 'all') {
                statsData.value = null;
                await router.push('/dashboard');
            } else {
                loadingStore.showLoading();
                statsData.value = await dashboardStore.fetchStatsBuilding(buildingId);
                await router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Lỗi khi cập nhật dữ liệu tòa nhà');
        } finally {
            loadingStore.hideLoading();
        }
    };

    const checkBuildingAndNavigate = (route) => {
        if (selectedBuildingId.value === 'all') {
            toast.warning('Vui lòng chọn tòa nhà!');
        } else {
            router.push(route);
        }
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
    };

    return initialDataSingleton;
}