<script setup>
import { ref } from 'vue';

const orders = ref([
  {id: 1, name: 'ордер 1'},
  {id: 2, name: 'ордер 2'}
])
</script>

<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Список ордеров</div>
    <q-list bordered separator>
      <q-item v-for="order in orders" :key="order.id">
        <q-item-section>
          <q-item-label>{{ order.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped>

</style>
