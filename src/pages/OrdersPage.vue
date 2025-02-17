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

const statusBorderClass = (status) => {
  return {
    'border-waiting': status ==='waiting',
    'border-done': status === 'done',
    'border-process': status === 'process'
  }
}

const goToOrderDetails = (order) => {
  console.log('переходим на ордер', order.id)
   router.push(`/orders/${order.id}`)
}

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
})

</script>

<template>
  <q-page class="q-pa-none">
    <q-list bordered separator>
      <q-item-label v-if="orders.length === 0">Нет данных</q-item-label>
      <q-item v-for="order in orders"
              :key="order"
              clickable
              v-ripple
              @click="goToOrderDetails(order)"
              class="flex-direction: column"
              style="height: 20px"
              :class="statusBorderClass(order.status)"
      >
        <!-- Первый ряд (3 колонки) -->
        <q-item-section class="col-12">
          <div class="row no-wrap items-center">
            <div class="col-3 text-left">
              <q-item-label class="text-body1 q-pa-none q-ma-none" style="font-size: 16px; align-items: flex-start; margin-bottom: -7px">
                {{ new Date(order.created_at).toLocaleDateString('ru-RU') }}
              </q-item-label>
              <q-item-label class="q-ml-sm" style="white-space: nowrap; color: gray">
                №: {{order.id}}
              </q-item-label>
            </div>
            <div class="col-6 text-center">
              <q-item-label>
                 {{ order.client_name }}
              </q-item-label>
            </div>
            <div class="col-1 text-right">
              <div v-if="order.paid"
                   class="q-ml-sm"
                   style="display:flex; flex-direction: column" align="center">
                <q-item-label>
                  <q-icon name="verified" color="green" class="q-ml-sm" />
                  <span class="text-caption text-green" style="font-size: 9px">оплачено</span>
                </q-item-label>
              </div>
            </div>
            <div class="col-2 text-right">
              <q-item-label class="text-body1">
                {{ order.total_amount }}
              </q-item-label>
            </div>
          </div>
        </q-item-section>

      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped>

.border-waiting {
  border-left: 3px solid yellow;
}

.border-done {
  border-left: 3px solid green;
}

.border-process {
  border-left: 3px solid red;
}

</style>
