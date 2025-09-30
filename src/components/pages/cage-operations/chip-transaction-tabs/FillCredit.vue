<script setup>
import { ref, inject } from 'vue'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useTableStore } from 'src/stores/table-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
const bus = inject('bus')
const $q = useQuasar()
const cashDeskStore = useCashdeskStore()
const { getSelectedCashDeskId, transactionTypesForFillCredit } = storeToRefs(cashDeskStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const tableStore = useTableStore()
const { tables } = storeToRefs(tableStore)
const cashDeskFillCreditFormValues = ref({
  cashdeskId: +getSelectedCashDeskId.value,
  tableId: null,
  amount: null,
  transactionCodeId: null,
  chipInfos: [],
  transactionType: 'withdrawal',
  note: null,
})

const onSubmitCashDeskFillCreditForm = async () => {
  const response = await cashDeskStore.cashdeskTableFillCreditTransaction(
    cashDeskFillCreditFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    setTimeout(() => {
      emits('savedCageChipTransaction')
      bus.emit('reloadCageBalance')
    }, 1000)
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
const emits = defineEmits(['savedCageChipTransaction', 'cancel'])

tableStore.fetchTables()

const tableChipCurrencyId = ref(null)

const onSelectTable = (tableId) => {
  tableChipCurrencyId.value = tables.value.find((table) => table.id === tableId)?.chipCurrencyId
}
</script>

<template>
  <div class="col-12">
    <q-form @submit="onSubmitCashDeskFillCreditForm" class="q-card--bordered" ref="form">
      <div class="row">
        <div class="full-width col-12 q-pa-sm">
          <Information
            content="Kasadan masadaki table float’a yapılan çip işlemleri(deposit , withdraw) için kullanılacak."
          />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
          <div class="row q-mt-lg">
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select-box
                :label="$t('table')"
                v-model="cashDeskFillCreditFormValues.tableId"
                :options="tables"
                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                @update:model-value="onSelectTable"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select
                :label="$t('transactionType')"
                v-model="cashDeskFillCreditFormValues.transactionType"
                outlined
                dense
                :options="transactionTypesForFillCredit"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
                data-cy="toCashdeskId"
                behavior="menu"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select-box
                :label="$t('transactionCode')"
                v-model="cashDeskFillCreditFormValues.transactionCodeId"
                :options="getTransactionCodesByGroups(['FillCredit'])"
                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || $t('requiredField')]"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-currency-input
                :label="$t('amount')"
                currency="TRY"
                :custom-rules="[(val) => !!val || $t('requiredField')]"
                v-model="cashDeskFillCreditFormValues.amount"
                class="super-small"
                data-cy="amount"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-input
                :label="$t('note')"
                v-model="cashDeskFillCreditFormValues.note"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="note"
              />
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 q-pa-sm flex content-end justify-start">
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
                class=""
                no-caps
                no-wrap
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
          <chip-grid
            v-model="cashDeskFillCreditFormValues.chipInfos"
            :chipCurrencyId="tableChipCurrencyId"
            class="full-width q-pa-xs"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<style scoped lang="scss"></style>
