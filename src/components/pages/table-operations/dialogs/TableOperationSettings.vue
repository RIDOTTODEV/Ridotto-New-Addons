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
          {{ $t('tableOperationsSettings') }}
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
            />
          </div>
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              {{ $t('cashTransactionCode') }}
            </div>
            <q-select-box
              v-model="settings.CashTransactionCodeId"
              :options="transactionCodes"
              outlined
              dense
              option-label="name"
              option-value="id"
            />
          </div>
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              {{ $t('plaqueTransactionCode') }}
            </div>
            <q-select-box
              v-model="settings.PlaqueTransactionCodeId"
              :options="transactionCodes"
              outlined
              dense
              option-label="name"
              option-value="id"
            />
          </div>
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              {{ $t('cashdesk') }}
            </div>
            <q-select-box
              v-model="settings.CashdeskId"
              :options="cashdesks"
              outlined
              dense
              option-label="name"
              option-value="id"
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
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

const tableStore = useTableStore()
const transactionCodeStore = useTransactionCodeStore()
const cashdeskStore = useCashdeskStore()
const { transactionCodes } = storeToRefs(transactionCodeStore)
const { cashdesks } = storeToRefs(cashdeskStore)

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const settings = ref({
  transactionCodeId: null,
  CashTransactionCodeId: null,
  CashdeskId: null,
  PlaqueTransactionCodeId: null,
})

function onOKClick() {
  onDialogOK()
}

const onSubmit = async () => {
  const response = await tableStore.updateTableOperationsSettings({ ...settings.value })
  if (response) {
    onOKClick()
  }
}

onMounted(async () => {
  const response = await tableStore.getTableOperationsSettings()
  settings.value = response.data?.value ? JSON.parse(response.data.value) : {}
})
</script>

<style scoped lang="scss"></style>
