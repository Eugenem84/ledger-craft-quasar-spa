<script setup>
import {onMounted, ref} from 'vue'
import {api} from "boot/axios.js";
import {useSpecializationsStore} from "stores/specializations.js";

const specializationStore = useSpecializationsStore()

const tab = ref('services')

const clients = ref([])

const selectedSpecializationId = specializationStore.getSelectedSpecialization.id

onMounted(() => {
  getClients()
})

const getClients = async () => {
  try {
    const response = await api.get(`/get_clients/${selectedSpecializationId}`)
    clients.value = response.data
    console.log('clients: ', clients.value)
  } catch (err) {
    console.error('ошибка получения клиентов: ', err)
  }
}

</script>

<template>
  <q-page class="q-pa-none">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey sticky-tabs"
        active-color="yellow"
        indicator-color="yellow"
        align="justify"
        narrow-indicator
      >
        <q-tab name="services" label="работы" />
        <q-tab name="clients" label="клиенты" />
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>

        <q-tab-panel name="services">
          сервисы
        </q-tab-panel>

        <q-tab-panel name="clients" style="padding: 0">

          <!-- отображение списка продуктов -->
          <q-list bordered separator >

            <q-item-label v-if="!clients">Нет материалов</q-item-label>
            <q-item v-for="client in clients"
                    :key="client"
                    class="w-100 justify-between row"
                    style="width: 100%"
            >

              <q-item-section class="col-auto">
                <q-item-label class="text-left">
                  {{ client.name }}
                </q-item-label>
              </q-item-section>


              <q-item-section class="col-auto">
                <q-item-label class="text-right">
                  {{ client.phone }}
                </q-item-label>
              </q-item-section>

            </q-item>
          </q-list>
        </q-tab-panel>

      </q-tab-panels>

    </q-card>

  </q-page>
</template>

<style scoped>

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: black;
}

</style>
