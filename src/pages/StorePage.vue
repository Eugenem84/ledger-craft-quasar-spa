<script setup>
import {onMounted, ref} from "vue";
import {api} from "boot/axios.js";
import {useSpecializationsStore} from "stores/specializations.js";
import {useQuasar} from "quasar";
import ProductCategoryDialogPage from "pages/dialogs/ProductCategoryDialogPage.vue";
import ProductDialogPage from "pages/dialogs/ProductDialogPage.vue";

const $q = useQuasar()

const specializationStore = useSpecializationsStore()
const selectedSpecializationId = specializationStore.getSelectedSpecialization

const productCategories = ref([])
const products = ref([])

const selectedProductCategory = ref(null)
const selectedProduct = ref(null)

//const showProductDetails = ref(false)
//const showProductCategoryDetails = ref(false)

const productDialog = ref(null)
const productCategoryDialog = ref(null)

onMounted( async () => {
  await getProductCategories()
})

const getProductCategories = async () => {
  console.log('selectedSpecializationId: ', selectedSpecializationId)
  try {
    const response = await api.get(`/get_product_categories/${selectedSpecializationId.id}`)
    productCategories.value = response.data
    selectedProductCategory.value = productCategories.value[0]
    getProductsByProductCategories()
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'ошибка загрузки категорий товаров',
      position: "top",
      timeout: "1000"
    })
    console.error(err)
  }
}

const getProductsByProductCategories = async () => {
  try {
    const response = await api.get(`/get_product_stocks/${selectedProductCategory.value.id}`)
    products.value = response.data
    console.log('products: ', products.value)
  } catch (err){
    $q.notify({
      type: 'negative',
      message: 'ошибка загрузки товаров',
      position: "top",
      timeout: "1000"
    })
    console.error(err)
  }
}

const openAddProductCategoryDialog = () => {
  productCategoryDialog.value.open()
}

const openEditProductCategoryDialog = () => {
  console.log('открываетм редактирование категории: ', selectedProductCategory.value)
  if (!selectedProductCategory.value) return
  productCategoryDialog.value.open(selectedProductCategory.value)
}

const openAddProductDialog = () => {
  selectedProduct.value = null
  productDialog.value.open(null, selectedProductCategory.value, false)
}

const openDetailProductDialog = (product) => {
  selectedProduct.value = product
  productDialog.value.open(product, null, true)
}

const handleProductCategorySaved = () => {
  getProductCategories()
  selectedProductCategory.value = null
}

const handleProductAdded = () => {
  getProductsByProductCategories()
  selectedProduct.value = null
}

</script>

<template>
<div class="row items-center">
  <q-select v-model="selectedProductCategory"
            :options="productCategories"
            option-label="name"
            emit-value
            map-options
            label="категория товара"
            dense
            placeholder="нет категорий"
            label-color="grey"
            color="yellow"
            class="col-9"
            outlined
            @update:model-value="getProductsByProductCategories"
  />

  <div class="col-auto self-end">
    <q-btn class="col-1 text-yellow" @click="openAddProductCategoryDialog">+</q-btn>
  </div>

  <div class="col-auto self-end">
    <q-btn class="col-1 text-yellow" @click="openEditProductCategoryDialog" icon="edit" />
  </div>

</div>

<q-list bordered separator>
  <q-item-label v-if="!products">нет товаров</q-item-label>
  <q-item v-for="product in products"
          :key="product"
          class="w-100 justify-between"
          style="width: 100%"
          clickable
          v-ripple
          @click="openDetailProductDialog(product)"
          :q-item
  >
    <q-item-section class="col-8">
      <q-item-label class="text-left">
        {{ product.name }}
      </q-item-label>
    </q-item-section>

    <q-item-section class="col-1">
      <q-item-label class="text-center">
        {{ product.quantity }}
      </q-item-label>
    </q-item-section>

    <q-item-section class="col-2">
      <q-item-label class="text-right">
        {{product.base_sale_price}}
      </q-item-label>
    </q-item-section>

  </q-item>

</q-list>

<q-btn
  icon="add"
  round
  class="fab bg-yellow text-black"
  @click="openAddProductDialog"
  size="20px"
/>

<ProductDialogPage ref="productDialog"  @product-added="handleProductAdded" />
<ProductCategoryDialogPage ref="productCategoryDialog" @product-category-saved="handleProductCategorySaved"  />

</template>

<style scoped>

.fab {
  position: fixed;
  bottom: 70px;
  right: 16px;
  z-index: 1000; /* чтобы кнопка была поверх остальных элементов */
}


</style>
