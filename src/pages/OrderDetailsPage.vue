<script setup>
import {ref, computed, onMounted} from 'vue'
import {useOrderStore} from "stores/order.js";

const orderStore = useOrderStore()

const orderStatus = ref('waiting');
const paid = ref(false)

const order = ref(null)
const client = ref(null)
const model = ref(null)

const tab = ref('all')

const editMode = ref(false)

onMounted(() => {
  order.value = orderStore.currentOrder
  console.log('ордер: ', order.value)
  paid.value = order.value.paid
  orderStatus.value = order.value.status
  client.value = order.value.client_name
  if (order.value.model){
    model.value = order.value.model
  }
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
        <q-tab-panel name="all">
          <div>
            весь заказ
          </div>
        </q-tab-panel>

        <q-tab-panel name="servicesChoice">
          <div>выбор работ</div>
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
