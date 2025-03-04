import { defineStore } from "pinia";
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null)

  const setOrder = (order) => {
    currentOrder.value = order
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  return {
    currentOrder,
    setOrder,
    clearCurrentOrder
  }
})
