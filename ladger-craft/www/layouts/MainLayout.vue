<template>
  <q-layout view="lHh Lpr lFf">
<!--    <q-header elevated>-->
<!--      <q-toolbar>-->
<!--        <q-btn-->
<!--          flat-->
<!--          dense-->
<!--          round-->
<!--          icon="menu"-->
<!--          aria-label="Menu"-->
<!--          @click="toggleLeftDrawer"-->
<!--        />-->

<!--        <q-toolbar-title>-->
<!--          Quasar App-->
<!--        </q-toolbar-title>-->

<!--        <div>Quasar v{{ $q.version }}</div>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

<!--    <q-drawer-->
<!--      v-model="leftDrawerOpen"-->
<!--      show-if-above-->
<!--      bordered-->
<!--    >-->
<!--      <q-list>-->
<!--        <q-item-label-->
<!--          header-->
<!--        >-->
<!--          Essential Links-->
<!--        </q-item-label>-->

<!--        <EssentialLink-->
<!--          v-for="link in linksList"-->
<!--          :key="link.title"-->
<!--          v-bind="link"-->
<!--        />-->
<!--      </q-list>-->
<!--    </q-drawer>-->

    <q-page-container>
<!--      <transition name="q-transition&#45;&#45;slide-left" >-->
<!--        <router-view />-->
<!--      </transition>-->
      <router-view />
    </q-page-container>

    <q-footer v-if="!$route.meta.hideFooter" elevated class="bg-primary text-white">
      <q-separator color="yellow"/>

      <q-tabs
        v-model="tab"
        dense
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3' "
        align="justify"
        narrow-indicator
        indicator-color="yellow"
        >
        <q-route-tab to="/orders" name="orders" label="Ордеры" icon="list"/>
        <q-route-tab to="/catalog" name="catalog" label="Каталог" icon="folder" />
        <q-route-tab to="/analytic" name="analytic" label="Аналитика" icon="bar_chart" />
        <q-route-tab to="/other" name="other" label="другое" icon="more_horiz" />

      </q-tabs>

    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

// import EssentialLink from 'components/EssentialLink.vue'

const tab = ref('/orders')

// const linksList = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev'
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework'
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev'
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev'
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev'
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev'
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev'
//   }
// ]

// const leftDrawerOpen = ref(false)

// function toggleLeftDrawer () {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }
</script>
