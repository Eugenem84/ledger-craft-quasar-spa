<template>
  <div>
    <q-select
      v-model="timePeriod"
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

<!--    <q-toggle-->
<!--      v-model="showOrders"-->
<!--      label="Показать кол‑во ордеров"-->
<!--      color="yellow"-->
<!--      class="q-mt-md"-->
<!--    />-->
  </div>

  <div style="height: 100%" class="q-mt-md">
    <Bar
      v-if="chartData && chartData.labels.length"
      :data="chartData"
      :options="chartOptions"
      style="height: 80vh"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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
import { api } from 'boot/axios.js'
import { useSpecializationsStore } from 'stores/specializations.js'

// Регистрируем Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const specializationsStore = useSpecializationsStore()
const specializationId = specializationsStore.getSelectedSpecialization.id

const timePeriod = ref('day')
const periodOptions = [
  { label: 'по месяцам', value: 'month' },
  { label: 'по неделям',  value: 'week'  },
  { label: 'по дням',     value: 'day'   },
  { label: 'по годам',    value: 'year'  }
]

const showOrders = ref(true)
const chartData  = ref(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    // левая ось — доход
    'y-income': {
      type: 'linear',
      position: 'left',
      beginAtZero: true,
      title: { display: true, text: 'Доход, ₽' }
    },
    // правая ось — заказы
    'y-orders': {
      type: 'linear',
      position: 'right',
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      ticks: {
        stepSize: 1,
        precision: 0
      },
      title: { display: true, text: 'Кол‑во ордеров' }
    },
    x: {
      title: { display: true, text: 'Период' }
    }
  },
  plugins: {
    legend: { position: 'bottom' }
  }
}

async function getIncomesByPeriod() {
  try {
    const {data: apiData} = await api.post(
      `/incomes_by_period/${specializationId}`,
      {period: timePeriod.value}
    )

    const labels = apiData.map(e => e.period)
    const datasets = [
      {
        label: 'Доход (₽)',
        type: 'bar',
        yAxisID: 'y-income',
        backgroundColor: 'yellow',
        data: apiData.map(e => e.total)
      }
    ]

    if (showOrders.value) {
      datasets.push({
        label: 'Кол‑во ордеров',
        type: 'bar',
        yAxisID: 'y-orders',
        backgroundColor: 'grey',
        data: apiData.map(e => e.count)
      })
    }

    chartData.value = {labels, datasets}
  } catch (err) {
    console.error('ошибка при загрузке данных:', err)
  }
}

watch([timePeriod, showOrders], getIncomesByPeriod)
onMounted(getIncomesByPeriod)
</script>

<style scoped>
/* дополнительные стили по желанию */
</style>
