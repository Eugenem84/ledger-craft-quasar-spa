<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { api } from 'boot/axios.js'
import {useSpecializationsStore} from "stores/specializations.js";
//import { useAuthStore} from "stores/auth-store.js";

//const authStore = useAuthStore()

const router = useRouter()
const loading = ref(false)
const orders = ref([])
//const specializations = ref([])

const goToOrderDetails = (id) => {
  console.log('переходим на ордер', id)
   router.push(`/orders/${id}`)
}

// const getSpecializations = async () => {
//   try {
//     const token = localStorage.getItem('authToken')
//     const response = await api.get('/get_specializations_by_user', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//     specializations.value = response.data
//   } catch (err){
//     console.error('Ошибка получения специализаций: ', err)
//   } finally {
//     console.log('Специализации: ', specializations.value)
//   }
// }

const getOrders = async () => {
  loading.value = true
  try {
    const specializationsStore = useSpecializationsStore()
    const id = specializationsStore.selectedSpecialization.id
    console.log('запрашиваем ордеры специализации: ', id)
    const token = localStorage.getItem('authToken')
    console.log('token: ', token)
    const response = await api.get(`/orders_by_specialization/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    //authStore.setToken(response.data.access_token)
    orders.value = response.data
    console.log(response.data)
  } catch (err) {
    console.error('Ошибка загрузки ордеров: ', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getOrders()
  //getSpecializations()
})

</script>

<template>
  <q-page class="q-pa-md">
    <q-list bordered separator>
      <q-item-label v-if="orders.length === 0">Нет данных</q-item-label>
      <q-item v-for="order in orders" :key="order.id" clickable v-ripple @click="goToOrderDetails">
        <q-item-section>
          <q-item-label>№: {{ order.id }}</q-item-label>
          <q-item-label>Статус: {{ order.status }}</q-item-label>
          <q-item-label>Сумма: {{ order.total_amount }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped>

</style>
