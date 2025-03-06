<script setup>
import {onMounted, ref} from 'vue'
import {api} from "boot/axios.js";
import {useSpecializationsStore} from "stores/specializations.js";
import DeleteConfirmPage from "pages/DeleteConfirmPage.vue";

const confirmDialog = ref(null)
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

function handleDelete(){
  confirmDialog.value.open()
}

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

const deleteClient = async () => {
  try {
    const response = await api.post(`/delete_client`, {
      clientId: selectedClient.value.id
    })
    console.log('response', response)
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

          <!-- отображение списка клиентов -->
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

          <!-- Плавающая кнопка добавления нового клиента -->
          <q-btn
            icon="add"
            round
            class="fab bg-yellow text-black"
            @click="console.log('не реализовано')"
            size="20px"
          />

        </q-tab-panel>

      </q-tab-panels>

    </q-card>

  </q-page>

  <div>
    <q-dialog v-model="showClientsDetails" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">клиент</div>
          <q-input :disable="!editClientMode"
                   v-model="selectedClient.name"
                   label-color="yellow"
                   color="yellow"
                   label="Имя клиента"
                   outlined
                   class="q-mb-md"
          />
          <q-input :disable="!editClientMode"
                   v-model="selectedClient.phone"
                   label-color="yellow"
                   color="yellow"
                   label="телефон"
                   outlined class="q-mb-md"
          />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-if="editClientMode" flat label="отмена" color="yellow" @click="editClientMode = false" />
          <q-btn v-if="!editClientMode" flat label="закрыть" color="yellow" @click="showClientsDetails = false" />
          <q-btn v-if="!editClientMode" flat label="редактировать" color="yellow" @click="editClientMode = true" />
          <q-btn v-if="editClientMode" flat label="сохранить" color="yellow" @click="editClient" />
          <q-btn v-if="!editClientMode" flat label="удалить" color="yellow" @click="handleDelete" />
        </q-card-actions>
      </q-card>

    </q-dialog>

    <DeleteConfirmPage ref="confirmDialog"
                       message="удаляем клиента"
                       :onConfirm="deleteClient"
    />

  </div>

</template>

<style scoped>

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: black;
}

.fab {
  position: fixed;
  bottom: 70px;
  right: 16px;
  z-index: 1000; /* чтобы кнопка была поверх остальных элементов */
}

</style>
