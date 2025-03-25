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
      newVersionAnable.value = true
    }
  } catch (err) {
    console.error(err)
  }
}


// Функция для преобразования Blob в base64-строку
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result имеет формат "data:[mime];base64,..."
      const base64data = reader.result.split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const downloadApkWithSAF = async () => {
  try {
    $q.notify({ type: 'info', message: 'Выберите папку для сохранения APK...', position: 'top' });

    // Ожидаем, когда Cordova будет готов
    await new Promise((resolve, reject) => {
      document.addEventListener('deviceready', resolve, { once: true });
      setTimeout(() => reject(new Error('Cordova timeout')), 5000);
    });

    if (!cordova.plugins || !cordova.plugins.safMediastore) {
      throw new Error('Плагин SAF не доступен');
    }
    console.log('Плагин SAF доступен!');

    // Запрашиваем выбор папки через SAF
    const folderUri = await cordova.plugins.safMediastore.selectFolder('Documents');
    if (!folderUri) {
      throw new Error('Папка не выбрана');
    }
    console.log('Выбранная папка URI:', folderUri);

    // Загружаем APK с сервера как Blob
    const response = await api.get('/download-apk', { responseType: 'blob' });
    console.log('content desp: ', response.headers)
    if (!response || !response.data) {
      throw new Error('Ошибка при получении данных APK');
    }

    //const headers = response.headers.toJSON ? response.headers.toJSON() : response.headers;
    //const contentDisposition = headers['content-disposition'];
    console.log('APK загружен, размер:', response.data.size, 'байт');

    // Преобразуем Blob в base64-строку
    const base64Data = await blobToBase64(response.data);
    console.log('Base64 длина:', base64Data.length);

    // Если сервер не возвращает имя файла, используем имя по умолчанию
    let filename = 'LedgerCraft-latest.apk';

    //console.log('Content-Disposition:', contentDisposition);

    // if (contentDisposition) {
    //   const match = contentDisposition.match(/filename="?([^";]+)"?/);
    //   if (match && match[1]) {
    //     filename = match[1];
    //   }
    // }
    console.log('Используемое имя файла:', filename);

    // Выполняем запись файла на главном (UI) потоке через requestAnimationFrame
    const writeUri = await new Promise((resolve, reject) => {
      window.requestAnimationFrame(async () => {
        try {
          const result = await cordova.plugins.safMediastore.writeFile({
            data: base64Data,
            filename: filename,
            folder: folderUri
          });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    $q.notify({ type: 'positive', message: `Файл сохранён: ${writeUri}`, position: 'top' });
    console.log('Файл успешно сохранён:', writeUri);

  } catch (error) {
    console.error('Общая ошибка:', error);
    $q.notify({ type: 'negative', message: error.message || 'Ошибка операции', position: 'top' });
  }
};


</script>

<template>
  <q-btn class="bg-primary text-black" color="yellow" @click="logout">Выход из аккаунта</q-btn>

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

  <div v-if="newVersionAnable === true">
    <p> Доступна новая версия {{newVersion}}</p>
    <q-btn @click="downloadApkWithSAF" >скачать</q-btn>
  </div>

  <div v-if="newVersionAnable === false">
    <p> У Вас самая последняя версия </p>
  </div>

  <div>
    <q-btn color="yellow" text-color="black" @click="checkAppVersion">проверить обновление</q-btn>
  </div>

</template>

<style scoped>
</style>
