<script setup>
import { useDialogPluginComponent, format } from 'quasar'
import { ref, inject } from 'vue'
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
const { accountTypes } = playerStore
const { selectedCashDesk } = storeToRefs(cashDeskStore)
const { getTransactionCodesByTransType } = storeToRefs(transactionCodeStore)

const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
  transactionType: {
    type: String,
    required: true,
    default: null,
  },
  account: {
    type: Object,
    required: true,
    default: () => {},
  },
})
const allWithdrawalAmount = ref(0)
const formValues = ref({
  accountId: props.account.accountId,
  playerId: props.playerId,
  currencyId: props.account.currencyId,
  accountType: format.capitalize(props.account.accountType),
  amount: null,
  transactionType: props.transactionType,
  cashdeskId: selectedCashDesk.value.id,
  note: null,
  casinoId: 1,
  transType: null,
  transactionCodeId: null,
  inOut: false,
  ccPos: null,
  ccSlipId: null,
})
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const setAllAmount = async () => {
  await playerStore
    .getPlayerAccountWithdrawalAllAmount({
      playerId: props.playerId,
      currencyId: props.account.currencyId,
      accountId: props.account.accountId,
    })
    .then((res) => {
      allWithdrawalAmount.value = res
    })
}
if (props.transactionType === 'Withdrawal') {
  setAllAmount()
}
const onsubmit = async () => {
  await playerStore.postCashdeskTransaction({ ...formValues.value }).then((res) => {
    if (res) {
      bus.emit('reloadPlayerCashless')
      onDialogOK()
    }
  })
}
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
  formValues.value.transactionCodeId = null
}
const showCcPosAndCcSlipId = ref(false)
</script>
<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" backdrop-filter="brightness(40%)">
    <q-card class="q-dialog-plugin" style="min-width: 800px !important">
      <q-bar
        style="height: 50px"
        :class="formValues.transactionType === 'Deposit' ? 'bg-green-1' : 'bg-red-1'"
      >
        {{
          formValues.transactionType === 'Deposit'
            ? $t('depositTransaction')
            : $t('withdrawTransaction')
        }}
        <q-space />
        <q-chip
          icon="o_info"
          class="q-ml-lg"
          square
          size="md"
          color="orange"
          :label="formValues.accountType"
        />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-primary">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-form @submit="onsubmit">
          <div class="row">
            <div class="col-4 q-pa-xs">
              <q-select
                :label="$t('accountType')"
                autofocus
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                v-model="formValues.accountType"
                :options="accountTypes"
                option-label="name"
                option-value="name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="formValues.accountType || $t('accountType') + '...'"
                clearable
                disable
              />
            </div>
            <div class="col-4 q-pa-xs">
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
                disable
                data-cy="currency"
              />
            </div>
            <!--             <div class="col-6 q-pa-xs">
              <q-select
                :label="$t('transactionCodes.transType')"
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                :options="transTypes"
                option-label="label"
                option-value="value"
                v-model="formValues.transType"
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
              />
            </div> -->
            <div class="col-4 q-pa-xs">
              <q-currency-input
                :label="$t('amount')"
                currency="USD"
                v-model="formValues.amount"
                :rules="
                  transactionType === 'Withdrawal'
                    ? [
                        (val) =>
                          (val &&
                            val.toString().length > 0 &&
                            parseFloat(val) <= parseFloat(allWithdrawalAmount)) ||
                          $t('requiredField'),
                      ]
                    : [(val) => (val && val.toString().length > 0) || $t('requiredField')]
                "
                :placeholder="$t('amount') + '...'"
                clearable
                :hide-bottom-space="true"
                :precision="2"
                :all-amount="transactionType === 'Withdrawal' ? allWithdrawalAmount : null"
                data-cy="amount"
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
                behavior="menu"
                autofocus
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
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
            <div class="col-12 q-pa-xs">
              <q-input
                :label="$t('note')"
                type="textarea"
                rows="2"
                hide-bottom-space
                outlined
                dense
                v-model="formValues.note"
                class="col-12"
                :placeholder="formValues.note || $t('note') + '...'"
                clearable
                data-cy="note"
              />
            </div>
          </div>
          <div class="col-12 q-mt-md text-right">
            <q-btn
              color="negative"
              size="13px"
              class="q-mr-md"
              flat
              :label="$t('cancel')"
              @click="onDialogCancel"
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
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
