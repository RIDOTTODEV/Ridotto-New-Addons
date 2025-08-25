<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref, watch, computed } from 'vue'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { usePlayerStore } from 'src/stores/player-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useBankAccountStore } from 'src/stores/bank-account-store'
import { storeToRefs } from 'pinia'

const cashDeskStore = useCashdeskStore()
const playerStore = usePlayerStore()
const currencyStore = useCurrencyStore()
const transactionStore = useTransactionCodeStore()
const bankAccountStore = useBankAccountStore()
const { currencies } = storeToRefs(currencyStore)
const { selectedCashDesk } = storeToRefs(cashDeskStore)
const { transactionCodes, transTypes } = storeToRefs(transactionStore)
const { selectedPlayer } = storeToRefs(playerStore)
const transactionCodeOptions = ref([])
const transactionTypes = ref([
  {
    label: 'In Out Transaction',
    value: '/PlayerAccount/PostCashdeskPlayerInOutTransaction',
    transactionCodeSearchKey: '',
    transactionTypes: ['PlayerInOut'],
  },
  {
    label: 'Deposit / Credit',
    value: '/CashdeskTransaction/CashdeskDepositCreditTransaction',
    transactionCodeSearchKey: '',
    transactionTypes: ['DepositAndCredit'],
  },
  {
    label: 'Bank Transaction',
    value: '/CashdeskTransaction/CashdeskBankTransaction',
    transactionCodeSearchKey: '',
    transactionTypes: ['BankInOut'],
  },
])
const transactionMethods = ref(['Deposit', 'Withdrawal'])
const getSelectedTransactionByValue = (value) => {
  let obj = transactionTypes.value.find((t) => t.value === value)
  return obj ? obj.transactionTypes : []
}
const filterTransactionCodes = (val, update) => {
  if (transactionCodes.value.length === 0) {
    transactionStore.fetchTransactionCodes()
  }
  if (val === '') {
    update(() => {
      transactionCodeOptions.value = transactionStore.getTransactionCodesByGroups(
        getSelectedTransactionByValue(formValues.value.methodName),
      )
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()

    transactionCodeOptions.value = transactionStore
      .getTransactionCodesByGroups(getSelectedTransactionByValue(formValues.value.methodName))
      .filter((v) => v.name.toLowerCase().indexOf(needle) > -1)
  })
}

const playerId = computed(() => {
  return selectedPlayer.value.player.id
})
const formValues = ref({
  transactionCodeId: null,
  inOut: true,
  authorizedBy: null,
  dueDate: null,
  playerId: playerId.value,
  currencyId: null,
  amount: null,
  transactionType: 'Deposit',
  cashdeskId: selectedCashDesk.value.id,
  note: null,
  methodName: '/PlayerAccount/PostCashdeskPlayerInOutTransaction',
})
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const onsubmit = async () => {
  await playerStore.playerPostCashDeskCashTransaction({ ...formValues.value }).then((res) => {
    if (res) {
      onDialogOK()
    }
  })
}
const showAuthorizedByInput = ref(false)
const showDueDateInput = ref(false)
const showTransactionBanks = ref(false)

watch(
  () => formValues.value.transactionCodeId,
  (val) => {
    if (val) {
      const transactionCode = transactionCodeOptions.value.find((tc) => tc.id === val)
      if (transactionCode) {
        formValues.value.inOut = transactionCode.defaultIsInOut
        showAuthorizedByInput.value = transactionCode.authorizeByRequired
        showDueDateInput.value = transactionCode.dueDateRequired

        // reset form values
        formValues.value.authorizedBy = null
        formValues.value.dueDate = null
      }
    } else {
      formValues.value.inOut = true
    }
  },
  { deep: true },
)

const onSelectTransactionType = (value) => {
  if (value === '/CashdeskTransaction/CashdeskBankTransaction') {
    showTransactionBanks.value = true
    bankAccountStore.fetchBankAccounts()
  } else {
    showTransactionBanks.value = false
    formValues.value.bankId = null
  }
}

// watch the showTransactionBanks value and currencyId value to fetch bank accounts
watch(
  [() => showTransactionBanks.value, () => formValues.value.currencyId],
  ([showTransactionBanks, currencyId]) => {
    if (
      showTransactionBanks &&
      currencyId &&
      formValues.value.methodName === '/CashdeskTransaction/CashdeskBankTransaction'
    ) {
      const banks = bankAccountStore.getBankAccountsByCurrencyId(currencyId)
      if (banks.length > 0) {
        formValues.value.bankId = banks[0].id
      }
    }
  },
)

watch(
  () => formValues.value.methodName,
  (val) => {
    if (val) {
      formValues.value.transactionCodeId = null
      transactionCodeOptions.value = transactionStore.getTransactionCodesByGroups(
        getSelectedTransactionByValue(val.transactionTypes),
      )
    }
  },
)
</script>
<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" backdrop-filter="brightness(40%)">
    <q-card class="q-dialog-plugin" style="min-width: 800px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('createNewCashTransaction') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-form @submit="onsubmit">
          <div class="row">
            <q-option-group
              v-model="formValues.methodName"
              :options="transactionTypes"
              type="radio"
              inline
              color="primary"
              @update:model-value="onSelectTransactionType"
              data-cy="methodName"
            />
          </div>
          <div
            class="full-width q-mb-sm"
            v-if="formValues.methodName === '/PlayerAccount/PostCashdeskPlayerInOutTransaction'"
          >
            <Information
              content="Player’a yapılan tüm transactionlar için kullanılacak(creditcard,deposit,withraw,discount vb..)."
            />
          </div>
          <div
            class="full-width q-mb-sm"
            v-if="formValues.methodName === '/CashdeskTransaction/CashdeskDepositCreditTransaction'"
          >
            <Information
              content="Player’a borç vermek için  veya player’ın parasını kasaya emanet olarak bırakma işlemlerinde kullanılacak"
            />
          </div>
          <div
            class="full-width q-mb-sm"
            v-if="formValues.methodName === '/CashdeskTransaction/CashdeskBankTransaction'"
          >
            <Information
              content="Player’a banka üzerinden yapılan işlemlerde kullanılacak (havale,eft vb..)."
            />
          </div>
          <div class="row">
            <div class="col-4 q-pa-xs">
              <q-select
                :label="$t('transType')"
                v-model="formValues.transType"
                outlined
                dense
                :options="transTypes"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                clearable
                hide-bottom-space
                class="super-small"
                popup-content-class="height-400"
                data-cy="transactionCode"
                behavior="menu"
              />
            </div>
            <div class="col-4 q-pa-xs">
              <q-select
                :label="$t('transactionCode')"
                v-model="formValues.transactionCodeId"
                outlined
                dense
                :options="transactionCodeOptions"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                clearable
                @filter="filterTransactionCodes"
                use-input
                hide-bottom-space
                class="super-small"
                popup-content-class="height-400"
                data-cy="transactionCode"
                behavior="menu"
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
                data-cy="currencyId"
                behavior="menu"
              />
            </div>
            <div class="col-4 q-pa-xs">
              <q-select
                :label="$t('transactionType')"
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                :options="transactionMethods"
                option-label="label"
                option-value="value"
                v-model="formValues.transactionType"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                clearable
                data-cy="transactionType"
                behavior="menu"
              />
            </div>
            <div class="col-3 q-pa-xs text-left">
              <q-checkbox
                v-model="formValues.inOut"
                color="deep-purple"
                :label="
                  formValues.inOut ? $t('inOut') + '-' + $t('yes') : $t('inOut') + '-' + $t('no')
                "
                class="super-small"
                data-cy="inOut"
              />
            </div>
            <div class="col-4 q-pa-xs">
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
            <div class="col-4 q-pa-xs" v-if="showTransactionBanks">
              <q-select
                :label="$t('bankId')"
                hide-bottom-space
                outlined
                dense
                map-options
                emit-value
                :options="bankAccountStore.getBankAccountsByCurrencyId(formValues.currencyId)"
                :option-label="(val) => val.name + ' - ' + val.total"
                option-value="id"
                v-model="formValues.bankId"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                clearable
                data-cy="bankId"
                behavior="menu"
              />
            </div>
            <div class="col-5 q-pa-xs">
              <q-input
                :label="$t('note')"
                type="text"
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

            <div class="col-12 q-pa-sm" v-if="showAuthorizedByInput">
              <q-input
                :label="$t('authorizedBy')"
                type="text"
                hide-bottom-space
                outlined
                dense
                v-model="formValues.authorizedBy"
                class="col-12 super-small"
                :placeholder="formValues.authorizedBy || $t('authorizedBy') + '...'"
                clearable
                :rules="[(val) => (val && val.length > 0) || $t('requiredField')]"
                data-cy="authorizedBy"
              />
            </div>
            <div class="col-12 q-pa-sm" v-if="showDueDateInput">
              <q-input
                :label="$t('dueDateTime')"
                class="super-small"
                outlined
                dense
                v-model="formValues.dueDate"
                :rules="[(val) => (val && val.length > 0) || $t('requiredField')]"
                @click="$refs.qDateProxy.show()"
                data-cy="dateBtn"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                      ref="qDateProxy"
                    >
                      <q-date v-model="formValues.dueDate" mask="YYYY-MM-DD" data-cy="dueDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
            />
            <q-btn
              data-cy="submit"
              type="submit"
              size="13px"
              color="primary"
              unelevated
              :label="$t('save')"
              icon="save"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-datetime-picker .block:last-child {
  border-right: none;
}

.demo-datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
