<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref, watch, inject } from 'vue'

import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { usePlayerStore } from 'src/stores/player-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { storeToRefs } from 'pinia'

const cashDeskStore = useCashdeskStore()
const playerStore = usePlayerStore()
const currencyStore = useCurrencyStore()
const transactionCodeStore = useTransactionCodeStore()
const bus = inject('bus')
const { currencies } = storeToRefs(currencyStore)
const { getAccountTypesForPlayer } = playerStore
const { selectedCashDesk } = storeToRefs(cashDeskStore)
const { getTransactionCodesByTransType } = storeToRefs(transactionCodeStore)

const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
})
const formValues = ref({
  accountId: null,
  playerId: props.playerId,
  currencyId: null,
  accountType: null,
  amount: null,
  transactionType: 'deposit',
  cashdeskId: selectedCashDesk.value.id,
  note: null,
  name: null,
  casinoId: 1,
  transType: null,
  transactionCodeId: null,
  inOut: false,
  ccPos: null,
  ccSlipId: null,
})
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const onsubmit = async () => {
  await playerStore.postCashdeskTransaction({ ...formValues.value }).then((res) => {
    if (res) {
      bus.emit('reloadCashlessTransactions')
      onDialogOK()
    }
  })
}

watch(
  () => formValues.value,
  (val) => {
    if (val && formValues.value.transactionType === 'create') {
      const currency = val.currencyId
        ? currencies.value.find((c) => +c.id === +val.currencyId)
        : null
      if (currency && val.accountType) {
        formValues.value.name = `${val.accountType} ${currency.name}`
      } else {
        formValues.value.name = null
      }
    }
  },
  { deep: true },
)

const onChangeTransactionCode = (val) => {
  if (!val) {
    return
  }
  const transactionCode = getTransactionCodesByTransType
    .value()
    .find((item) => item.id === formValues.value.transactionCodeId)
  formValues.value.inOut = transactionCode.defaultIsInOut || false
  if (transactionCode.transType === 'CreditCard') {
    showCcPosAndCcSlipId.value = true
  } else {
    showCcPosAndCcSlipId.value = false
  }
}
const onClearTransactionCode = () => {
  formValues.value.inOut = false
  formValues.value.ccPos = null
  formValues.value.ccSlipId = null
  showCcPosAndCcSlipId.value = false
}
const showCcPosAndCcSlipId = ref(false)
</script>
<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" backdrop-filter="brightness(40%)">
    <q-card class="q-dialog-plugin" style="min-width: 700px !important">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('addAccount') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle2 text-bold bg-grey-1 text-dark">{{
            $t('close')
          }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-form @submit="onsubmit">
          <div class="row">
            <div class="col-6 q-pa-xs">
              <q-select
                :label="$t('accountType')"
                autofocus
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                v-model="formValues.accountType"
                :options="getAccountTypesForPlayer"
                option-label="name"
                option-value="name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="formValues.accountType || $t('accountType') + '...'"
                clearable
                data-cy="accountType"
                behavior="menu"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select
                :label="$t('currency')"
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                :options="currencies"
                option-label="name"
                option-value="id"
                v-model="formValues.currencyId"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="formValues.currencyId || $t('currency') + '...'"
                clearable
                data-cy="currencyId"
                behavior="menu"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select-box
                :label="$t('transactionCode')"
                :options="getTransactionCodesByTransType()"
                option-label="name"
                option-value="id"
                v-model="formValues.transactionCodeId"
                @update:model-value="onChangeTransactionCode"
                @clear="onClearTransactionCode"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-currency-input
                :label="$t('amount')"
                currency="USD"
                v-model="formValues.amount"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="$t('amount') + '...'"
                clearable
                :hide-bottom-space="true"
                :precision="2"
                data-cy="amount"
              />
            </div>
            <div class="col-6 q-pa-xs" v-if="showCcPosAndCcSlipId">
              <q-input
                :label="$t('ccPos')"
                v-model="formValues.ccPos"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="ccPos"
                bg-color="white"
              />
            </div>
            <div class="col-6 q-pa-xs" v-if="showCcPosAndCcSlipId">
              <q-input
                :label="$t('ccSlipId')"
                v-model="formValues.ccSlipId"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="ccSlipId"
                bg-color="white"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-input
                :label="$t('note')"
                type="textarea"
                rows="2"
                hide-bottom-space
                outlined
                dense
                v-model="formValues.note"
                class="col-12 super-small"
                :placeholder="formValues.note || $t('note') + '...'"
                clearable
                data-cy="note"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-toggle
                v-model="formValues.inOut"
                color="primary"
                dense
                data-cy="isInOut"
                style="margin-top: 10px"
                class="q-ml-sm"
                :label="$t('isInOut')"
                bg-color="white"
              />
            </div>

            <!--             <div class="col-6 q-pa-xs">
              <q-select
                :label="$t('transactionCodes.transType')"
                autofocus
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                v-model="formValues.transType"
                :options="transTypes"
                option-label="label"
                option-value="value"
                class="col-12 super-small"
                :rules="[
                  (val) =>
                    (val && val.toString().length > 0) ||
                    $t('requiredField'),
                ]"
                :placeholder="
                  formValues.transType ||
                  $t('transactionCodes.transType') + '...'
                "
                clearable
                data-cy="transType"
                behavior="menu"
              />
            </div> -->
          </div>

          <div class="col-12 q-mt-md text-right">
            <q-btn
              color="negative"
              size="13px"
              class="q-mr-md"
              flat
              :label="$t('cancel')"
              @click="onDialogCancel"
              no-wrap
              no-caps
            />
            <q-btn
              data-cy="submit"
              type="submit"
              size="13px"
              color="primary"
              unelevated
              :label="$t('save')"
              icon="save"
              no-wrap
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
