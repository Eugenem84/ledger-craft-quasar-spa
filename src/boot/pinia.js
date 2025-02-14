// src/boot/pinia.js
import { createPinia } from 'pinia'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  // Создаём Pinia
  const pinia = createPinia()

  // Подключаем Pinia к приложению
  app.use(pinia)
})
