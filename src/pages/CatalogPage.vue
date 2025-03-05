<script setup>
import {onMounted, ref} from 'vue'
import {api} from "boot/axios.js";
import {useSpecializationsStore} from "stores/specializations.js";

const specializationStore = useSpecializationsStore()

const tab = ref('services')

const editClientMode = ref(false)

const clients = ref([])
const selectedClient = ref(null)

const selectedSpecializationId = specializationStore.getSelectedSpecialization.id

const showClientsDetails= ref(false)

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

const openClientDialog = (client) => {
  selectedClient.value = {...client}
  showClientsDetails.value = true
}

const editClient = async () => {
  try {
    console.log('отправление запроса на редактирование')
    const response = await api.post(`/edit_client`, {
      id: selectedClient.value.id,
      name: selectedClient.value.name,
      phone: selectedClient.value.phone
    })
    console.log('response: ', response)
    await getClients()
    editClientMode.value = false
    showClientsDetails.value = false
  } catch (err){
    console.error(err)
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
                    :key="client.id"
                    class="w-100 justify-between row"
                    style="width: 100%"
                    clickable
                    @click="openClientDialog(client)"
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

  <div>
    <q-dialog v-model="showClientsDetails" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">клиент</div>
          <q-input :disable="!editCientMode"
                   v-model="selectedClient.name"
                   label-color="yellow"
                   color="yellow"
                   label="Имя клиента"
                   outlined
                   class="q-mb-md"
          />
          <q-input :disable="!editCientMode"
                   v-model="selectedClient.phone"
                   label-color="yellow"
                   color="yellow"
                   label="телефон"
                   outlined class="q-mb-md"
          />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-if="editCientMode" flat label="отмена" color="yellow" @click="editCientMode = false" />
          <q-btn v-if="!editCientMode" flat label="закрыть" color="yellow" @click="showClientsDetails = false" />
          <q-btn v-if="!editCientMode" flat label="редактировать" color="yellow" @click="editCientMode = true" />
          <q-btn v-if="editCientMode" flat label="сохранить" color="yellow" @click="editClient" />
          <q-btn v-if="!editCientMode" flat label="удалить" color="yellow" @click="console.log('не реализовано')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<style scoped>

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: black;
}

</style>
