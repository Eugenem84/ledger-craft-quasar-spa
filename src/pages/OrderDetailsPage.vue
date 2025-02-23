<script setup>
import {ref, computed, onMounted} from 'vue'
import {useOrderStore} from "stores/order.js";
import {api} from "boot/axios.js";
import {useSpecializationsStore} from "stores/specializations.js";
//import {data} from "autoprefixer";

const specializationsStore = useSpecializationsStore()
const selectedSpecializationId = specializationsStore.getSelectedSpecialization.id

const orderStore = useOrderStore()

const orderStatus = ref('waiting');
const paid = ref(false)

const order = ref(null)
const services = ref(null)
const materials =ref(null)
const clientName = ref(null)
const clientId = ref(null)
const modelId = ref(null)
const comments = ref(null)

const selectedServiceCategory = ref(null)

const serviceCategories = ref(null)
const servicesByCategory = ref(null)

const tab = ref('all')

const editMode = ref(false)

const getServices = async () => {
  try {
    const orderId = order.value.id
    const response = await api.get(`/get_services/${orderId}`)
    services.value = response.data
    console.log('services: ', services.value )
  }  catch (err) {
    console.error('ошибка загрузки сервисов', err)
  }
}

const switсhPaidStatus = async () => {
  const id = order.value.id
  try {
    const response = await api.put(`switch_paid_status/${id}`)
    if (response.status === 200) {
      paid.value = !paid.value
      console.log('статус оплаты изменен')
    }
  } catch (err) {
    console.log('ошибка смены статуса: ', err)
  }
}

const updateOrderStatus = async () => {
  try {
    const id = order.value.id
    const response = await api.put(`/update_order_status/${id}`, {
      status: orderStatus.value
    })
    if (response.status === 200) {
      console.log('статус ордера изменен на: ', orderStatus.value)
    } else {
      console.error('ошибка обновления статуса', response)}
  } catch (err) {
    console.error('ошибка запроса: ', err)
  }
}

const geMaterialsByOrder = async () => {
  try {
    const orderId = order.value.id
    const response = await api.get(`/get_materials_by_order/${orderId}`)
    materials.value = response.data
    console.log('materials:', materials.value)
  } catch (err) {
    console.error('ошибка получения материалов: ', err)
  }
}

const getServiceCategories = async () => {
  const specializationStore = useSpecializationsStore()
  try {
    const specializationId = specializationStore.getSelectedSpecialization.id
    console.log('специализация: ', specializationId)
    const response = await api.get(`/get_categories/${specializationId}`)
    serviceCategories.value = response.data
    console.log('сервис категории: ', serviceCategories.value)
  } catch (err) {
    console.error('ошибка загрузки сервис категорий', err)
  }
}

const getServicesByCategory = async (categoryId) => {
  console.log('подгружаем сервисы категории: ', categoryId)
  try {
    const response = await api.get(`/get_service/${categoryId}`)
    servicesByCategory.value = response.data
    console.log('подгружены сервисы категории: ', servicesByCategory.value)
  } catch (err) {
    console.error('ошибка загрузке сервисов данной категории: ', categoryId , err )
  }
}

onMounted(() => {
  order.value = orderStore.currentOrder
  console.log('ордер: ', order.value)
  paid.value = order.value.paid
  orderStatus.value = order.value.status
  clientName.value = order.value.client_name
  clientId.value = order.value.client_id
  modelId.value = order.value.model_id
  if (order.value.model_id){
    modelId.value = order.value.model_id
  }
  if (order.value.comments) {
    comments.value = order.value.comments
  }
  getServices()
  geMaterialsByOrder()
  getServiceCategories()
})

const activeEditMode = () => {
  editMode.value = true
}

const updateOrder = async () => {
  console.log('обновляем ордер на сервере')
  try {
    const totalAmount = totalSumServices.value + totalSumMaterials.value
    console.log('totalAmount: ', totalAmount)
    const response = await api.post('/update_order', {
      id: order.value.id,
      client_id: clientId.value,
      model_id: modelId.value,
      specialization_id: selectedSpecializationId,
      user_order_number: '',
      total_amount: totalAmount,
      materials: materials.value,
      products: '',
      comments: comments.value,
      services: services.value.map(service => service.id),
      paid: paid.value
    })
    console.log('данные для передачи: ', response)
  } catch (err) {
    console.error('ошибка обновления ордера', err)
  }
}

// const saveOrder = () => {
//   editMode.value = false
// }

// Вычисляемая сумма материалов
const totalSumServices = computed(() => {
  if (!services.value) return 0;
  return services.value.reduce((sum, service) => {
    const price = Number(service.price) || 0;
    return sum + price
  }, 0);
})

// Вычисляемая сумма материалов
const totalSumMaterials = computed(() => {
  if (!materials.value) return 0;
  return materials.value.reduce((sum, material) => {
    const price = Number(material.price) || 0;
    const amount = Number(material.amount) || 0;
    return sum + price * amount;
  }, 0);
})

const computedToggleColor = computed(() => {
  switch (orderStatus.value) {
    case 'waiting':
      return 'orange'
    case 'process':
      return 'red'
    case 'done':
      return 'green'
    default:
      return 'yellow'
  }
})
</script>

<template>

  <div class="row justify-between items-center no-wrap">
    <q-btn flat
           v-if="!editMode"
           color="yellow"
           label="НАЗАД"
           @click="$router.back()"
           size="sm"
           class="btn-flex"
    />

    <q-btn flat
           v-if="editMode"
           color="yellow"
           label="отмена"
           @click="saveOrder"
           size="sm"
           class="btn-flex"
    />

    <q-btn-toggle
      v-model="orderStatus"
      size="sm"
      outline
      glossy
      :toggle-color="computedToggleColor"
      color="grey"
      @update:model-value="updateOrderStatus"
      :options="[
    { label: 'ожид', value: 'waiting' },
    { label: 'враб', value: 'process' },
    { label: 'готово', value: 'done' }
  ]"
    >

    </q-btn-toggle>

    <q-btn outline
           size="sm"
           @click="switсhPaidStatus"
           :color="paid ? 'green' : 'grey'"
           glossy
           label="опл"
    />

    <q-btn flat
           v-if="!editMode"
           size="sm"
           color="yellow"
           label="РЕД"
           @click="activeEditMode"
    />
    <q-btn flat
           v-if="editMode"
           size="sm"
           color="yellow"
           label="сохр"
           @click="updateOrder"
    />
  </div>

  <div class="row q-col-gutter-md">
    <q-select v-model="clientName"
              :options="[clientName]"
              label="клиент"
              dense
              disable class="col"
    />

    <q-select v-model="modelId"
              :options="[modelId]"
              label="модель"
              disable class="col"
              dense
              :display-value="modelId === null ? 'нет модели' : modelId" />
  </div>

  <div>
    <q-card>
      <q-tabs
        v-show="editMode"
        v-model="tab"
        dense
        class="text-grey"
        active-color="yellow"
        indicator-color="yellow"
        align="justify"
        narrow-indicator
      >
        <q-tab name="all" :label="'работ: ' + (services ? services.length : 0) +  ' материалов: ' + (materials ? materials.length : 0)" />
        <q-tab name="servicesChoice" v-if="editMode" label="работы" />
        <q-tab name="materialsChoice" v-if="editMode" label="материалы" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>

        <!-- панель отображения выбранных сервисов и материалов -->
        <q-tab-panel name="all" style="padding: 0">
          <div>

            <q-list bordered separator >

              <q-item-label v-if="!services">Нет сервисов</q-item-label>
              <q-item v-for="service in services"
                      :key="service"
                      class="w-100 justify-between"
                      style="width: 100%"
              >
                <!-- сервисы -->
                <q-item-section >
                      <q-item-label class="text-left">
                        {{ service.service }}
                      </q-item-label>
                </q-item-section>


                <q-item-section >
                      <q-item-label class="text-right">
                        {{ service.price }}р
                      </q-item-label>
                </q-item-section>

              </q-item>
            </q-list>

            <div class="text-grey text-left" v-show="totalSumServices > 0 && totalSumMaterials > 0" >
              всего по работе : {{totalSumServices}}р
            </div>

            <!-- отображение списка материалов -->
            <q-list bordered separator >

              <q-item-label v-if="!materials">Нет материалов</q-item-label>
              <q-item v-for="material in materials"
                      :key="material"
                      class="w-100 justify-between row"
                      style="width: 100%"
              >

                <q-item-section class="col-8">
                  <q-item-label class="text-left">
                    {{ material.name }}
                  </q-item-label>
                </q-item-section>


                <q-item-section class="col-1">
                  <q-item-label class="text-right">
                    {{ material.price }}р
                  </q-item-label>
                </q-item-section>

                <q-item-section class="col-1">
                  <q-item-label class="text-center">
                    х{{material.amount}}
                  </q-item-label>
                </q-item-section>

                <q-item-section class="col-1">
                  <q-item-label class="text-right">
                    {{material.price * material.amount}}р
                  </q-item-label>
                </q-item-section>

              </q-item>
            </q-list>

            <div class="text-grey text-left" v-show="totalSumMaterials > 0 && totalSumServices > 0">
              всего по материалам: {{totalSumMaterials}}р
            </div>

            <div class="text-grey text-center display: flex" >
              <div>
                всего к оплате:
              </div>

              <div class="text-green">
                {{totalSumMaterials + totalSumServices}}
              </div>
              р
            </div>

          </div>

          <q-input type="textarea"
                   v-model="comments"
                   label="комментарии"
                   autogrow
                   placeholder="Коментариев нет"
                   :disable="!editMode"
          />



        </q-tab-panel>

        <!-- панель выбора сервисов -->
        <q-tab-panel name="servicesChoice" style="padding: 0">
          <q-select v-model="selectedServiceCategory"
                    :options="serviceCategories"
                    option-label="category_name"
                    option-value="id"
                    emit-value
                    map-options
                    label="категории работ"
                    dense
                    placeholder="нет категорий"
                    label-color="grey"
                    color="yellow"
                    @update:model-value="getServicesByCategory"
          />

          <q-list bordered separator >
            <q-item-label v-if="!servicesByCategory">Нет сервисов</q-item-label>
            <q-item v-for="service in servicesByCategory"
                    :key="service"
                    class="w-100 justify-between"
                    style="width: 100%"
            >

              <q-item-section >
                <q-item-label class="text-left">
                  {{ service.service }}
                </q-item-label>
              </q-item-section>

              <q-item-section >
                <q-item-label class="text-right">
                  {{ service.price }}
                </q-item-label>
              </q-item-section>

            </q-item>
          </q-list>

        </q-tab-panel>

        <!-- панель выбора материалов -->
        <q-tab-panel name="materialsChoice" style="padding: 0">

          <q-list bordered separator>
            <q-item-label v-if="!materials"> нет материалов</q-item-label>
            <q-item v-for="material in materials"
                    :key="material"
                    class="w-100 justify-between row"
            >

              <q-item-section class="col-8">
                <q-input v-model="material.name" />
              </q-item-section>

              <q-item-section class="col-1">
                <q-input v-model="material.amount" />
              </q-item-section>

              <q-item-section class="col-1">
                <div>
                  x
                </div>
              </q-item-section>

              <q-item-section class="col-1" disabled="disabled">
                <q-input :model-value="material.price * material.amount" />
              </q-item-section>

            </q-item>
          </q-list>

        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>

</template>

<style scoped>

</style>
