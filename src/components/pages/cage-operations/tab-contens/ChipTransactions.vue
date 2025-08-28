<template>
  <q-card class="no-box-shadow q-pa-none bg-transparent">
    <q-card-section class="q-pa-none q-mb-sm">
      <div class="row">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <div class="text-subtitle1">
            {{ $t('chipTransactions') }}
          </div>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12 text-right">
          <q-btn
            :label="createNewTransaction ? $t('back') : $t('create')"
            class="q-mr-sm"
            color="blue-grey-8"
            text-color="white"
            unelevated
            no-caps
            @click="createNewTransaction = !createNewTransaction"
          />
        </div>
      </div>
    </q-card-section>
    <transition name="slide-fade" mode="out-in">
      <q-card-section class="q-pa-none" v-if="createNewTransaction">
        <div class="row">
          <q-tabs
            v-model="currentChipTransactionTab"
            @update:model-value="onChangeChipTransactionTab"
            dense
            class="text-dark"
            active-color="blue-grey-8"
            indicator-color="blue-grey-8"
            active-bg-color="white"
            align="justify"
            narrow-indicator
            no-caps
            inline-label
            shrink
          >
            <q-tab
              v-for="(tab, index) in chipTransactionsTabs"
              :key="index"
              :v-el-perms="tab.elPermission"
              no-caps
              :name="tab.name"
              :label="$t(tab.label)"
              :icon="tab.icon"
              class="bg-white q-card--bordered"
              :class="index === 0 ? '' : 'q-ml-sm '"
            />
          </q-tabs>
        </div>
        <q-tab-panels v-model="currentChipTransactionTab" animated class="q-mt-sm full-height">
          <q-tab-panel
            v-el-perms="'Addon.CageOperations.Tab.ChipTransfer'"
            name="chipTransfer"
            class="q-card q-pa-none no-box-shadow"
          >
            <chip-transfer
              @savedCageChipTransaction="chipTransactionTableRef.reload()"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageOperations.Tab.PlayerChipTransfer'"
            name="playerChipTransfer"
            class="q-card q-pa-none no-box-shadow"
          >
            <player-chip-transfer
              @savedCageChipTransaction="chipTransactionTableRef.reload()"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageOperations.Tab.FillCredit'"
            name="fillCredit"
            class="q-card q-pa-none no-box-shadow"
          >
            <fill-credit
              @savedCageChipTransaction="chipTransactionTableRef.reload()"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
          <q-tab-panel
            v-el-perms="'Addon.CageOperations.Tab.TableFloatFill'"
            name="tableFloatFill"
            class="q-card q-pa-none no-box-shadow"
          >
            <table-float-fill
              @savedCageChipTransaction="chipTransactionTableRef.reload()"
              @cancel="createNewTransaction = false"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-section class="q-pa-none" v-else>
        <SupaTable
          ref="chipTransactionTableRef"
          :filterParams="filterFields"
          tableName="cageOperationsChipTransactions"
          :getDataFn="cashDeskStore.fetchCashdeskChipTransactions"
          :columns="columns"
          :slotNames="['body-cell-action']"
          :useCol12="true"
        >
          <template v-slot:headerFilterSlots>
            <div class="col-12 flex row justify-start q-py-xs">
              <div class="row full-width flex justify-start">
                <div class="col-2 q-pa-xs">
                  <q-select-box
                    v-model="filterFields.CashdeskId"
                    :options="cashdesks"
                    option-value="id"
                    option-label="name"
                    :label="$t('cashdesk')"
                    :fetchFn="cashDeskStore.fetchCashdesks"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select-box
                    v-model="filterFields.CashdeskTransactionType"
                    :options="cashdeskTransactionTypes"
                    option-value="value"
                    option-label="label"
                    :label="$t('cashdeskTransactionType')"
                    :fetchFn="cashDeskStore.fetchCashdeskTransactionTypes"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select-box
                    v-model="filterFields.TransType"
                    :options="transTypes"
                    option-value="value"
                    option-label="label"
                    :label="$t('transType')"
                    :fetchFn="cashDeskStore.fetchTransTypes"
                  />
                </div>
                <div class="col-2 q-pa-xs">
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
                <div class="col-2 q-pa-xs">
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
                    style="width: 170px"
                  />
                </div>
                <div class="col-2 q-pa-xs">
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
                <div class="col-2 q-pa-xs">
                  <q-input
                    v-model="filterFields.MinAmount"
                    :label="$t('minAmount')"
                    class="super-small"
                    dense
                    outlined
                    clearable
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    v-model="filterFields.MaxAmount"
                    :label="$t('maxAmount')"
                    class="super-small"
                    dense
                    outlined
                    clearable
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    v-model="filterFields.CashdeskAccountId"
                    :label="$t('cashdeskAccount')"
                    class="super-small"
                    dense
                    outlined
                    clearable
                  />
                </div>
                <div class="col q-pa-xs flex justify-start">
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
                    @click="chipTransactionTableRef.fetchData()"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-slot:body-cell-action="{ props }">
            <q-td key="action" align="center">
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                size="10px"
                icon="search"
                class="q-mr-md"
                @click="onClickShowChipTransferTransactionDetail(props.row)"
              />
            </q-td>
          </template>
        </SupaTable>
      </q-card-section>
    </transition>
  </q-card>
  <q-dialog
    v-model="cashDeskChipTransferHistoryDialog"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="historyModal"
    backdrop-filter="brightness(40%)"
    square
  >
    >
    <q-card :style="`height: ${$getWindowHeight}px!important;`">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('detail') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-xl">
        <q-markup-table dense separator="cell" bordered class="q-pa-md no-box-shadow">
          <thead>
            <tr>
              <th class="text-left">ChipType</th>
              <th class="text-right">Denom</th>
              <th class="text-right">Currency</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Value</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody v-if="cashDeskChipTransferHistoryData">
            <tr v-for="item in cashDeskChipTransferHistoryData" :key="item.id">
              <td class="text-left">{{ item.chipType }}</td>
              <td class="text-right">{{ item.chipDenomName }}</td>
              <td class="text-right">{{ item.currencyName }}</td>
              <td class="text-right">{{ item.quantity }}</td>
              <td class="text-right">{{ formatPrice(item.value) }}</td>
              <td class="text-right">{{ formatPrice(item.amount) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import ChipTransfer from '../chip-transaction-tabs/ChipTransfer.vue'
import PlayerChipTransfer from '../chip-transaction-tabs/PlayerChipTransfer.vue'
import FillCredit from '../chip-transaction-tabs/FillCredit.vue'
import TableFloatFill from '../chip-transaction-tabs/TableFloatFill.vue'
import { formatPrice } from 'src/helpers/helpers'
import { LocalStorage } from 'quasar'
const cashDeskStore = useCashdeskStore()
const {
  getSelectedCashDeskId,
  selectedCashDesk,
  cageTransactionTypes,
  cashdeskTransactionTypes,
  transTypes,
  cashdesks,
} = storeToRefs(cashDeskStore)
const createNewTransaction = ref(false)
const chipTransactionTableRef = ref(null)
const currentChipTransactionTab = ref(LocalStorage.getItem('chipTransactionTab') || 'chipTransfer')

const chipTransactionsTabs = ref([
  {
    label: 'chipTransfer',
    elPermission: 'Addon.CageOperations.Tab.ChipTransfer',
    icon: 'o_casino',
    name: 'chipTransfer',
  },
  {
    label: 'playerChipTransfer',
    elPermission: 'Addon.CageOperations.Tab.PlayerChipTransfer',
    icon: 'o_casino',
    name: 'playerChipTransfer',
  },
  {
    label: 'fillCredit',
    elPermission: 'Addon.CageOperations.Tab.FillCredit',
    icon: 'o_casino',
    name: 'fillCredit',
  },
  {
    label: 'tableFloatFill',
    elPermission: 'Addon.CageOperations.Tab.TableFloatFill',
    icon: 'o_casino',
    name: 'tableFloatFill',
  },
])

const onChangeChipTransactionTab = (val) => {
  LocalStorage.set('chipTransactionTab', val)
}
const cashDeskChipTransferHistoryDialog = ref(false)
const cashDeskChipTransferHistoryData = ref(null)
const filterFields = ref({
  CashdeskId: getSelectedCashDeskId.value,
  TransactionType: null,
  GamingDateId: selectedCashDesk?.value?.gamingDateId || 1,
  TransType: null,
  TransactionCodeId: null,
  CurrencyId: null,
  MinAmount: null,
  MaxAmount: null,
  PlayerId: null,
})

const columns = ref([
  {
    label: 'Id',
    field: 'id',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    label: 'Cashdesk Name',
    field: 'cashdeskName',
  },
  {
    label: 'Cashdesk Account Name',
    field: 'cashdeskAccountName',
  },
  {
    label: 'Player Name',
    field: 'playerName',
  },
  {
    label: 'Player Id',
    field: 'playerId',
  },
  {
    label: 'Transaction Code',
    field: 'transactionCode',
  },
  {
    label: 'Transaction Type',
    field: 'transactionType',
    customFormat: (row) => {
      return row.transactionType === 'Deposit' ? 'Paid' : 'Received'
    },
  },
  {
    label: 'Amount',
    field: 'amount',
    fieldType: 'price',
  },
  {
    label: 'Currency Name',
    field: 'currencyName',
  },

  {
    label: 'Transaction Type',
    field: 'cashdeskTransactionType',
  },
  {
    label: 'In/Out',
    field: 'inOut',
    fieldType: 'boolean',
  },

  {
    label: 'Trans Type',
    field: 'transType',
  },
  {
    field: 'action',
  },
])

const onClickShowChipTransferTransactionDetail = async (row) => {
  const data = await cashDeskStore.fetchChipTransactionDetail({
    cashdeskChipTransactionId: row.id,
  })
  if (data.length > 0) {
    cashDeskChipTransferHistoryData.value = data
    cashDeskChipTransferHistoryDialog.value = true
  }
}

const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodeTransactionCodeTypeAndGroupTypes } = storeToRefs(transactionCodeStore)

const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
</script>

<style scoped></style>
