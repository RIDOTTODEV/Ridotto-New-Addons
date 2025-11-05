<script setup>
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
const bus = inject('bus')
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const cashdeskStore = useCashdeskStore()
const { cashdesks, getSelectedCashDeskId } = storeToRefs(cashdeskStore)
const $q = useQuasar()
const cashDeskTransferTabFormValues = ref({
  fromCashdeskId: getSelectedCashDeskId.value,
  toCashdeskId: null,
  currencyId: null,
  transactionCodeId: null,
  amount: null,
  note: null,
})
const emits = defineEmits(['savedCageTransaction', 'cancel'])
const onSubmitCashDeskTransferTabForm = async () => {
  const response = await cashdeskStore.createCashDeskTransferTransaction(
    cashDeskTransferTabFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    setTimeout(() => {
      emits('savedCageTransaction')
      bus.emit('reloadCageBalance')
    }, 1000)
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
</script>

<template>
  <q-card class="q-card--bordered">
    <q-card-section class="q-pa-none">
      <div class="full-width q-pl-sm q-pr-sm q-mt-sm">
        <Information content="Kasalar arası nakit transferleri  için kullanılacak." />
      </div>
      <q-form
        @submit="onSubmitCashDeskTransferTabForm"
        class="col-12 row"
        ref="form"
        style="max-width: 800px"
      >
        <div class="row col-12">
          <div class="col-6 q-pa-md">
            <q-select
              v-model="cashDeskTransferTabFormValues.fromCashdeskId"
              outlined
              dense
              :options="cashdesks"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              disable
              class="super-small"
              data-cy="fromCashDeskId"
              behavior="menu"
              :label="$t('fromCashDesk')"
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-select
              v-model="cashDeskTransferTabFormValues.toCashdeskId"
              outlined
              dense
              :options="cashdesks"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              :option-disable="(val) => val.id === cashDeskTransferTabFormValues.fromCashdeskId"
              class="super-small"
              data-cy="toCashdeskId"
              behavior="menu"
              :label="$t('toCashDesk')"
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-select
              v-model="cashDeskTransferTabFormValues.currencyId"
              outlined
              dense
              :options="currencies"
              option-value="id"
              :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              clearable
              class="super-small"
              data-cy="currencyId"
              behavior="menu"
              :label="$t('currency')"
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-select-box
              :options="getTransactionCodesByGroups(['Transfer'])"
              option-value="id"
              option-label="name"
              v-model="cashDeskTransferTabFormValues.transactionCodeId"
              :label="$t('transactionCode')"
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-currency-input
              currency="USD"
              v-model="cashDeskTransferTabFormValues.amount"
              outlined
              dense
              :rules="[(val) => !!val || $t('requiredField')]"
              :precision="2"
              class="super-small"
              data-cy="amount"
              :label="$t('amount')"
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-input
              v-model="cashDeskTransferTabFormValues.note"
              outlined
              dense
              clearable
              class="super-small"
              data-cy="note"
              :label="$t('note')"
            />
          </div>
          <div class="col-6 q-pa-md flex content-end">
            <q-btn
              size="13px"
              color="negative"
              :label="$t('cancel')"
              icon="cancel"
              type="button"
              unelevated
              data-cy="submit"
              no-wrap
              no-caps
              class="q-mr-sm"
              @click="emits('cancel')"
            />
            <q-btn
              size="13px"
              color="primary"
              :label="$t('save')"
              icon="save"
              type="submit"
              unelevated
              data-cy="submit"
              no-wrap
              no-caps
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
