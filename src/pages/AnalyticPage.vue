<template>
  <div>
    <q-select v-model="timePeriod"
              @update:model-value="getIncomesByPeriod"
              :options="periodOptions"
              option-value="value"
              option-label="label"
              label="Выберите период"
              label-color="grey"
              filled
              emit-value
              color="yellow"
              outlined
              map-options
    />

  </div>
  <div style="height: 100%">
    <Bar v-if="chartData && chartData.labels.length > 0"
         :data="chartData"
         :options="chartOptions"
         style="height: 80vh"
    />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {api} from "boot/axios.js";
import {onMounted, ref} from "vue";
import {useSpecializationsStore} from "stores/specializations.js";

const specializationsStore = useSpecializationsStore()
const specializationId = specializationsStore.getSelectedSpecialization.id
const timePeriod = ref('day')
const periodOptions = [
  {label: 'по месяцам', value: 'month'},
  {label: 'по неделям', value: 'week'},
  {label: 'по дням', value: 'day'},
  {label: 'по годам', value: 'year'}
]
// Регистрируем нужные модули Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Пример данных (замени своими)
const chartData = ref(null)

const getIncomesByPeriod = async () => {
  console.log("выбрана опция: ", timePeriod.value)
  try {
    const response = await api.post(`/incomes_by_period/${specializationId}`, {
      period: timePeriod.value
    })
    const apiData = response.data

    chartData.value = {
      labels: apiData.map(entry => entry.period),
      datasets: [
        {
          label: 'Доход (₽)',
          backgroundColor: 'yellow',
          data: apiData.map(entry => entry.total)
        }
      ]
    }

  } catch (err){
    console.error('ошибка при загрузке данных: ', err)
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

onMounted(() => {
  getIncomesByPeriod()
})


</script>

<style scoped>

</style>
