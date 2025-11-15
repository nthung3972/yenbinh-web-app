import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useBuildingStore } from '@/stores/building'
import { useStaffStore } from '@/stores/staff'
import { useShiftStore } from '@/stores/shift'
import { useBuildingFeeStore } from '@/stores/building-fee'
import { useVehicleStore } from '@/stores/vehicle'
import { useApartmentStore } from '@/stores/apartment'
import { useResidentStore } from '@/stores/resident'
import { useInvoiceStore } from '@/stores/invoice'

export const useBreadcrumbs = () => {
    const route = useRoute()
    const buildingStore = useBuildingStore()
    const staffStore = useStaffStore()
    const shiftStore = useShiftStore()
    const buildingFeeStore = useBuildingFeeStore()
    const vehicleSore = useVehicleStore()
    const apartmentStore = useApartmentStore()
    const residentStore = useResidentStore()
    const invoiceStore = useInvoiceStore()

    const labelMap = {
        '/building': 'Tòa nhà',
        '/staff': 'Nhân viên',
        '/shift': 'Ca làm việc',
        '/fee-type': 'Danh mục phí',
        '/admin-report/daily-report': 'Kế hoạch nhân sự',

        '/building-fee' : 'Biểu phí tòa nhà',
        '/vehicle' : 'Quản lý phương tiện',
        '/apartment' : 'Quản lý căn hộ',
        '/utilities' : 'Quản lý điện nước',
        '/invoice' : 'Quản lý hóa đơn',
        '/resident' : 'Quản lý cư dân',
    }

    const breadcrumbs = computed(() => {
        const crumbs = []
        const meta = route.meta || {}

        // Parent
        if (meta.parent) {
            const parentLabel = labelMap[meta.parent] || meta.parent
            crumbs.push({
                label: parentLabel,
                to: meta.parent
            })
        }

        // Intermediates
        if (meta.intermediates && Array.isArray(meta.intermediates)) {
            meta.intermediates.forEach(item => {
                crumbs.push({
                    label: item.label,
                    to: item.to || null
                })
            })
        }

        // Current page - xử lý dynamic breadcrumb
        let currentLabel = meta.breadcrumb || 'Trang hiện tại'

        // Nếu có yêu cầu lấy tên
        if (meta.useBuildingName && route.params.id) {
            const building = buildingStore.getBuildingById(route.params.id)
            currentLabel = building?.name || `Tòa nhà #${route.params.id}`
        }

        if (meta.useStaffName && route.params.id) {
            const staff = staffStore.getStaffById(route.params.id)
            currentLabel = staff?.name || `Nhân viên #${route.params.id}`
        }

        if (meta.useShiftName && route.params.id) {
            const shift = shiftStore.shifts.find(s => s.shift_id === parseInt(route.params.id))
            currentLabel = shift?.name || `Ca làm việc #${route.params.id}`
        }

        if (meta.useBuildingFeeName && route.params.id) {
            const buildingFee = buildingFeeStore.buildingFees.find(s => s.building_fee_id === parseInt(route.params.id))
            currentLabel = buildingFee?.fee_subtype?.name || `Phí tòa nhà #${route.params.id}`
        }

        if (meta.useVehicleName && route.params.id) {
            const vehicle = vehicleSore.vehicleList.find(s => s.vehicle_id === parseInt(route.params.id))
            currentLabel = vehicle?.license_plate || `Xe #${route.params.id}`
        }

        if (meta.useApartmentName && route.params.id) {
            const apartment = apartmentStore.apartmentList.find(s => s.apartment_id === parseInt(route.params.id))
            currentLabel = apartment?.apartment_number || `Căn hộ #${route.params.id}`
        }

        if (meta.useResidentName && route.params.id) {
            const resident = residentStore.residentList.find(s => s.resident_id === parseInt(route.params.id))
            currentLabel = resident?.full_name || `Cư dân #${route.params.id}`
        }

        if (meta.useInvoiceName && route.params.id) {
            const invoice = invoiceStore.invoiceList.find(s => s.invoice_id === parseInt(route.params.id))
            currentLabel = invoice?.invoice_number || `Hóa đơn #${route.params.id}`
        }

        crumbs.push({
            label: currentLabel,
            to: null
        })

        return crumbs
    })

    return { breadcrumbs }
}
