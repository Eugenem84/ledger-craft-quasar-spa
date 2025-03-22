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

const downloadNewVersion = async () => {
  try {
    $q.notify({ type: 'info', message: 'Проверка разрешений...', position: 'top' });

    document.addEventListener('deviceready', async function () {
      // Внутреннее хранилище не требует запроса разрешений
      $q.notify({ type: 'info', message: 'Разрешение получено, начинаем загрузку APK...', position: 'top' });

      try {
        const response = await api.get('/download-apk', { responseType: 'blob' });

        $q.notify({ type: 'info', message: 'Файл загружен, определяем имя...', position: 'top' });

        let fileName = 'LedgerCraft-latest.apk';
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '');
        }

        $q.notify({ type: 'info', message: `Имя файла: ${fileName}`, position: 'top' });

        // Используем внутреннее хранилище для сохранения файла
        const filePath = cordova.file.dataDirectory + fileName;

        $q.notify({ type: 'info', message: `Файл будет сохранён по пути: ${filePath}`, position: 'top' });

        const writeFile = (fileEntry, dataObj) => {
          return new Promise((resolve, reject) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onwriteend = () => {
                $q.notify({ type: 'positive', message: 'Файл успешно записан!', position: 'top' });
                resolve();
              };
              fileWriter.onerror = (e) => {
                $q.notify({ type: 'negative', message: 'Ошибка при записи файла!', position: 'top' });
                reject(e);
              };
              fileWriter.write(dataObj);
            });
          });
        };

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry) => {
          $q.notify({ type: 'info', message: 'Файловая система доступна, создаём файл...', position: 'top' });

          dirEntry.getFile(fileName, { create: true }, (fileEntry) => {
            writeFile(fileEntry, response.data)
              .then(() => {
                $q.notify({
                  type: 'positive',
                  message: 'Файл успешно скачан!',
                  position: 'top',
                  actions: [
                    {
                      label: 'Установить',
                      color: 'white',
                      handler: () => {
                        $q.notify({ type: 'info', message: 'Открываем файл для установки...', position: 'top' });

                        cordova.plugins.fileOpener2.open(
                          filePath,
                          'application/vnd.android.package-archive',
                          {
                            error: (e) => {
                              $q.notify({ type: 'negative', message: 'Ошибка при открытии файла!', position: 'top' });
                              console.error('Ошибка при открытии файла:', e);
                            },
                            success: () => {
                              $q.notify({ type: 'positive', message: 'Файл успешно открыт для установки!', position: 'top' });
                            }
                          }
                        );
                      }
                    }
                  ]
                });
              })
              .catch((err) => {
                $q.notify({ type: 'negative', message: 'Ошибка при сохранении файла!', position: 'top' });
                console.error('Ошибка при записи файла:', err);
              });
          }, (err) => {
            $q.notify({ type: 'negative', message: 'Ошибка при создании файла!', position: 'top' });
            console.error('Ошибка при создании файла:', err);
          });
        }, (err) => {
          $q.notify({ type: 'negative', message: 'Ошибка доступа к файловой системе!', position: 'top' });
          console.error('Ошибка доступа к файловой системе:', err);
        });

      } catch (error) {
        $q.notify({ type: 'negative', message: 'Ошибка при загрузке файла!', position: 'top' });
        console.error(error);
      }
    }, false);
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Общая ошибка!', position: 'top' });
    console.error(err);
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
    <q-btn @click="downloadNewVersion" >скачать</q-btn>
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
