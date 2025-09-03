<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    square
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 600px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          <q-icon name="o_settings" class="q-mr-sm" />
          {{ $t('tableCountStableSettings') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              {{ $t('transactionCode') }}
            </div>
            <q-select-box
              v-model="settings.transactionCodeId"
              :options="transactionCodes"
              outlined
              dense
              option-label="name"
              option-value="id"
              :rules="[(val) => !!val || $t('requiredField')]"
            />
          </div>

          <div class="row q-mt-lg">
            <q-space />
            <q-btn
              flat
              color="grey"
              :label="$t('cancel')"
              class="q-mr-sm"
              type="button"
              no-caps
              @click="onDialogCancel"
            />
            <q-btn
              type="submit"
              color="primary"
              :label="$t('save')"
              unelevated
              icon="save"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { useTableStore } from 'src/stores/table-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

const tableStore = useTableStore()
const transactionCodeStore = useTransactionCodeStore()
const { transactionCodes } = storeToRefs(transactionCodeStore)

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const settings = ref({
  transactionCodeId: null,
})

function onOKClick() {
  onDialogOK()
}

const onSubmit = async () => {
  const response = await tableStore.updateTableCountFormStableSettings({ ...settings.value })
  if (response) {
    onOKClick()
  }
}

onMounted(async () => {
  const response = await tableStore.getTableCountFormStableSettings()
  settings.value = response.data?.value ? JSON.parse(response.data.value) : {}
})
</script>

<style scoped lang="scss"></style>
