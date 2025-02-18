<script setup>
import {ref, computed, onMounted} from 'vue'
import {useOrderStore} from "stores/order.js";
import {api} from "boot/axios.js";
import {useSpecializationsStore} from "stores/specializations.js";

const orderStore = useOrderStore()

const orderStatus = ref('waiting');
const paid = ref(false)

const order = ref(null)
const services = ref(null)
const client = ref(null)
const model = ref(null)

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
  client.value = order.value.client_name
  if (order.value.model){
    model.value = order.value.model
  }
  getServices()
  getServiceCategories()
})

const activeEditMode = () => {
  editMode.value = true
}

const saveOrder = () => {
  editMode.value = false
}

const togglePaid = () => {
  paid.value = !paid.value
}
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
     :options="[
    { label: 'ожид', value: 'waiting' },
    { label: 'враб', value: 'process' },
    { label: 'готово', value: 'done' }
  ]"
    >

    </q-btn-toggle>

    <q-btn outline
           size="sm"
           @click="togglePaid"
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
           @click="saveOrder"
    />
  </div>

  <div class="row q-col-gutter-md">
    <q-select v-model="client"
              :options="[client]"
              label="клиент"
              dense
              disable class="col"
    />

    <q-select v-model="model"
              :options="[model]"
              label="модель"
              disable class="col"
              dense
              :display-value="model === null ? 'нет модели' : model" />
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
        <q-tab name="all" label="работ: материалов:" />
        <q-tab name="servicesChoice" v-if="editMode" label="работы" />
        <q-tab name="materialsChoice" v-if="editMode" label="материалы" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
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
                        {{ service.price }}
                      </q-item-label>
                </q-item-section>

              </q-item>
            </q-list>
          </div>
        </q-tab-panel>


        <q-tab-panel name="servicesChoice">
          <q-select v-model="selectedServiceCategory"
                    :options="serviceCategories"
                    option-label="category_name"
                    option-value="id"
                    emit-value
                    label="категории работ"
                    dense
                    placeholder="нет категорий"
                    @update:model-value="getServicesByCategory"
          />



        </q-tab-panel>

        <q-tab-panel name="materialsChoice">
          <div>выбор материалов</div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>

</template>

<style scoped>

</style>
