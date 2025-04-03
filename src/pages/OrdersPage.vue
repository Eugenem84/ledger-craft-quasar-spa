<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import { api } from 'boot/axios.js'
import {useSpecializationsStore} from "stores/specializations.js";
import {useOrderStore} from "stores/order.js";
import {useQuasar} from "quasar";
import DeleteConfirmPage from "pages/DeleteConfirmPage.vue";

const $q = useQuasar()

const deleteConfirmPage = ref(null)

const orderStore = useOrderStore()
const router = useRouter()
const loading = ref(false)
const orders = ref([])

const filterDone = ref(false) // Стейт для фильтрации завершенных заказов

// Фильтрация заказов с учетом состояния фильтра
const filteredOrders = computed(() => {
  return orders.value.filter(order => filterDone.value || order.status !== 'done')
})

const statusBorderClass = (status) => {
  return {
    'border-waiting': status ==='waiting',
    'border-done': status === 'done',
    'border-process': status === 'process'
  }
}

const goToOrderDetails = (order) => {
  console.log('переходим на ордер', order.id)
  orderStore.setOrder(order)
  router.push(`/orders/${order.id}`)
}

const goToNewOrder = () => {
  console.log('не реализовано')
  orderStore.clearCurrentOrder()
  router.push({ name: `new-order`})
}

const getOrders = async () => {
  loading.value = true
  try {
    const specializationsStore = useSpecializationsStore()
    const id = specializationsStore.selectedSpecialization.id
    console.log('запрашиваем ордеры специализации: ', id)
    const token = localStorage.getItem('authToken')
    console.log('token: ', token)
    const response = await api.get(`/get_orders_by_user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    //authStore.setToken(response.data.access_token)
    orders.value = response.data
    console.log('ордеры: ', response.data)
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'ошибка загрузки ордеров',
      position: "top",
      timeout: "1000"
    })
    console.error('Ошибка загрузки ордеров: ', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('url: ', api.defaults.baseURL)
  getOrders()
})

</script>

<template>
  <div class="text-center" style="color: gray; font-size: 80% ; background-color: #1c1c1c" >
    <span>о р д е р ы</span>
  </div>

  <div class="row items-center no-wrap">
    <q-checkbox
      v-model="filterDone"
      dense
      size="sm"
      color="black"
      class="q-mr-xs"
    />
    <span class="text-body2 text-grey-8 cursor-pointer"
          :class="{ 'text-green': filterDone }"
          @click="filterDone = !filterDone">
    показывать готовые
  </span>
  </div>

  <q-page class="q-pa-none" style="padding: 0">
    <q-list bordered separator>
      <q-item-label v-if="filteredOrders.length === 0">Нет данных</q-item-label>
      <q-item v-for="order in filteredOrders"
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
            <div class="col-2 text-left">
              <q-item-label class="text-body1 q-pa-none q-ma-none" style="font-size: 16px; align-items: flex-start; margin-bottom: -7px">
                {{ new Date(order.created_at).toLocaleDateString('ru-RU') }}
              </q-item-label>
              <q-item-label name="order-number" class="q-ml-sm" style="white-space: nowrap; color: white">
                №: {{order.id}}
              </q-item-label>
            </div>
            <div class="col-6 text-center">
              <q-item-label>
                 {{ order.client_name }}
              </q-item-label>
            </div>

            <div class="col-1">
              <div>
                <q-item-label v-if="order.status === `waiting`">
                  <q-icon name="hourglass_empty" spin color="yellow" class="q-ml-sm" />
                </q-item-label>


                <q-item-label v-if="order.status === `done`">
                  <q-icon name="done" color="green" class="q-ml-sm" />
                </q-item-label>

                <q-item-label v-if="order.status === `process`">
                  <q-icon name="build" spin color="red" class="q-ml-sm" />
                </q-item-label>

              </div>
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

    <!-- Плавающая кнопка добавления нового ордера -->
    <q-btn
      icon="add"
      round
      class="fab bg-yellow text-black"
      @click="goToNewOrder"
      size="20px"
    />

  </q-page>

  <DeleteConfirmPage ref="deleteConfirmPage" />

</template>

<style scoped>

.fab {
  position: fixed;
  bottom: 70px;
  right: 16px;
  z-index: 1000; /* чтобы кнопка была поверх остальных элементов */
}

.border-waiting {
  box-shadow: inset 0 0 15px rgba(255, 255, 0, 0.2);
}

.border-done {
  box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.1);;
}

.border-process {
  border-right: 1px solid red;
  border-left: 1px solid red;
  box-shadow: inset 0 0 15px rgba(255, 0, 0, 0.5);;

}

</style>
