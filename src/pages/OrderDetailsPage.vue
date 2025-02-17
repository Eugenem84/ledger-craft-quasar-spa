<script setup>
import {ref, computed, onMounted} from 'vue'
//import {route} from "quasar/wrappers";
import { useRoute } from 'vue-router';

const route = useRoute();

const orderId = route.params.id
const orderStatus = ref('waiting');
const paid = ref(false)

onMounted(() => {
  console.log('детали ордера: ', orderId)
})

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
    <q-btn flat color="yellow"
           label="НАЗАД"
           @click="$router.back()"
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
           size="sm"
           color="yellow"
           label="РЕД"
    />
  </div>


</template>

<style scoped>

</style>
