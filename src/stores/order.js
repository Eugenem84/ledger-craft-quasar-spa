import { defineStore } from "pinia";
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null)

  const setOrder = (order) => {
    currentOrder.value = order
  }
  return {
    currentOrder,
    setOrder
  }
})
