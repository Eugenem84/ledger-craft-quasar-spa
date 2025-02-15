<script setup>
import { useAuthStore } from 'stores/auth-store.js';
import { useRouter } from 'vue-router';
import {useSpecializationsStore} from "stores/specializations.js";
import {computed, onMounted, ref} from 'vue'
//import specializations from "boot/specializations.js";

const authStore = useAuthStore();
const router = useRouter();
const specializationStore = useSpecializationsStore()

const selectedSpecialization = ref(specializationStore.selectSpecialization)

const specializations = computed(() => specializationStore.specializations)

onMounted(() => {
  selectedSpecialization.value = specializationStore.selectedSpecialization
})

const changeSpecialization = () => {
  specializationStore.setSelectedSpecialization(selectedSpecialization.value)
  console.log('текущая специализация: ', specializationStore.selectedSpecialization)
}
// Функция выхода из системы
const logout = () => {
  authStore.logout(); // Очистка токена в Pinia
  localStorage.removeItem('authToken'); // Удаление токена из локального хранилища
  router.push('/login'); // Перенаправление на страницу входа
};
</script>

<template>
  <q-btn class="bg-primary" @click="logout">Logout</q-btn>

  <div>
    <q-select v-model="selectedSpecialization"
              :options="specializations"
              option-value="id"
              option-label="specializationName"
              label="Выберите специализацию"
              @update:model-value="changeSpecialization">
    </q-select>
  </div>

</template>

<style scoped>
</style>
