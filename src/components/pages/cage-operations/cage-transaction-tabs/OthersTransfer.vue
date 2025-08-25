<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const cashdeskStore = useCashdeskStore()
const { transactionTypes, getSelectedCashDeskId } = storeToRefs(cashdeskStore)
const emits = defineEmits(['savedCageTransaction', 'cancel'])

const othersTransferTabFormValues = ref({
  cashDeskId: getSelectedCashDeskId.value,
  amount: null,
  transactionCodeId: null,
  transactionType: 'Deposit',
  currencyId: null,
  note: null,
  playerId: null,
  cashdeskTransactionType: 'CageInOut',
  inOut: true,
  authorizedBy: null,
  dueDate: null,
})

const hiddenOthersTransferFields = ref({
  showInOut: false,
  showDueDate: false,
  showAuthorizedBy: false,
})

const onSubmitOthersTransferTabForm = async () => {
  const response = await cashdeskStore.createOthersTransferTransaction(
    othersTransferTabFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
  }
}
const onSelectPlayer = (player) => {
  othersTransferTabFormValues.value.playerId = player.id
}
const onClear = () => {
  othersTransferTabFormValues.value.playerId = null
}
</script>

<template>
  <q-card class="q-card--bordered">
    <q-card-section class="q-pa-none">
      <q-form @submit="onSubmitOthersTransferTabForm" class="col-12 row" ref="form">
        <div class="row col-12">
          <div class="col-4 q-pa-md">
            <q-select
              :label="$t('transactionType')"
              v-model="othersTransferTabFormValues.transactionType"
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
            />
          </div>
          <div class="col-4 q-pa-md">
            <q-select
              :label="$t('currency')"
              v-model="othersTransferTabFormValues.currencyId"
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
            />
          </div>
          <div class="col-4 q-pa-md">
            <q-select-box
              :label="$t('transactionCode')"
              v-model="othersTransferTabFormValues.transactionCodeId"
              :options="getTransactionCodesByGroups(['Others'])"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || $t('requiredField')]"
              data-cy="transactionCodeId"
              behavior="menu"
              hide-bottom-space
            />
          </div>
          <div class="col-4 q-pa-md">
            <q-currency-input
              :label="$t('amount')"
              currency="USD"
              v-model="othersTransferTabFormValues.amount"
              outlined
              dense
              :rules="[(val) => !!val || $t('requiredField')]"
              :precision="2"
              class="super-small"
              data-cy="amount"
            />
          </div>
          <div class="col-4 q-pa-md">
            <q-input
              :label="$t('note')"
              v-model="othersTransferTabFormValues.note"
              outlined
              dense
              clearable
              class="super-small"
              data-cy="note"
            />
          </div>
          <div class="col-4 q-pa-md">
            <search-player-input
              :label="$t('playerName')"
              data-cy="playerId"
              v-model="othersTransferTabFormValues.playerId"
              @onSelectPlayer="onSelectPlayer"
              @onClear="onClear"
            />
          </div>
          <div class="col-4 q-pa-md">
            <q-select
              :label="$t('CashdeskTransactionType')"
              v-model="othersTransferTabFormValues.cashdeskTransactionType"
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
              data-cy="cashdeskTransactionType"
              behavior="menu"
            />
          </div>
          <div class="col-4 q-pa-md" v-if="hiddenOthersTransferFields.showInOut">
            <q-checkbox
              data-cy="inOut"
              v-model="othersTransferTabFormValues.inOut"
              color="deep-purple"
              :label="
                othersTransferTabFormValues.inOut
                  ? $t('inOut') + ' ' + $t('yes')
                  : $t('inOut') + ' ' + $t('no')
              "
              class="super-small"
            />
          </div>
          <div class="col-4 q-pa-md" v-if="hiddenOthersTransferFields.showAuthorizedBy">
            <q-input
              :label="$t('authorizedBy')"
              type="text"
              hide-bottom-space
              outlined
              dense
              v-model="othersTransferTabFormValues.authorizedBy"
              class="super-small"
              :placeholder="othersTransferTabFormValues.authorizedBy || $t('authorizedBy') + '...'"
              clearable
              :rules="[(val) => (val && val.length > 0) || $t('requiredField')]"
              data-cy="authorizedBy"
            />
          </div>
          <div class="col-4 q-pa-md" v-if="hiddenOthersTransferFields.showDueDate">
            <q-input
              :label="$t('dueDateTime')"
              class="super-small"
              outlined
              dense
              v-model="othersTransferTabFormValues.dueDate"
              :rules="[(val) => (val && val.length > 0) || $t('requiredField')]"
              @click="$refs.qDateProxy.show()"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" data-cy="dateBtn">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    ref="qDateProxy"
                  >
                    <q-date
                      v-model="othersTransferTabFormValues.dueDate"
                      mask="YYYY-MM-DD"
                      data-cy="dueDate"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-md flex content-end">
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
              no-caps
              no-wrap
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
