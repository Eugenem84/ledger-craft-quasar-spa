<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useAuthStore } from 'stores/auth-store'

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const loading = ref(false)

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const register = async () => {
  loading.value = true
  try {
    const response = await api.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    })
    authStore.setToken(response.data.access_token)
    router.push('/orders')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка регистрации: ' + (err.response?.data?.message || err.message),
      position: 'top'
    })
    console.error('Ошибка регистрации:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Регистрация</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="name" label="Имя" outlined />
        <q-input v-model="email" label="Email" type="email" outlined />
        <q-input v-model="password" label="Пароль" type="password" outlined />
        <q-input v-model="password_confirmation" label="Повторите пароль" type="password" outlined />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Зарегистрироваться"
               color="primary"
               @click="register"
               :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
