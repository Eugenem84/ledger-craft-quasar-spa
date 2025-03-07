<script setup>
import {ref, computed} from 'vue'
import {api} from 'boot/axios.js'
//import {useQuasar} from "quasar";
import {useSpecializationsStore} from "stores/specializations.js";

const specializationStore = useSpecializationsStore()
//const $q = useQuasar()

const props = defineProps({
  // category: {
  //   type: Object,
  //   default: null
  // }
})

//const emit = defineEmits(['product-category-saved'])

const currentCategory = ref(null)

const showDialog = ref(false)

const name = ref(null)

const editMode = computed(() => !!currentCategory.value)

const open = (categoty) => {
  currentCategory.value = categoty ? {...categoty} : null
  name.value = categoty?.name || ''
  showDialog.value = true
}

const saveProductCategory = async () => {
  try {
    console.log('specializationId: ', specializationStore.getSelectedSpecialization.id)
    if (editMode.value){
      await api.post(`/edit_product_category`, {
        id: props.category.id,
        name: name.value,
        specialization_id: specializationStore.getSelectedSpecialization.id
      })
      close()
    } else {
      await api.post(`/add_product_category`, {
        name: name.value,
        specialization_id: specializationStore.getSelectedSpecialization.id
      })
      close()
    }
  } catch (err){
    console.error(err)
    close()
  }
}

defineExpose({open})

</script>

<template>

  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <q-avatar icon="category" color="yellow" text-color="white" />
        <span class="q-ml-sm text-h6">
          {{ editMode ? 'Редактирование' : 'Новая категория'}}
        </span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-y-md">
          <q-input v-model="name"
                   outlined
                   label="название категории"
                   placeholder="Введите название"
                   class="q-mb-md"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">

        <q-btn flat
               label="Отмена"
               color="yellow"
               v-close-popup
        />

        <q-btn label="Сохранить"
               color="yellow"
               @click="saveProductCategory"
        />

      </q-card-actions>


    </q-card>
  </q-dialog>

</template>

<style scoped>

</style>
