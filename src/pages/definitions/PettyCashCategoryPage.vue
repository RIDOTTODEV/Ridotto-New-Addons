<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('pettyCashCategories') }}
        </div>
        <q-btn
          unelevated
          dense
          color="blue-grey-8"
          text-color="white"
          no-caps
          size="13px"
          icon="add"
          :label="$t('create')"
          @click="openDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="columns"
      :getDataFn="operationsStore.fetchPettyCashCategoryList"
      :rowsPerPage="10"
      tableName="definitionPettyCashCategories"
      :slotNames="['body-cell-actions']"
      ref="refTable"
    >
      <template v-slot:body-cell-actions="{ props }">
        <q-td key="Action" align="center">
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="12px"
            icon="fa-regular fa-pen-to-square"
            class="q-mr-md"
            @click="editForm(props.row)"
            v-el-perms="'Addon.Definitions.PettyCashCategory.Update'"
            data-cy="editData"
          />
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="negative"
            size="12px"
            icon="fa-regular fa-trash-can"
            class="q-mr-sm"
            @click="deleteForm(props.row)"
            v-el-perms="'Addon.Definitions.PettyCashCategory.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>
    <q-dialog v-model="dialog" backdrop-filter="brightness(40%)" @hide="resetFormValues">
      <q-card class="minWithDialog">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('edit') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form @submit="onSubmitForm" ref="form" class="row">
            <div class="col-6 q-pa-sm">
              <q-input
                :label="$t('code')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="formValues.code"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                clearable
              />
            </div>

            <div class="col-6 q-pa-sm">
              <q-input
                :label="$t('description')"
                v-model="formValues.description"
                class="col-12 super-small"
                outlined
                dense
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                clearable
              />
            </div>

            <div class="col-12 q-mt-md text-right">
              <q-btn
                no-wrap
                no-caps
                unelevated
                icon="save"
                color="blue-grey-8"
                text-color="white"
                size="13px"
                :label="formValues.id ? $t('update') : $t('save')"
                class="col-12"
                type="submit"
                data-cy="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { i18n } from 'src/boot/i18n'
import { Dialog } from 'quasar'
import { useOperationsStore } from 'src/stores/operations-store'
const operationsStore = useOperationsStore()
const columns = ref([
  {
    name: 'id',
    label: 'ID',
  },
  {
    name: 'code',
    label: 'Code',
    field: 'code',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
  },
  {
    name: 'isDeleted',
    label: 'Is Deleted',
    fieldType: 'boolean',
    field: 'isDeleted',
  },

  {
    name: 'actions',
    label: 'Actions',
  },
])
const dialog = ref(false)
const formValues = ref({
  id: 0,
  code: null,
  description: null,
})
const refTable = ref(null)
const openDialog = () => {
  dialog.value = true
}
const resetFormValues = () => {
  formValues.value = {
    id: 0,
    code: null,
    description: null,
  }
}
const onSubmitForm = () => {
  if (formValues.value.id) {
    operationsStore.updatePettyCashCategory({ ...formValues.value }).then(() => {
      dialog.value = false
      refTable.value.requestServerInteraction()
    })
  } else {
    operationsStore.createPettyCashCategory({ ...formValues.value }).then(() => {
      dialog.value = false
      refTable.value.requestServerInteraction()
    })
  }
}
const editForm = (props) => {
  formValues.value = { ...props }
  dialog.value = true
}
const deleteForm = (props) => {
  Dialog.create({
    title: i18n.global.t('delete'),
    message: i18n.global.t('deleteMessage', { name: i18n.global.t('pettyCashCategories') }),
    persistent: true,
    focus: 'cancel',
    ok: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('delete'),
      class: 'text-capitalize',
      dataCy: 'delete',
    },
  }).onOk(async () => {
    await operationsStore.deletePettyCashCategory({ id: props.id })
    refTable.value.requestServerInteraction()
  })
}
</script>

<style scoped></style>
