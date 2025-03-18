<script setup>
import { useAuthStore } from 'stores/auth-store.js';
import { useRouter } from 'vue-router';
import {useSpecializationsStore} from "stores/specializations.js";
import {computed, onMounted, ref} from 'vue'
import { api } from 'boot/axios.js'
import {useQuasar} from "quasar";

const $q = useQuasar()

import {version} from '../../package.json'
//import specializations from "boot/specializations.js";

const authStore = useAuthStore();
const router = useRouter();
const specializationStore = useSpecializationsStore()

const selectedSpecialization = ref(specializationStore.selectSpecialization)

const specializations = computed(() => specializationStore.specializations)

const newVersion = ref('')

const newVersionAnable = ref(null)

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

const checkAppVersion = async () => {
  try {
    const response = await api.get(`/app-quasar-android-version`)
    console.log('version: ', response)
    if (version === response.data.version) {
      newVersionAnable.value = false
    } else {
      newVersion.value = response.data.version
    }
  } catch (err) {
    console.error(err)
  }
}

const downloadNewVersion = async () => {
  try {
    const response = await api.get('/download-latest-android-apk', {
      responseType: 'blob'
    })
    // Создаем ссылку для скачивания
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Извлекаем имя файла из заголовков ответа
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'LedgerCraft-latest.apk';
    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition
        .split('filename=')[1]
        .split(';')[0]
        .replace(/['"]/g, ''); // Убираем кавычки, если они есть
    }

    link.setAttribute('download', fileName); // Устанавливаем имя файла
    document.body.appendChild(link);
    link.click(); // Программно кликаем по ссылке
    link.remove(); // Удаляем ссылку из DOM

    // Очищаем объект URL
    window.URL.revokeObjectURL(url);

    // Уведомление об успешном скачивании
    $q.notify({
      type: 'positive',
      message: 'Файл успешно скачан',
      position: 'top'
    });

  } catch (err) {
    console.error(err)
  }



}

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

  <div>
    <br>
    <p> Версия приложения: {{version}}</p>
  </div>

  <div>
    <p> Доступна новая версия {{newVersion}}</p>
    <q-btn @click="downloadNewVersion" >скачать</q-btn>
  </div>

  <div v-if="newVersionAnable === false">
    <p> У вас самая последняя версия </p>
  </div>

  <div>
    <q-btn color="yellow" text-color="black" @click="checkAppVersion">проверить обновление</q-btn>
  </div>

</template>

<style scoped>
</style>
