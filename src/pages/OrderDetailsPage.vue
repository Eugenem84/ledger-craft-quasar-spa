<script setup>
import {ref, computed} from 'vue'

const orderStatus = ref('waiting');
const paid = ref(false)
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

  <div class="upper-buttons">
    <q-btn flat color="yellow"
           label="назад"
           @click="$router.back()"
    />

    <q-btn-toggle
      v-model="orderStatus"
      outline
      glossy
      :toggle-color="computedToggleColor"
      color="grey"
     :options="[
    { label: 'ожидание', value: 'waiting' },
    { label: 'в работе', value: 'process' },
    { label: 'готово', value: 'done' }
  ]"
    >

    </q-btn-toggle>

    <q-btn outline
           @click="togglePaid"
           :color="paid ? 'green' : 'grey'"
           glossy
           :label="paid ? 'Оплачено' : 'Не оплачено'"
           style="min-width: 135px; max-width: 135px;"
    />

    <q-btn flat color="yellow" label="изменить" />

    <div class="q-mt-md">Статус: {{ paid ? 'Оплачено' : 'Не оплачено' }}</div>
  </div>


</template>

<style scoped>

</style>
