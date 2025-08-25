<script setup>
import { formatPrice, priceAbsFormatted } from 'src/helpers/helpers'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { date, Dialog, debounce } from 'quasar'
import { i18n } from 'src/boot/i18n'
const cashdeskStore = useCashdeskStore()
const { getSelectedCashDeskId, currentCashDeskTotals, currentCashDeskCountDenominations } =
  storeToRefs(cashdeskStore)
const authStore = useAuthStore()

const filterCageBalanceFields = ref({
  CashdeskId: getSelectedCashDeskId.value,
})

onMounted(async () => {
  await cashdeskStore.getCashdeskTotals(filterCageBalanceFields.value)
  await cashdeskStore.fetchCashdeskCountDenominations(filterCageBalanceFields.value)
})

const cageBalanceColumns = ref([
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

const resetDenomination = (denomination) => {
  Dialog.create({
    title: 'Reset',
    message: i18n.global.t('resetDenomination', { currency: denomination.currencyName }),
    persistent: false,
    backdropFilter: 'brightness(40%)',
    ok: {
      label: i18n.global.t('reset'),
      color: 'primary',
      noCaps: true,
      flat: true,
    },
    cancel: {
      label: i18n.global.t('cancel'),
      color: 'primary',
      noCaps: true,
      flat: true,
    },
    focus: 'ok',
  }).onOk(async () => {
    await cashdeskStore.resetCashDeskCountDenominations({
      cashdeskId: denomination.cashdeskId,
      currencyId: denomination.currencyId,
    })
  })
}

const updateDenomination = debounce(async (denomination) => {
  denomination.quantity = denomination.quantity ? +denomination.quantity : 0
  await cashdeskStore.updateCashDeskCountDenominations(denomination)
}, 300)
</script>

<template>
  <div class="col-12">
    <q-card class="app-cart q-card--bordered">
      <q-card-section class="q-pa-none row flex content-center">
        <div class="col-md-7 q-pa-xs">
          <div class="row">
            <div
              class="q-pa-sm col-3"
              v-for="(item, index) in currentCashDeskCountDenominations"
              :key="index"
            >
              <div class="row">
                <div class="col-2 text-left flex justify-start content-center items-center">
                  <div class="text-subtitle2">{{ item.currencyName }}</div>
                </div>
                <div class="col-10 text-right flex justify-end content-center items-center">
                  <div class="text-subtitle2 q-mr-sm">
                    {{ item.totalAmount.toFixed(2) }}
                  </div>
                  <q-icon
                    name="o_delete_forever"
                    color="primary"
                    class="cursor-pointer my-icon"
                    size="20px"
                    @click="
                      resetDenomination({
                        ...item,
                        cashdeskId: cashDeskId,
                        currencyId: item.currencyId,
                      })
                    "
                    v-el-perms="'Addon.CageOperations.Tab.BalanceResetAll'"
                  />
                </div>
              </div>
              <q-markup-table separator="cell" flat square bordered dense>
                <thead>
                  <tr>
                    <th class="grey-card text-center">Denom</th>
                    <th class="grey-card text-center">Amount</th>
                  </tr>
                </thead>
                <tbody class="denom-body">
                  <tr
                    v-for="(denom, denomIndex) in item.cashdeskCountDenominations"
                    :key="denomIndex"
                  >
                    <td class="text-center cursor-not-allowed">
                      {{ denom.denomination }}
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
                          updateDenomination({
                            ...denom,
                            cashdeskId: cashDeskId,
                            currencyId: item.currencyId,
                          })
                        "
                        input-class="text-center"
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
                          />
                        </template>
                      </q-field>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col q-pa-xs">
          <div class="text-subtitle1">
            <span class="text-negative text-bold">
              {{ cashdeskStore.getCashDeskById(getSelectedCashDeskId)?.name }}</span
            >
            Transaction Totals
          </div>

          <q-card class="no-box-shadow q-mt-xs q-mb-sm" square bordered>
            <q-card-section class="row app-cart-grey q-pa-none">
              <div class="col-4 text-center right-separator">
                <div class="text-subtitle1">Transactions</div>
              </div>
              <div class="col-4 text-center right-separator">
                <div class="text-subtitle1">Tickets</div>
              </div>
              <div class="col-4 text-center right-separator">
                <div class="text-subtitle1">Cashless</div>
              </div>
            </q-card-section>
            <q-card-section class="row q-pa-none">
              <div class="col-4 text-center right-separator">
                <div class="text-subtitle2">
                  {{ priceAbsFormatted(currentCashDeskTotals?.cashdeskTransactionTotal) }}
                  {{ authStore.getDefaultCurrencyName }}
                </div>
              </div>
              <div class="col-4 text-center right-separator">
                <div class="text-subtitle2">
                  {{ priceAbsFormatted(currentCashDeskTotals?.ticketTotal) }}
                  {{ authStore.getDefaultCurrencyName }}
                </div>
              </div>
              <div class="col-4 text-center right-separator">
                <div class="text-subtitle2">
                  {{ priceAbsFormatted(currentCashDeskTotals?.playerTransactionTotal) }}
                  {{ authStore.getDefaultCurrencyName }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <SupaTable
            tableName="cageBalanceTable"
            :filterParams="filterCageBalanceFields"
            :getDataFn="cashdeskStore.fetchGetCountHistoriesTotal"
            :columns="cageBalanceColumns"
            :slot-names="['body-cell-eur', 'body-cell-try', 'body-cell-usd', 'body-cell-gbp']"
          >
            <template v-slot:headerFilterSlots="{ props }">
              <div class="col-5 flex row justify-start no-wrap">
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
                  @click="props.reload"
                  class="q-ml-sm"
                />
              </div>
            </template>
            <template v-slot:body-cell-eur="{ props }">
              <q-td :props="props" auto-width>
                <div class="text-center">
                  {{
                    formatPrice(
                      props.row.historyDetails.find((e) => e.currencyName === 'EUR')?.amount,
                    )
                  }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-try="{ props }">
              <q-td :props="props" auto-width>
                <div class="text-center">
                  {{
                    formatPrice(
                      props.row.historyDetails.find((e) => e.currencyName === 'TL')?.amount,
                    )
                  }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-usd="{ props }">
              <q-td :props="props" auto-width>
                <div class="text-center">
                  {{
                    formatPrice(
                      props.row.historyDetails.find((e) => e.currencyName === 'USD')?.amount,
                    )
                  }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-gbp="{ props }">
              <q-td :props="props" auto-width>
                <div class="text-center">
                  {{
                    formatPrice(
                      props.row.historyDetails.find((e) => e.currencyName === 'GBP')?.amount,
                    )
                  }}
                </div>
              </q-td>
            </template>
          </SupaTable>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss"></style>
