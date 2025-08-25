<script setup>
import { ref } from 'vue'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const cashDeskStore = useCashdeskStore()
const { getSelectedCashDeskId, transactionTypes } = storeToRefs(cashDeskStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)

const cashDeskPlayerChipTransferTabFormValues = ref({
  cashdeskId: +getSelectedCashDeskId.value,
  playerId: null,
  currencyId: null,
  amount: null,
  transactionCodeId: null,
  transType: null,
  chips: [],
  transactionType: 'Withdrawal',
  note: null,
  inOut: false,
})

const onSubmitCashDeskPlayerChipTransferTabForm = async () => {
  const response = await cashDeskStore.createInOutTransferTransaction(
    cashDeskPlayerChipTransferTabFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    setTimeout(() => {
      emits('savedCageChipTransaction')
    }, 1000)
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
const emits = defineEmits(['savedCageChipTransaction', 'cancel'])
</script>

<template>
  <div class="col-12">
    <q-form
      @submit="onSubmitCashDeskPlayerChipTransferTabForm(null)"
      class="q-card--bordered"
      ref="form"
    >
      <div class="row">
        <div class="full-width col-12 q-pa-sm">
          <Information content="Player’a yapılan çip işlemlerinde kullanılacak." />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
          <div class="row q-mt-lg">
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select
                :label="$t('currency')"
                v-model="cashDeskPlayerChipTransferTabFormValues.currencyId"
                outlined
                dense
                :options="currencies"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
                data-cy="currencyId"
                behavior="menu"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select
                :label="$t('transactionType')"
                v-model="cashDeskPlayerChipTransferTabFormValues.transactionType"
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
                data-cy="toCashdeskId"
                behavior="menu"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select
                :label="$t('transactionCode')"
                v-model="cashDeskPlayerChipTransferTabFormValues.transactionCodeId"
                outlined
                dense
                :options="getTransactionCodesByGroups(['CageInOut'])"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                clearable
                class="super-small"
                popup-content-class="height-400"
                data-cy="transactionCodeId"
                behavior="menu"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-input
                :label="$t('playerTransaction.playerId')"
                v-model="cashDeskPlayerChipTransferTabFormValues.playerId"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="playerId"
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-currency-input
                :label="$t('amount')"
                currency="TRY"
                :custom-rules="[(val) => !!val || $t('requiredField')]"
                v-model="cashDeskPlayerChipTransferTabFormValues.amount"
                class="super-small"
                data-cy="amount"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-input
                :label="$t('note')"
                v-model="cashDeskPlayerChipTransferTabFormValues.note"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="note"
              />
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-toggle
                v-model="cashDeskPlayerChipTransferTabFormValues.inOut"
                color="primary"
                dense
                data-cy="isInOut"
                style="margin-top: 10px"
                class="q-ml-sm"
                :label="$t('isInOut')"
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
        <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
          <chip-grid
            v-model="cashDeskPlayerChipTransferTabFormValues.chips"
            class="full-width q-pa-xs"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<style scoped lang="scss"></style>
