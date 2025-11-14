<script setup>
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useBankAccountStore } from 'src/stores/bank-account-store'
import { priceAbsFormatted } from 'src/helpers/helpers'
const bus = inject('bus')
const emits = defineEmits(['savedCageTransaction', 'cancel'])
import { useQuasar } from 'quasar'
const $q = useQuasar()
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const cashdeskStore = useCashdeskStore()
const { transactionTypes, getSelectedCashDeskId } = storeToRefs(cashdeskStore)

const bankAccountStore = useBankAccountStore()
const { getBankAccountsByCurrencyId } = storeToRefs(bankAccountStore)
const bankTransferTabFormValues = ref({
  cashDeskId: getSelectedCashDeskId.value,
  transactionCodeId: null,
  transactionType: 'Deposit',
  amount: null,
  note: null,
  currencyId: null,
  bankId: null,
  inOut: true,
  cashdeskTransactionType: 'CageInOut',
})

const onSubmitBankTransferTabForm = async () => {
  const response = await cashdeskStore.createBankTransferTransaction(
    bankTransferTabFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    bus.emit('reloadCageBalance')
  }
}

bankAccountStore.fetchBankAccounts()
</script>

<template>
  <div class="col-12">
    <q-card class="q-card--bordered">
      <q-card-section class="q-pa-none">
        <q-form @submit="onSubmitBankTransferTabForm" class="col-12 row" ref="form">
          <div class="full-width py-2 px-2">
            <Information content="Kasadan bankalara yapılan transferler için kullanılacak." />
          </div>
          <div class="flex flex-row gap-3 py-2 px-2 sm:max-w-[800px]">
            <q-select
              :label="$t('transactionType')"
              v-model="bankTransferTabFormValues.transactionType"
              outlined
              dense
              :options="transactionTypes"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              class="super-small fixed-field-width"
              data-cy="transactionType"
              behavior="menu"
            />
            <q-select
              :label="$t('currency')"
              v-model="bankTransferTabFormValues.currencyId"
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
              class="super-small fixed-field-width"
              @update:model-value="bankTransferTabFormValues.bankId = null"
              data-cy="currencyId"
              behavior="menu"
            />
            <q-select
              :label="$t('bank')"
              v-model="bankTransferTabFormValues.bankId"
              outlined
              dense
              :options="getBankAccountsByCurrencyId(bankTransferTabFormValues.currencyId)"
              option-value="id"
              :option-label="(val) => val.name + ' - ' + priceAbsFormatted(val.total)"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              clearable
              class="super-small fixed-field-width"
              data-cy="bankId"
              behavior="menu"
            />
            <q-select-box
              :label="$t('transactionCode')"
              v-model="bankTransferTabFormValues.transactionCodeId"
              :options="getTransactionCodesByGroups(['BankInOut'])"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              class="w-full fixed-field-width"
            />
            <q-currency-input
              :label="$t('amount')"
              currency="USD"
              v-model="bankTransferTabFormValues.amount"
              outlined
              dense
              :rules="[(val) => !!val || $t('requiredField')]"
              :precision="2"
              class="super-small fixed-field-width"
              data-cy="amount"
            />
            <q-input
              :label="$t('note')"
              v-model="bankTransferTabFormValues.note"
              outlined
              dense
              clearable
              class="super-small fixed-field-width"
              data-cy="note"
            />

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
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
