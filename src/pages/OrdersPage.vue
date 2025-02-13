<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { api } from 'boot/axios.js'
import { useAuthStore} from "stores/auth-store.js";

const authStore = useAuthStore()

const router = useRouter()
const loading = ref(false)
const orders = ref([])

const goToOrderDetails = (id) => {
  console.log('переходим на ордер', id)
   router.push(`/orders/${id}`)
}
const getOrders = async () => {
  loading.value = true
  try {
    const response = await api.get(`/get_orders_by_user/${1}`)
    authStore.setToken(response.data.access_token)
    orders.value = response.data
    console.log(response.data)
  } catch (err) {
    console.error('Ошибка загрузки ордеров: ', err)
  } finally {
    loading.value = false
  }
}

onMounted(getOrders)

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
