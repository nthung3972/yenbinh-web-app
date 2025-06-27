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
                console.log('dataaaaa:', response.data)
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
                // console.log(response)
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
