<script setup>
import { defineAsyncComponent, defineProps } from 'vue'
import { useQuasar } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
import { useCurrencyStore } from 'src/stores/currency-store'
const currencyStore = useCurrencyStore()
const { getCurrencyById } = currencyStore
const $q = useQuasar()
const props = defineProps({
  account: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  playerId: {
    type: Number,
    required: false,
    default: () => null,
  },
})

const onClickPlayerTransaction = (transactionType, account) => {
  $q.dialog({
    component: defineAsyncComponent(
      () =>
        import(
          'src/components/pages/player-operations/cashless-account/AccountTransactionDialog.vue'
        ),
    ),
    componentProps: {
      playerId: props.playerId,
      transactionType,
      account,
    },
  })
}
const onClickAccountHistory = (account) => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/player-operations/cashless-account/AccountHistory.vue'),
    ),
    componentProps: {
      playerAccountId: account.accountId,
    },
  })
}
</script>

<template>
  <div class="col-md-4 col-sm-12 col-xs-12 q-pt-xs q-pb-xs q-pr-xs">
    <q-intersection transition="scale" class="example-item">
      <q-expansion-item
        expand-separator
        icon="account_balance_wallet"
        class="q-card account-card q-card-square"
        switch-toggle-side
        hide-expand-icon
        header-class="app-card q-pa-xs"
        default-opened
        square
      >
        <template v-slot:header>
          <div class="col-12 flex justify-between no-wrap content-center items-center">
            <div class="text-subtitle2">
              {{ account.accountName }}
            </div>
            <span
              class="q-ml-md text-subtitle2 flex no-wrap content-center items-center"
              :data-cy="'AccountBalance-' + account.accountId"
            >
              {{ formatPrice(account.accountBalance) }}
              <q-badge
                v-if="currencyStore.currencies.length > 0"
                color="lime"
                class="text-dark q-ml-sm"
                align="top"
                :label="getCurrencyById(account.currencyId).symbol"
              />
            </span>
          </div>
        </template>
        <q-separator />
        <q-card square>
          <q-card-section class="row q-pl-sm q-pr-sm q-pt-sm q-pb-sm">
            <q-badge
              floating
              color="blue-grey-8"
              :label="account.accountType"
              class="text-capitalize"
              style="margin-right: 3px !important"
            />
            <div class="text-subtitle2">
              {{ $t('totalIn') }}:
              <span class="q-ml-sm"> {{ formatPrice(account.totalIn) }}</span>
            </div>
            <div class="text-subtitle2 full-width">
              {{ $t('totalOut') }}:
              <span class="q-ml-sm"> {{ formatPrice(account.totalOut) }}</span>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none row">
            <q-btn
              label="Deposit"
              unelevated
              :color="$q.dark.isActive ? 'blue-grey-8' : 'green-1'"
              text-color="green-8"
              no-caps
              class="col-4"
              square
              size="13px"
              @click="onClickPlayerTransaction('Deposit', account)"
              v-el-perms="'Addon.CashlessOperations.Transaction.CreateDeposit'"
              :data-cy="'Deposit-' + account.accountId"
            />
            <q-btn
              label="Withdraw"
              unelevated
              :color="$q.dark.isActive ? 'blue-grey-8' : 'red-1'"
              text-color="red-8"
              no-caps
              class="col-4"
              square
              size="13px"
              @click="onClickPlayerTransaction('Withdrawal', account)"
              v-el-perms="'Addon.CashlessOperations.Transaction.CreateWithdrawal'"
              :data-cy="'Withdraw-' + account.accountId"
            />
            <q-btn
              label="History"
              unelevated
              :color="$q.dark.isActive ? 'blue-grey-8' : 'grey-1'"
              text-color="grey-8"
              no-caps
              class="col-4"
              square
              size="13px"
              @click="onClickAccountHistory(account)"
              v-el-perms="'Addon.CashlessOperations.Transaction.ShowAccountHistory'"
              :data-cy="'History-' + account.accountId"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-intersection>
  </div>
</template>

<style scoped lang="scss">
.account-card .q-expansion-item__container .q-item {
  height: 30px !important;
}
</style>
