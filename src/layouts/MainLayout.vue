<template>
  <q-layout view="lHh Lpr lFf" class="bg-black">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="!$route.meta.hideFooter" elevated class="bg-primary text-white">
      <q-separator color="grey"/>

      <q-tabs
        v-model="tab"
        dense
        :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-3' "
        align="justify"
        narrow-indicator
        class="tabs"
        indicator-color="yellow"
      >
        <q-route-tab to="/orders" name="orders" label="ордеры" icon="list" class="flex-grow col-3 text-caption"/>
        <q-route-tab to="/store" name="store" label="склад" icon="storage" class="flex-grow col-2"/>
        <q-route-tab to="/catalog" name="catalog" label="Каталог" icon="folder" class="flex-grow col-3" />
        <q-route-tab to="/analytic" name="analytic" label="Аналитика" icon="bar_chart" class="flex-grow col-3" />
        <q-route-tab to="/other" name="other" label="" icon="more_horiz" class="flex-grow col-1" />

      </q-tabs>

    </q-footer>

  </q-layout>
</template>

<script setup>

import { ref } from 'vue'

const tab = ref('/orders')

</script>

<style scoped>

</style>
