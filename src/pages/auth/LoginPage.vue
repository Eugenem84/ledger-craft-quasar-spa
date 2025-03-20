<script setup>

import { ref } from 'vue'
import { useAuthStore} from "stores/auth-store.js";
import { api } from "boot/axios.js";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const email = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()
const $q = useQuasar()

const authStore = useAuthStore()

const login = async () => {
  loading.value = true

  //showDialog('информация', `старт отправки`)

  try {
    $q.notify({
      type: 'positive',
      message: `trying send URL: ${api.defaults.baseURL} `,
      position: 'top',
    })
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })
    authStore.setToken(response.data.access_token)
    router.push('/orders')
    console.log('проверка хранилища pinia: ', authStore.token)
  } catch (err){
    $q.notify({
      type: 'negative',
      message: 'ошибка входа: ' + err.message,
      position: "top",
      timeout: "1000"
    })
    console.error('ошибка входа: ', err)
  } finally {
    loading.value = false
  }
}

</script>

<template>
 <q-page class="flex flex-center">
   <q-card class="q-pa-md" style="width: 300px">
     <q-card-section>
       <div class="text-h6">Вход</div>
     </q-card-section>

     <q-card-section>
       <q-input v-model="email"
                label="Email"
                type="email"
                outlined
                class="q-md-md"
       />
       <q-input v-model="password"
                label="Пароль"
                type="password"
                outlined
       />
     </q-card-section>

     <q-card-actions align="right">
       <q-btn label="Войти"
              color="primary"
              @click="login"
              :loading="loading"
       />
     </q-card-actions>
   </q-card>
 </q-page>
</template>

<style scoped>

</style>
