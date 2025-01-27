<script setup>
import { useAuthStore } from 'stores/auth-store.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Функция выхода из системы
const logout = () => {
  authStore.logout(); // Очистка токена в Pinia
  localStorage.removeItem('authToken'); // Удаление токена из локального хранилища
  router.push('/login'); // Перенаправление на страницу входа
};
</script>

<template>
  <q-btn class="bg-primary" @click="logout">Logout</q-btn>
</template>

<style scoped>
</style>
