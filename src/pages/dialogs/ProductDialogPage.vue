<script setup>
import {ref} from 'vue'
import {api} from 'boot/axios.js'
import {useSpecializationsStore} from "stores/specializations.js";
import DeleteConfirmPage from "pages/DeleteConfirmPage.vue";

const deleteConfirmPage = ref(null)

const specializationStore = useSpecializationsStore()

const emit = defineEmits(['product-saved'])

const currentProduct = ref(null)

const currentProductCategory = ref(null)

const showDialog = ref(false)

const name = ref(null)
const baseSalePrice = ref(null)

const editMode = ref(true)

const open = (product, productCategory) => {
  currentProduct.value = product ? {...product} : null
  currentProductCategory.value = productCategory || null
  name.value = product?.name || ''
  baseSalePrice.value = product?.base_sale_price || ''
  if (currentProductCategory.value){
    editMode.value = false
  } else {
    editMode.value = true
  }
  showDialog.value = true
  console.log('product: ', product)
  console.log('productCategory: ', productCategory)
}

const saveProduct = async () => {
  try {
    //console.log('currentCategoryId: ', currentCategory.value.id)
    if (editMode.value){
      console.log('редактирование продукта не реализовано')
      await api.post(`/edit_product`, {
        id: currentProduct.value.id,
        name: name.value,
        specialization_id: specializationStore.getSelectedSpecialization.id
      })
      showDialog.value = false
      emit('product-category-saved')
    } else {
      console.log('создаем новый продукт: ', currentProduct.value)
      await api.post(`/add_product`, {
        name: name.value,
        base_sale_price: baseSalePrice.value,
        product_category_id: currentProductCategory.value.id
      })
      showDialog.value = false
      emit('product-added')
    }
  } catch (err){
    console.error(err)
    currentProduct.value = null
    close()
  }
}

const deleteCategory = async () => {
  if (!currentProduct.value) return

  // Показываем диалог подтверждения
  deleteConfirmPage.value.open(
    'Подтвердите удаление',
    `Вы уверены, что хотите удалить товар "${currentProduct.value.name}"?`,
    async () => {
      try {
        await api.post(`/delete_product`, {
          productId: currentProduct.value.id
        });
        emit('product-saved'); // Обновляем список
        showDialog.value = false; // Закрываем диалог редактирования
      } catch (err) {
        console.error("Ошибка удаления товара", err);
      }
    }
  );
};

defineExpose({open})

</script>

<template>

  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6">
          {{ editMode ? 'Редактирование' : 'Новый товар'}}
        </span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-y-md">
          <q-input v-model="name"
                   outlined
                   label="название продукта"
                   placeholder="Введите название"
                   class="q-mb-md"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-y-md">
          <q-input v-model="baseSalePrice"
                   outlined
                   label="цена продажи"
                   placeholder="Введите цену продажи"
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
               text-color="yellow"
               @click="saveProduct"
        />

        <q-btn label="Удалить"
               flat
               color="yellow"
               @click="deleteCategory"
               v-if="currentProduct"
        />

      </q-card-actions>


    </q-card>
  </q-dialog>

  <DeleteConfirmPage ref="deleteConfirmPage" />

</template>

<style scoped>

</style>
