<script setup>

import {ref} from "vue";

const props = defineProps({
  title: { type: String , default: 'подтверждение'},
  message: { type: String, default: 'действительно удалить?'},
  onConfirm: { type: Function, required: true}
})

const isOpen = ref(false)
function open(){
  isOpen.value = true
}
function close(){
  isOpen.value = false
}
function confirm(){
  props.onConfirm()
  close()
}

defineExpose({open})

</script>

<template>
<q-dialog v-model="isOpen">
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <div> {{ message }} </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat
             label="отмена"
             color="yellow"
             @click="close"
      />
      <q-btn flat
             label="удалить"
             color="red"
             @click="confirm"
      />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<style scoped>

</style>
