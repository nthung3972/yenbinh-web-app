import { defineStore } from "pinia";
import { DebtApi } from "~/services/api/debt.api";

export const useDebtStore = defineStore("debt", {
    state: () => ({
        debts: [],
        debtHistory: [],
        periods: {
            months: [],
            quarters: [],
            years: []
          },
        loading: false,
        error: null,
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
    }),

    actions: {
        async fetchDebts(page, perPage, building_id, period_type, period_value, status) {
            this.loading = true;
            try {
                const response = await DebtApi.fetchDebts(page, perPage, building_id, period_type, period_value, status);
                // console.log('dataaaaa:', response.data.data.pagination)
                if (response.data) {
                    this.debts = response.data.data;
                    this.pagination = {
                        current_page: response.data.data.pagination.current_page,
                        per_page: response.data.data.pagination.per_page,
                        total: response.data.data.pagination.total,
                        last_page: response.data.data.pagination.last_page,
                    };
                }
            } catch (error) {
                this.error = error.message || 'Failed to fetch debts';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchDebtHistory(period_type, period_value, status) {
            this.loading = true;
            try {
                const response = await DebtApi.fetchDebtHistory(period_type, period_value, status);
                if (response.data) {
                    this.debtHistory = response.data;
                }
            } catch (error) {
                this.error = error.message || 'Failed to fetch debt history';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchPeriods() {
            this.loading = true;
            try {
                const response = await DebtApi.fetchPeriods();
                console.log(response)
                if (response.data) {
                    this.periods = response.data.data;
                }
            } catch (error) {
                this.error = error.message || 'Failed to fetch periods';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});

// import { defineStore } from 'pinia';
// import { ref } from 'vue';

// export const useDebtStore = defineStore('debt', () => {
//   // State
//   const buildings = ref([
//     { building_id: 1, name: 'Tòa A' },
//     { building_id: 2, name: 'Tòa B' },
//     { building_id: 3, name: 'Tòa C' }
//   ]);

//   const debts = ref([
//     {
//       building_id: 1,
//       building_name: 'Tòa A',
//       total_debt: 25000000,
//       overdue_debt: 10000000,
//       apartments: [
//         { apartment_id: 1, apartment_number: 'A101', resident_name: 'Nguyen Van A', total_debt: 15000000, overdue_debt: 7000000 },
//         { apartment_id: 2, apartment_number: 'A102', resident_name: 'Tran Thi B', total_debt: 10000000, overdue_debt: 3000000 }
//       ]
//     },
//     {
//       building_id: 2,
//       building_name: 'Tòa B',
//       total_debt: 15000000,
//       overdue_debt: 5000000,
//       apartments: [
//         { apartment_id: 3, apartment_number: 'B201', resident_name: 'Le Van C', total_debt: 8000000, overdue_debt: 3000000 },
//         { apartment_id: 4, apartment_number: 'B202', resident_name: 'Pham Thi D', total_debt: 7000000, overdue_debt: 2000000 }
//       ]
//     },
//     {
//       building_id: 3,
//       building_name: 'Tòa C',
//       total_debt: 10000000,
//       overdue_debt: 2000000,
//       apartments: [
//         { apartment_id: 5, apartment_number: 'C301', resident_name: 'Hoang Van E', total_debt: 10000000, overdue_debt: 2000000 }
//       ]
//     }
//   ]);

//   const debtHistory = ref([
//     { month: '2025-01', total_debt: 40000000, overdue_debt: 15000000, unpaid: 20000000, partially_paid: 15000000, paid: 5000000 },
//     { month: '2025-02', total_debt: 45000000, overdue_debt: 17000000, unpaid: 25000000, partially_paid: 15000000, paid: 5000000 },
//     { month: '2025-03', total_debt: 50000000, overdue_debt: 20000000, unpaid: 30000000, partially_paid: 15000000, paid: 5000000 },
//     { month: '2025-04', total_debt: 48000000, overdue_debt: 18000000, unpaid: 28000000, partially_paid: 15000000, paid: 5000000 }
//   ]);

//   const selectedBuilding = ref('');
//   const selectedPeriodType = ref('month'); // month, quarter, year
//   const selectedPeriodValue = ref(''); // VD: '2025-03' cho tháng, '2025-Q1' cho quý, '2025' cho năm
//   const selectedStatus = ref(''); // unpaid, partially_paid, paid, hoặc rỗng (tất cả)

//   // Actions
//   const filterDebts = () => {
//     let filtered = debts.value;

//     // Lọc theo tòa nhà
//     if (selectedBuilding.value) {
//       filtered = filtered.filter(debt => debt.building_id === parseInt(selectedBuilding.value));
//     }

//     // Lọc theo trạng thái
//     if (selectedStatus.value) {
//       filtered = filtered.map(debt => ({
//         ...debt,
//         invoices: debt.invoices.filter(invoice => invoice.status === selectedStatus.value),
//         total_debt: debt.invoices.reduce((sum, inv) => sum + inv.remaining_balance, 0),
//         overdue_debt: debt.invoices
//           .filter(inv => new Date(inv.due_date) < new Date())
//           .reduce((sum, inv) => sum + inv.remaining_balance, 0)
//       })).filter(debt => debt.invoices.length > 0);
//     }

//     // Lọc theo thời gian
//     if (selectedPeriodValue.value) {
//       filtered = filtered.map(debt => {
//         let filteredInvoices = debt.invoices;
//         if (selectedPeriodType.value === 'month') {
//           filteredInvoices = debt.invoices.filter(inv => inv.invoice_date.startsWith(selectedPeriodValue.value));
//         } else if (selectedPeriodType.value === 'quarter') {
//           const [year, quarter] = selectedPeriodValue.value.split('-Q');
//           const quarterMonths = {
//             '1': ['01', '02', '03'],
//             '2': ['04', '05', '06'],
//             '3': ['07', '08', '09'],
//             '4': ['10', '11', '12']
//           };
//           filteredInvoices = debt.invoices.filter(inv => {
//             const [invYear, invMonth] = inv.invoice_date.split('-');
//             return invYear === year && quarterMonths[quarter].includes(invMonth);
//           });
//         } else if (selectedPeriodType.value === 'year') {
//           filteredInvoices = debt.invoices.filter(inv => inv.invoice_date.startsWith(selectedPeriodValue.value));
//         }

//         return {
//           ...debt,
//           invoices: filteredInvoices,
//           total_debt: filteredInvoices.reduce((sum, inv) => sum + inv.remaining_balance, 0),
//           overdue_debt: filteredInvoices
//             .filter(inv => new Date(inv.due_date) < new Date())
//             .reduce((sum, inv) => sum + inv.remaining_balance, 0)
//         };
//       }).filter(debt => debt.invoices.length > 0);
//     }

//     return filtered;
//   };

//   return {
//     buildings,
//     debts,
//     debtHistory,
//     selectedBuilding,
//     selectedPeriodType,
//     selectedPeriodValue,
//     selectedStatus,
//     filterDebts
//   };
// });
