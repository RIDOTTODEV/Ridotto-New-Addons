<template>
  <q-card class="bg-transparent">
    <q-card-section class="q-pa-none q-mb-xs">
      <div class="row">
        <div class="col-md-8 col-sm-12 col-xs-12 flex content-center">
          <div class="text-subtitle1">
            {{ $t('cageTransactions') }}
          </div>
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12 text-right flex content-center justify-end">
          <q-btn
            :label="$t('create')"
            class="q-mr-sm"
            color="blue-grey-8"
            text-color="white"
            unelevated
            no-caps
            @click="createNewTransaction = true"
            :disable="createNewTransaction"
          />
        </div>
      </div>
    </q-card-section>
    <transition name="slide-fade" mode="out-in">
      <q-card-section class="q-pa-none" v-if="createNewTransaction">
        <div class="row">
          <q-tabs
            v-model="currentCageTransactionTab"
            @update:model-value="onChangeCageTransactionTab"
            dense
            class="text-dark"
            active-color="blue-grey-8"
            indicator-color="blue-grey-8"
            active-bg-color="white"
            align="justify"
            narrow-indicator
            no-caps
            inline-label
          >
            <q-tab
              v-for="(tab, index) in cageTransactionTabs"
              :key="index"
              :v-el-perms="tab.elPermission"
              no-caps
              :name="tab.name"
              :label="$t(tab.label)"
              :icon="tab.icon"
              class="bg-white q-card--bordered"
              :class="index === 0 ? '' : 'q-ml-sm'"
            />
          </q-tabs>
        </div>
        <q-tab-panels v-model="currentCageTransactionTab" class="q-mt-sm full-height" swipeable>
          <q-tab-panel
            v-el-perms="'Addon.CageTransactions.Tab.InOut'"
            name="inOutTransfer"
            class="q-card no-box-shadow q-pa-none"
          >
            <in-out-transfer
              @savedCageTransaction="onSavedCageTransaction"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageTransactions.Tab.CashDeskTransfer'"
            name="cashDeskTransfer"
            class="q-card no-box-shadow q-pa-none"
          >
            <cash-desk-transfer
              @savedCageTransaction="onSavedCageTransaction"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageTransactions.Tab.Exchange'"
            name="exchange"
            class="q-card q-pa-none no-box-shadow"
          >
            <exchange-transfer
              @savedCageTransaction="onSavedCageTransaction"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageTransactions.Tab.OtherTransfer'"
            name="otherTransfer"
            class="q-card no-box-shadow q-pa-none"
          >
            <others-transfer
              @savedCageTransaction="onSavedCageTransaction"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageTransactions.Tab.BankTransfer'"
            name="bankTransfer"
            class="q-card q-pa-none no-box-shadow"
          >
            <bank-transfer
              @savedCageTransaction="onSavedCageTransaction"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-section class="q-pa-none" v-else>
        <div>
          <q-card
            class="no-box-shadow q-mb-md"
            v-if="cageTransactionsTable?.response?.totals?.length > 0 && showSummaryCard === false"
          >
            <q-card-section class="q-pa-none">
              <q-markup-table dense separator="cell" bordered class="no-box-shadow" square>
                <thead>
                  <tr>
                    <th class="text-center">Currency</th>
                    <th class="text-center">Deposit</th>
                    <th class="text-center">Withdrawal</th>
                    <th class="text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(total, index) in cageTransactionsTable?.response?.totals"
                    :key="index"
                  >
                    <td class="text-center">{{ total.currencyName }}</td>
                    <td class="text-center">{{ priceAbsFormatted(total.deposit) }}</td>
                    <td class="text-center">{{ priceAbsFormatted(total.withdrawal) }}</td>
                    <td class="text-center">{{ priceAbsFormatted(total.result) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
          <div
            class="row"
            v-if="cageTransactionsTable?.response?.totals?.length > 0 && showSummaryCard === true"
          >
            <div
              class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto text-center q-pa-xs items-center justify-center md:min-w-[25%]"
              v-for="total in cageTransactionsTable?.response?.totals"
              :key="total.currencyName"
            >
              <q-card flat class="app-cart-grey w-full">
                <q-card-section class="q-pa-none">
                  <div class="text-h6">
                    {{ total.currencyName }}
                  </div>
                  <div class="row">
                    <div class="col-4">
                      <div class="text-caption">{{ $t('withdrawal') }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption">{{ $t('deposit') }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption">{{ $t('result') }}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-4">
                      <div
                        :class="{
                          'text-green-8': total.withdrawal > 0,
                          'text-negative': total.withdrawal < 0,
                          'text-subtitle2': cageTransactionsTable?.response?.totals.length > 2,
                          'text-h6': cageTransactionsTable?.response?.totals.length <= 2,
                        }"
                      >
                        {{ priceAbsFormatted(total.withdrawal) }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div
                        :class="{
                          'text-green-8': total.deposit > 0,
                          'text-negative': total.deposit < 0,
                          'text-subtitle2': cageTransactionsTable?.response?.totals.length > 2,
                          'text-h6': cageTransactionsTable?.response?.totals.length <= 2,
                        }"
                      >
                        {{ priceAbsFormatted(total.deposit) }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div
                        :class="{
                          'text-green-8': total.result > 0,
                          'text-negative': total.result < 0,
                          'text-subtitle2': cageTransactionsTable?.response?.totals.length > 2,
                          'text-h6': cageTransactionsTable?.response?.totals.length <= 2,
                        }"
                      >
                        {{ priceAbsFormatted(total.result) }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="q-pa-xs">
          <SupaTable
            :columns="columns"
            :getDataFn="cashdeskStore.fetchCashdeskTransactions"
            :rowsPerPage="10"
            tableName="cageTransactionsColumns"
            :filterParams="filterFields"
            :slotNames="['body-cell-actions']"
            ref="cageTransactionsTable"
            :useCol12="true"
            :hideFields="{
              showVisibleColumns: true,
              showReloadButton: true,
              showScreenModeButton: true,
              showSearchInput: true,
              useCol12: false,
              switchSummaryCard: true,
            }"
            @switchSummaryCard="showSummaryCard = !showSummaryCard"
          >
            <template v-slot:headerFilterSlots>
              <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-start q-py-xs">
                <div class="flex sm:flex-row flex-col justify-start gap-2">
                  <div class="w-full sm:w-auto">
                    <q-select-box
                      v-model="filterFields.CashdeskId"
                      :options="cashdesks"
                      option-value="id"
                      option-label="name"
                      :label="$t('cashdesk')"
                      :fetchFn="cashdeskStore.fetchCashdesks"
                    />
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-select-box
                      v-model="filterFields.CashdeskTransactionType"
                      :options="cashdeskTransactionTypes"
                      option-value="value"
                      option-label="label"
                      :label="$t('cashdeskTransactionType')"
                      :fetchFn="cashdeskStore.fetchCashdeskTransactionTypes"
                    />
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-select-box
                      v-model="filterFields.TransType"
                      :options="transTypes"
                      option-value="value"
                      option-label="label"
                      :label="$t('transType')"
                      :fetchFn="cashdeskStore.fetchTransTypes"
                    />
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-select-box
                      v-model="filterFields.TransactionCodeId"
                      :options="
                        getTransactionCodeTransactionCodeTypeAndGroupTypes(
                          filterFields.TransType,
                          filterFields.CashdeskTransactionType,
                        )
                      "
                      option-value="id"
                      option-label="name"
                      :label="$t('transactionCode')"
                    />
                  </div>
                  <div class="w-full sm:w-auto md:min-w-[170px]">
                    <q-select
                      v-model="filterFields.TransactionType"
                      :options="cageTransactionTypes"
                      option-value="value"
                      option-label="label"
                      :label="$t('transactionType')"
                      class="super-small full-width"
                      dense
                      outlined
                      clearable
                      options-dense
                      emit-value
                      map-options
                      behavior="menu"
                    />
                  </div>
                  <div class="w-full sm:w-auto md:min-w-[170px]">
                    <q-select
                      :label="$t('currency')"
                      v-model="filterFields.CurrencyId"
                      outlined
                      dense
                      :options="getCurrenciesWithFlags"
                      option-value="id"
                      :option-label="
                        (val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol
                      "
                      emit-value
                      map-options
                      :rules="[(val) => !!val || $t('requiredField')]"
                      clearable
                      class="super-small"
                      hide-bottom-space
                      behavior="menu"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section>
                            <q-item-label>
                              <q-img
                                :src="scope.opt.flag"
                                fit="contain"
                                width="20px"
                                height="20px"
                                class="q-mr-sm"
                              />
                              {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:selected-item="scope">
                        <div class="text-subtitle2 q-mt-xs">
                          <q-img
                            :src="scope.opt.flag"
                            fit="contain"
                            width="20px"
                            height="20px"
                            class="q-mr-sm"
                          />
                          {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                        </div>
                      </template>
                    </q-select>
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-input
                      v-model="filterFields.MinAmount"
                      :label="$t('minAmount')"
                      class="super-small"
                      dense
                      outlined
                      clearable
                    />
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-input
                      v-model="filterFields.MaxAmount"
                      :label="$t('maxAmount')"
                      class="super-small"
                      dense
                      outlined
                      clearable
                    />
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-input
                      v-model="filterFields.CashdeskAccountId"
                      :label="$t('cashdeskAccount')"
                      class="super-small"
                      dense
                      outlined
                      clearable
                    />
                  </div>
                  <div class="w-full sm:w-auto">
                    <q-select-box
                      v-model="filterFields.IsMain"
                      :options="[
                        { label: $t('yes'), value: true },
                        { label: $t('no'), value: false },
                        { label: $t('all'), value: null },
                      ]"
                      option-value="value"
                      option-label="label"
                      :label="$t('main')"
                      :clearable="false"
                    />
                  </div>
                  <div class="w-full sm:w-auto flex justify-start">
                    <search-player-input
                      v-model="filterFields.PlayerId"
                      :optionLabel="'value'"
                      :displayedValue="filterFields.PlayerName"
                      @onSelectPlayer="
                        (args) => {
                          filterFields.PlayerId = args?.id
                          filterFields.PlayerName = args?.value
                        }
                      "
                      :label="$t('playerName')"
                      class="super-small"
                      :setValueById="true"
                      :playerId="+router.currentRoute.value.query.playerId"
                    />
                    <date-time-picker
                      class="q-ml-sm"
                      @selected-date="
                        (val) => {
                          filterFields = {
                            ...filterFields,
                            ...val,
                          }
                        }
                      "
                    />
                    <q-btn
                      type="button"
                      :label="$t('filter')"
                      icon="tune"
                      color="grey-2"
                      text-color="dark"
                      size="13px"
                      unelevated
                      no-caps
                      class="q-ml-sm"
                      @click="cageTransactionsTable.fetchData()"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:body-cell-actions="{ props }">
              <q-td key="actions" align="center">
                <q-btn
                  unelevated
                  dense
                  color="grey-2"
                  text-color="negative"
                  size="12px"
                  icon="fa-regular fa-trash-can"
                  class="q-mr-sm"
                  @click="deleteCageTransaction(props.row)"
                />
              </q-td>
            </template>
          </SupaTable>
        </div>
      </q-card-section>
    </transition>
  </q-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const router = useRouter()
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { storeToRefs } from 'pinia'
import InOutTransfer from '../cage-transaction-tabs/InOutTransfer.vue'
import CashDeskTransfer from '../cage-transaction-tabs/CashDeskTransfer.vue'
import ExchangeTransfer from '../cage-transaction-tabs/ExchangeTransfer.vue'
import OthersTransfer from '../cage-transaction-tabs/OthersTransfer.vue'
import BankTransfer from '../cage-transaction-tabs/BankTransfer.vue'
import { LocalStorage } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'
const cashdeskStore = useCashdeskStore()
const {
  getSelectedCashDeskId,
  cashdeskTransactionTypes,
  transTypes,
  cageTransactionTypes,
  cashdesks,
} = storeToRefs(cashdeskStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodeTransactionCodeTypeAndGroupTypes } = storeToRefs(transactionCodeStore)
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
const columns = ref([
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'createdAt',
    label: 'Created At',
    fieldType: 'date',
  },
  {
    field: 'cashdeskAccountName',
    label: 'Cashdesk Account',
  },
  {
    field: 'includeInBalance',
    label: 'Include In Balance',
    fieldType: 'boolean',
  },
  {
    field: 'playerName',
    label: 'Player',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'transactionCode',
    label: 'Transaction Code',
  },
  {
    label: 'Transaction Type',
    field: 'transactionType',
    customFormat: (row) => {
      return row === 'Deposit' ? 'Received' : 'Paid'
    },
  },
  {
    field: 'cashdeskName',
    label: 'Cashdesk',
  },
  {
    field: 'transType',
    label: 'Trans Type',
  },
  {
    field: 'amount',
    label: 'Amount',
    fieldType: 'price',
  },

  {
    field: 'cashdeskTransactionType',
    label: 'Transaction Type',
  },
  {
    field: 'note',
    label: 'Note',
  },
  {
    field: 'actions',
    label: 'Actions',
  },
])
const cageTransactionTabs = ref([
  {
    label: 'inOutTransfer',
    elPermission: 'Addon.CageTransactions.Tab.InOut',
    icon: 'o_import_export',
    name: 'inOutTransfer',
  },
  {
    label: 'cashDeskTransfer',
    elPermission: 'Addon.CageTransactions.Tab.CashDeskTransfer',
    icon: 'o_change_circle',
    name: 'cashDeskTransfer',
  },
  {
    label: 'exchange',
    elPermission: 'Addon.CageTransactions.Tab.Exchange',
    icon: 'o_currency_exchange',
    name: 'exchange',
  },
  {
    label: 'bankTransfer',
    elPermission: 'Addon.CageTransactions.Tab.BankTransfer',
    icon: 'account_balance',
    name: 'bankTransfer',
  },
  {
    label: 'otherTransfer',
    elPermission: 'Addon.CageTransactions.Tab.OtherTransfer',
    icon: 'o_article',
    name: 'otherTransfer',
  },
])
const createNewTransaction = ref(false)
const cageTransactionsTable = ref(null)
const currentCageTransactionTab = ref('inOutTransfer')
const onChangeCageTransactionTab = (val) => {
  LocalStorage.set('cageTransactionTab', val)
}
const filterFields = ref({
  CashdeskId: getSelectedCashDeskId.value,
  PlayerId: null,
  CurrencyId: null,
  TransactionType: null,
  MinAmount: null,
  MaxAmount: null,
  CashdeskTransactionType: null,
  TransType: null,
  TransactionCodeId: null,
  IsMain: true,
})
onMounted(() => {
  currentCageTransactionTab.value = LocalStorage.getItem('cageTransactionTab') || 'inOutTransfer'

  if (router.currentRoute.value.query.playerId) {
    filterFields.value.PlayerId = router.currentRoute.value.query.playerId

    cageTransactionsTable.value.fetchData()
  }
})

const onSavedCageTransaction = () => {
  createNewTransaction.value = false
}
const showSummaryCard = ref(true)

const deleteCageTransaction = (row) => {
  $q.dialog({
    title: 'Delete Cage Transaction',
    message: 'Are you sure you want to delete this cage transaction?',
    cancel: {
      flat: true,
      color: 'primary',
      label: 'Cancel',
      class: 'text-capitalize',
    },
    ok: {
      flat: true,
      color: 'negative',
      label: 'Delete',
      class: 'text-capitalize',
    },
    persistent: true,
  }).onOk(async () => {
    await cashdeskStore.deleteCashdeskTransaction({
      id: row.id,
    })
    cageTransactionsTable.value.requestServerInteraction()
  })
}
</script>
<style lang="scss" scoped>
.b-t-1 {
  border-top: 1px solid #e0e0e0;
}
.border-right-1 {
  border-right: 2px solid #e0e0e0;
}
</style>
