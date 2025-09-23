<script setup>
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
const bus = inject('bus')
const emits = defineEmits(['savedCageTransaction', 'cancel'])
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const cashdeskStore = useCashdeskStore()
const { transactionTypes, getSelectedCashDeskId } = storeToRefs(cashdeskStore)
const $q = useQuasar()
const inOutTabFormValues = ref({
  transactionType: null,
  currencyId: null,
  transactionCodeId: null,
  amount: null,
  note: null,
  cashDeskId: getSelectedCashDeskId.value,
})
const onSubmitInOutTabForm = async () => {
  const response = await cashdeskStore.createInOutTransferTransaction(inOutTabFormValues.value)
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    bus.emit('reloadCageBalance')
    emits('savedCageTransaction')
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
    <q-card-section v-el-perms="'Addon.CageOperations.Tab.InOutCreate'" class="q-pa-none">
      <div class="full-width q-pl-sm q-pr-sm q-mt-sm">
        <Information content="Kasaya işlemleri için kullanılacak." />
      </div>
      <q-form
        @submit="onSubmitInOutTabForm"
        class="col-12 row input-box"
        ref="form"
        style="max-width: 800px"
      >
        <div class="row col-12">
          <div class="col-6 q-pa-md">
            <q-select
              v-model="inOutTabFormValues.transactionType"
              outlined
              dense
              :options="transactionTypes"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              class="super-small"
              data-cy="transactionType"
              behavior="menu"
              :label="$t('transactionType')"
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-select
              v-model="inOutTabFormValues.currencyId"
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
              :options="getTransactionCodesByGroups(['CageInOut'])"
              option-value="id"
              option-label="name"
              v-model="inOutTabFormValues.transactionCodeId"
              :label="$t('transactionCode')"
              :rules="[(val) => !!val || $t('requiredField')]"
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-currency-input
              currency="USD"
              v-model="inOutTabFormValues.amount"
              outlined
              dense
              :rules="[(val) => !!val || $t('requiredField')]"
              :precision="2"
              data-cy="amount"
              :label="$t('amount')"
              hide-bottom-space
            />
          </div>
          <div class="col-6 q-pa-md">
            <q-input
              v-model="inOutTabFormValues.note"
              outlined
              dense
              clearable
              class="super-small"
              data-cy="note"
              :label="$t('note')"
            />
          </div>
          <div class="col-12 q-pa-md flex content-end">
            <q-btn
              size="13px"
              color="negative"
              :label="$t('cancel')"
              icon="cancel"
              type="button"
              unelevated
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
              no-caps
              no-wrap
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
