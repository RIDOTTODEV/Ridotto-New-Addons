<template>
  <div class="row full-width">
    <div class="col-5 q-pa-xs">
      <q-form @submit="onSubmitPlayerChipTransaction" class="col-12 row q-card--bordered bg-white">
        <div class="col-12 q-mt-sm q-mb-sm">
          <q-btn
            v-if="!createPlayerChipTransaction"
            size="13px"
            :color="
              playerChipTransactionFormValues.transactionType === 'Withdrawal' ? 'red-5' : 'grey-2'
            "
            :text-color="
              playerChipTransactionFormValues.transactionType === 'Withdrawal' ? 'white' : 'dark'
            "
            :label="createPlayerChipTransaction ? $t('back') : $t('buyChipFromPlayer')"
            :icon="createPlayerChipTransaction ? 'arrow_back' : 'remove_circle_outline'"
            type="button"
            unelevated
            no-caps
            class="q-ml-sm"
            @click="
              () => {
                playerChipTransactionFormValues.transactionType = 'Withdrawal'
              }
            "
            v-el-perms="'Addon.CageOperations.Tab.CashDeskTransferCreate'"
          />
          <q-btn
            v-if="!createPlayerChipTransaction"
            size="13px"
            :color="
              playerChipTransactionFormValues.transactionType === 'Deposit' ? 'green-5' : 'grey-2'
            "
            :text-color="
              playerChipTransactionFormValues.transactionType === 'Deposit' ? 'white' : 'dark'
            "
            :label="createPlayerChipTransaction ? $t('back') : $t('sellChipToPlayer')"
            :icon="createPlayerChipTransaction ? 'arrow_back' : 'add_circle_outline'"
            type="button"
            unelevated
            no-caps
            class="q-ml-sm"
            @click="
              () => {
                playerChipTransactionFormValues.transactionType = 'Deposit'
              }
            "
            v-el-perms="'Addon.CageOperations.Tab.CashDeskTransferCreate'"
          />
        </div>
        <div class="col-12">
          <div class="row q-pl-xs q-pr-xs q-mt-none q-mb-md">
            <fieldset
              class="full-width row"
              :class="
                playerChipTransactionFormValues.transactionType === 'Deposit'
                  ? 'bg-green-1'
                  : 'bg-red-1'
              "
            >
              <div class="q-pa-sm col-4">
                <q-select
                  :label="$t('currency')"
                  v-model="playerChipTransactionFormValues.currencyId"
                  outlined
                  dense
                  :options="getCurrenciesByIds(playerChipTransactionCurrencyIds)"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('requiredField')]"
                  hide-bottom-space
                  class="super-small"
                  data-cy="currencyId"
                  behavior="menu"
                  bg-color="white"
                  :readonly="getCurrenciesByIds(playerChipTransactionCurrencyIds).length === 1"
                />
              </div>
              <div class="q-pa-sm col-8">
                <q-select-box
                  :label="$t('transactionCode')"
                  v-model="playerChipTransactionFormValues.transactionCodeId"
                  :options="getTransactionCodesByTransType()"
                  option-value="id"
                  option-label="name"
                  @update:model-value="onChangePlayerChipTransactionTransactionCode"
                  bg-color="white"
                />
              </div>

              <div class="q-pa-sm col-4">
                <q-currency-input
                  :label="$t('amount')"
                  currency="TRY"
                  :custom-rules="[(val) => !!val || $t('requiredField')]"
                  v-model="playerChipTransactionFormValues.amount"
                  class="super-small"
                  data-cy="amount"
                  bg-color="white"
                />
              </div>
              <div class="q-pa-sm col-4">
                <q-input
                  :label="$t('note')"
                  v-model="playerChipTransactionFormValues.note"
                  outlined
                  dense
                  clearable
                  class="super-small"
                  data-cy="note"
                  bg-color="white"
                />
              </div>
              <div class="q-pa-sm col-4">
                <q-toggle
                  v-model="playerChipTransactionFormValues.inOut"
                  color="primary"
                  dense
                  data-cy="isInOut"
                  style="margin-top: 10px"
                  class="q-ml-sm"
                  :label="$t('isInOut')"
                  bg-color="white"
                />
              </div>
              <div class="q-pa-sm col-6" v-if="showCcPosAndCcSlipId">
                <q-input
                  :label="$t('ccPos')"
                  v-model="playerChipTransactionFormValues.ccPos"
                  outlined
                  dense
                  clearable
                  class="super-small"
                  data-cy="ccPos"
                  bg-color="white"
                />
              </div>
              <div class="q-pa-sm col-6" v-if="showCcPosAndCcSlipId">
                <q-input
                  :label="$t('ccSlipId')"
                  v-model="playerChipTransactionFormValues.ccSlipId"
                  outlined
                  dense
                  clearable
                  class="super-small"
                  data-cy="ccSlipId"
                  bg-color="white"
                />
              </div>
              <div class="q-pa-sm col-12">
                <chip-grid
                  v-model="playerChipTransactionFormValues.chips"
                  class="full-width bg-transparent"
                  @init-chips="initPlayerChipTransactionChips"
                />
              </div>
              <div class="q-pa-sm col-12 flex justify-start">
                <q-btn
                  size="12px"
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
            </fieldset>
          </div>
        </div>
      </q-form>
    </div>
    <div class="col-7 q-pa-xs">
      <LastChipTransaction
        :player-id="playerId"
        v-if="selectedPlayer"
        class="q-mb-md"
        ref="lastChipTransactionRef"
      />
      <LastCageTransaction
        :player-id="playerId"
        v-if="selectedPlayer"
        ref="lastCageTransactionRef"
      />
    </div>
  </div>
</template>

<script setup>
import LastCageTransaction from 'src/components/pages/player-operations/transactions/LastCageTransaction.vue'
import LastChipTransaction from 'src/components/pages/player-operations/transactions/LastChipTransaction.vue'
import { usePlayer } from 'src/composables/player-operations/usePlayer'
import { useTransactionCode } from 'src/composables/definitions/useTransactionCode'
import { useCurrencies } from 'src/composables/definitions/useCurrencies'
const {
  selectedPlayer,
  createPlayerChipTransaction,
  playerChipTransactionFormValues,
  onSubmitPlayerChipTransaction,
  playerChipTransactionCurrencyIds,
  initPlayerChipTransactionChips,
  lastChipTransactionRef,
  lastCageTransactionRef,
  playerId,
  showCcPosAndCcSlipId,
} = usePlayer()
const { getTransactionCodesByTransType } = useTransactionCode()
const { getCurrenciesByIds } = useCurrencies()

const onChangePlayerChipTransactionTransactionCode = () => {
  if (!playerChipTransactionFormValues.value.transactionCodeId) {
    showCcPosAndCcSlipId.value = false
    playerChipTransactionFormValues.value.ccPos = null
    playerChipTransactionFormValues.value.ccSlipId = null
    return
  }
  const transactionCode = getTransactionCodesByTransType
    .value()
    .find((item) => item.id === playerChipTransactionFormValues.value.transactionCodeId)
  if (transactionCode.transType === 'CreditCard') {
    showCcPosAndCcSlipId.value = true
  } else {
    showCcPosAndCcSlipId.value = false
  }
  playerChipTransactionFormValues.value.inOut = transactionCode?.defaultIsInOut || false
}
</script>

<style scoped></style>
