import { defineStore } from "pinia";
import { api } from "boot/axios.js";

export const useSpecializationsStore = defineStore('specializations', {
  state: () => ({
    specializations: [],
    selectedSpecialization: null
  }),
  getters: {
    getSelectedSpecialization: (state) => state.selectedSpecialization
  },
  actions: {
    async getSpecializations() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await api.get('/get_specializations_by_user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.specializations = response.data;
        console.log('specializations: ', this.specializations);
      } catch (err) {
        console.error('Ошибка получения специализаций: ', err);
      }
    },
    setSelectedSpecialization(specialization) {
      this.selectedSpecialization = specialization.value.id;
      console.log('применяемм выбранную спеиализацию: ', specialization)
      console.log('Изменение специализации на: ', this.selectedSpecialization);
    }
  }
});
