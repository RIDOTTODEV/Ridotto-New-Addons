<script setup>
import { ref, onMounted, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce, date } from 'quasar'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useChipManagementStore } from 'src/stores/chip-management-store'
import { useAuthStore } from 'src/stores/auth-store'

import { priceAbsFormatted, formatPrice } from 'src/helpers/helpers'

const bus = inject('bus')
const authStore = useAuthStore()
const { getDefaultCurrencyName } = storeToRefs(authStore)

const cashDeskStore = useCashdeskStore()
const {
  currentCashDeskChipCountDenominations,
  getSelectedCashDeskId,
  cashdeskChipTransactionTotals,
  selectedCashDesk,
} = storeToRefs(cashDeskStore)

const chipStore = useChipManagementStore()

chipStore.fetchChips()
cashDeskStore.fetchCashDeskChipCountDenominations()

const updateChipDenomination = debounce(async (denomination) => {
  if (!selectedCashDesk.value.isChipAccepted) {
    return
  }
  denomination.quantity = denomination.quantity ? +denomination.quantity : 0
  await cashDeskStore.updateCashDeskChipCountDenominations({
    ...denomination,
    CashdeskId: getSelectedCashDeskId.value,
  })
  bus.emit('reloadCageBalance')
}, 100)

const filterCageBalanceFields = ref({
  cashdeskId: getSelectedCashDeskId.value,
})

const dailyChipCountTableColumns = ref([
  {
    name: 'gamingDate',
    align: 'center',
    label: 'Date',
    field: 'gamingDate',
    sortable: false,
    format: (val) => date.formatDate(val, 'DD.MM.YYYY'),
    visible: true,
  },
  {
    name: 'try',
    align: 'center',
    label: 'TL',
    sortable: false,
    field: 'tl',
    visible: true,
  },
  {
    name: 'eur',
    align: 'center',
    label: 'EUR',
    sortable: false,
    field: 'eur',
    visible: true,
  },
  {
    name: 'usd',
    align: 'center',
    label: 'USD',
    field: 'usd',
    sortable: false,
    visible: true,
  },
  {
    name: 'gbp',
    align: 'center',
    label: 'GBP',
    field: 'gbp',
    sortable: false,
    visible: true,
  },
])

onMounted(async () => {
  await getTotals()
})
const getTotals = async () => {
  await cashDeskStore.fetchCashdeskChipTransactionTotals(filterCageBalanceFields.value)
}
</script>

<template>
  <div class="row">
    <div class="col-12 q-card--bordered row q-pa-sm" v-if="!selectedCashDesk.isChipAccepted">
      <Information
        :content="`<div class='text-left'>
                  <div class='text-subtitle2  '>
                 Chip Balance Update
                  </div>
                  <div class='text-subtitle2'>
               Chip balance update is not allowed for this cashdesk.
                  </div>
                  </div>`"
      />
    </div>
    <div class="col-12 q-card--bordered row q-pa-sm">
      <div
        class="col-md-3 q-pa-xs col-sm-12 col-xs-12"
        v-for="(item, index) in currentCashDeskChipCountDenominations"
        :key="index"
      >
        <div class="text-subtitle2 full-width">
          {{ chipStore.getChipById(item.chipId)?.currencyName }} -
          {{ chipStore.getChipById(item.chipId)?.name }}

          <span class="text-negative text-bold">*</span>
        </div>
        <q-markup-table separator="cell" flat square bordered dense class=" ">
          <thead>
            <tr>
              <th class="grey-card text-center">Denom</th>
              <th class="grey-card text-center">
                {{ $t('quantity') }}
              </th>
              <th class="grey-card text-center">
                {{ $t('total') }}
              </th>
            </tr>
          </thead>
          <tbody class="denom-body">
            <tr v-for="(denom, denomIndex) in item.cashdeskChipCountItems" :key="denomIndex">
              <td class="text-center cursor-not-allowed">
                {{ denom.chipDenomName }} {{ denom.value }}
              </td>
              <td class="text-center bg-grey-2">
                <q-field
                  style="overflow: hidden"
                  v-model="denom.quantity"
                  hide-bottom-space
                  borderless
                  standout
                  dense
                  flat
                  type="number"
                  class="q-pa-none q-ma-none super-small text-center"
                  lazy-rules
                  @focus="(e) => (e.target.select ? e.target.select() : null)"
                  @update:model-value="
                    (val) => {
                      denom.amount = val * denom.value
                      updateChipDenomination({
                        ...denom,
                      })
                    }
                  "
                  :autofocus="index === 0"
                  input-class="text-center"
                  :disable="!selectedCashDesk.isChipAccepted"
                >
                  <template v-slot:control="{ id, modelValue, emitValue }">
                    <input
                      type="number"
                      :id="id"
                      class="q-field__input q-pa-none number-to-text text-center bg-white myInput"
                      :value="modelValue"
                      @change="(e) => emitValue(e.target.value)"
                      pattern="[0-9]+([\.,][0-9]+)?"
                      v-el-perms="'Addon.CageOperations.Tab.BalanceUpdate'"
                      :disabled="!selectedCashDesk.isChipAccepted"
                    />
                  </template>
                </q-field>
              </td>
              <td>
                {{ formatPrice(denom.quantity * denom.value) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="text-right" colspan="3" style="border-top: 1px solid #e2e2e2 !important">
                <div class="text-subtitle2">
                  {{ $t('totalAmount') }}:
                  <span class="text-negative q-ml-md">
                    {{ priceAbsFormatted(item?.totalAmount) }}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </q-markup-table>
      </div>
      <div
        :class="
          currentCashDeskChipCountDenominations.length >= 3
            ? 'col-12 q-mt-md q-pa-xs'
            : 'col-md-6 col-sm-12 col-xs-12 q-pa-xs'
        "
      >
        <div class="text-subtitle1" style="margin-top: -6px">
          <span class="text-negative text-bold">
            {{ cashDeskStore.getCashDeskById(getSelectedCashDeskId)?.name }}</span
          >
          Transaction Totals
        </div>
        <q-card class="col-12 no-box-shadow" square bordered>
          <q-card-section class="row app-cart-grey q-pa-none">
            <div class="col-12 text-center right-separator">
              <div class="text-subtitle1">Total Amount</div>
            </div>
          </q-card-section>
          <q-card-section class="row q-pa-none">
            <div class="col-12 text-center right-separator">
              <div class="text-subtitle1">
                {{ priceAbsFormatted(cashdeskChipTransactionTotals) }}
                {{ getDefaultCurrencyName }}
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="col-12 q-mt-sm">
          <SupaTable
            :filterParams="filterCageBalanceFields"
            :getDataFn="cashDeskStore.getCashdeskChipCountHistoryTotal"
            :columns="dailyChipCountTableColumns"
            :slot-names="['body-cell-eur', 'body-cell-try', 'body-cell-usd', 'body-cell-gbp']"
            tableName="dailyChipCountTable"
          >
            <template v-slot:headerFilterSlots="{ props }">
              <div class="col q-pl-sm q-mr-sm flex row justify-start">
                <date-time-picker
                  class="q-ml-sm"
                  @selected-date="
                    (val) => {
                      filterCageBalanceFields = {
                        ...filterCageBalanceFields,
                        ...val,
                      }
                    }
                  "
                />
                <q-btn
                  :label="$t('filter')"
                  icon="tune"
                  color="grey-2"
                  text-color="dark"
                  size="13px"
                  unelevated
                  no-caps
                  class="q-ml-sm"
                  @click="props.reload"
                />
              </div>
            </template>
            <template v-slot:body-cell-eur="{ props }">
              <q-td :props="props" auto-width>
                <div
                  v-if="props.row.historyDetails.filter((e) => e.currencyName === 'EUR').length > 0"
                >
                  <div
                    class="text-center"
                    v-for="(item, index) in props.row.historyDetails.filter(
                      (e) => e.currencyName === 'EUR',
                    )"
                    :key="index"
                  >
                    <span>{{ item.chipName }} : {{ formatPrice(item.amount) }}</span>
                  </div>
                </div>
                <div v-else class="text-center">
                  <span>-</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-try="{ props }">
              <q-td :props="props" auto-width>
                <div
                  v-if="props.row.historyDetails.filter((e) => e.currencyName === 'TL').length > 0"
                >
                  <div
                    class="text-center"
                    v-for="(item, index) in props.row.historyDetails.filter(
                      (e) => e.currencyName === 'TL',
                    )"
                    :key="index"
                  >
                    <span>{{ item.chipName }} : {{ formatPrice(item.amount) }}</span>
                  </div>
                </div>
                <div v-else class="text-center">
                  <span>-</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-usd="{ props }">
              <q-td :props="props" auto-width>
                <div
                  v-if="props.row.historyDetails.filter((e) => e.currencyName === 'USD').length > 0"
                >
                  <div
                    class="text-center"
                    v-for="(item, index) in props.row.historyDetails.filter(
                      (e) => e.currencyName === 'USD',
                    )"
                    :key="index"
                  >
                    <span>{{ item.chipName }} : {{ formatPrice(item.amount) }}</span>
                  </div>
                </div>
                <div v-else class="text-center">
                  <span>-</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-gbp="{ props }">
              <q-td :props="props" auto-width>
                <div
                  v-if="props.row.historyDetails.filter((e) => e.currencyName === 'GBP').length > 0"
                >
                  <div
                    class="text-center"
                    v-for="(item, index) in props.row.historyDetails.filter(
                      (e) => e.currencyName === 'GBP',
                    )"
                    :key="index"
                  >
                    <span>{{ item.chipName }} : {{ formatPrice(item.amount) }}</span>
                  </div>
                </div>
                <div v-else class="text-center">
                  <span>-</span>
                </div>
              </q-td>
            </template>
          </SupaTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
