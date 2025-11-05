<template>
  <div class="row">
    <div class="col-12">
      <div>
        <q-card
          class="no-box-shadow q-mb-md q-ma-xs"
          v-if="cashAccountsTotalsGroupedByCurrency().length > 0 && showSummaryCashCard === false"
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
                <tr v-for="(total, index) in cashAccountsTotalsGroupedByCurrency()" :key="index">
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
          v-if="cashAccountsTotalsGroupedByCurrency().length > 0 && showSummaryCashCard === true"
        >
          <div
            class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto text-center q-pa-xs items-center justify-center md:min-w-[25%]"
            v-for="total in cashAccountsTotalsGroupedByCurrency()"
            :key="total.currencyName"
          >
            <q-card flat class="app-cart-grey w-full">
              <q-card-section class="q-pa-none">
                <div class="text-h6">{{ total.currencyName }}</div>
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
                      class="text-h6"
                      :class="{
                        'text-green-8': total.withdrawal > 0,
                        'text-negative': total.withdrawal < 0,
                      }"
                    >
                      {{ priceAbsFormatted(total.withdrawal) }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div
                      class="text-h6"
                      :class="{
                        'text-green-8': total.deposit > 0,
                        'text-negative': total.deposit < 0,
                      }"
                    >
                      {{ priceAbsFormatted(total.deposit) }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div
                      class="text-h6"
                      :class="{
                        'text-green-8': total.result > 0,
                        'text-negative': total.result < 0,
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
          :columns="cashAccountColumns"
          :getDataFn="cashdeskStore.fetchCashdeskAccounts"
          :rowsPerPage="10"
          tableName="cashAccountColumns"
          :filterParams="filterParams"
          :slotNames="['body-cell-action']"
          ref="cashAccountTable"
          dataKey="cashAccountList"
          :hideFields="{
            showVisibleColumns: true,
            showReloadButton: true,
            showScreenModeButton: true,
            showSearchInput: true,
            switchSummaryCard: true,
          }"
          @switchSummaryCard="showSummaryCashCard = !showSummaryCashCard"
        >
          <template v-slot:headerFilterSlots>
            <div class="col flex content-center text-center">
              <div class="text-subtitle2 q-ml-sm">
                {{ $t('cashAccounts') }}
              </div>
              <q-space />
            </div>
          </template>
          <template v-slot:body-cell-action="{ props }">
            <q-td key="action" align="center">
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                no-caps
                size="12px"
                icon="search"
                class="q-mr-md"
                @click="onClickShowDetailAccount(props.row, 'cage')"
                v-el-perms="'Addon.Definitions.Cashdesk.Update'"
                data-cy="editData"
              />
            </q-td>
          </template>
        </SupaTable>
      </div>
    </div>
    <div class="col-12 q-mt-md">
      <div>
        <q-card
          class="no-box-shadow q-mb-md q-ma-xs"
          v-if="chipAccountsTotalsGroupedByCurrency().length > 0 && showSummaryChipCard === false"
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
                <tr v-for="(total, index) in chipAccountsTotalsGroupedByCurrency()" :key="index">
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
          v-if="chipAccountsTotalsGroupedByCurrency().length > 0 && showSummaryChipCard === true"
        >
          <div
            class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto text-center q-pa-xs items-center justify-center md:min-w-[25%]"
            v-for="total in chipAccountsTotalsGroupedByCurrency()"
            :key="total.currencyName"
          >
            <q-card flat class="app-cart-grey w-full">
              <q-card-section class="q-pa-none">
                <div class="text-h6">{{ total.currencyName }}</div>
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
                      class="text-h6"
                      :class="{
                        'text-green-8': total.withdrawal > 0,
                        'text-negative': total.withdrawal < 0,
                      }"
                    >
                      {{ priceAbsFormatted(total.withdrawal) }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div
                      class="text-h6"
                      :class="{
                        'text-green-8': total.deposit > 0,
                        'text-negative': total.deposit < 0,
                      }"
                    >
                      {{ priceAbsFormatted(total.deposit) }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div
                      class="text-h6"
                      :class="{
                        'text-green-8': total.result > 0,
                        'text-negative': total.result < 0,
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
          :columns="chipAccountColumns"
          :getDataFn="cashdeskStore.fetchCashdeskAccounts"
          :rowsPerPage="10"
          tableName="chipAccountColumns"
          :filterParams="filterParams"
          :slotNames="['body-cell-action']"
          ref="chipAccountTable"
          dataKey="chipAccountList"
          :hideFields="{
            showVisibleColumns: true,
            showReloadButton: true,
            showScreenModeButton: true,
            showSearchInput: true,
            switchSummaryCard: true,
          }"
          @switchSummaryCard="showSummaryChipCard = !showSummaryChipCard"
        >
          <template v-slot:headerFilterSlots>
            <div class="col flex content-center text-center">
              <div class="text-subtitle2 q-ml-sm">
                {{ $t('chipAccounts') }}
              </div>
              <q-space />
            </div>
          </template>
          <template v-slot:body-cell-action="{ props }">
            <q-td key="action" align="center">
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                no-caps
                size="12px"
                icon="search"
                class="q-mr-md"
                @click="onClickShowDetailAccount(props.row, 'chip')"
                v-el-perms="'Addon.Definitions.Cashdesk.Update'"
                data-cy="editData"
              />
            </q-td>
          </template>
        </SupaTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'
const $q = useQuasar()
const cashdeskStore = useCashdeskStore()
const { getSelectedCashDeskId } = storeToRefs(cashdeskStore)
const cashAccountColumns = ref([
  {
    field: 'name',
    label: 'Account Name',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'transactionCode',
  },
  {
    field: 'totalIn',
    fieldType: 'price',
  },
  {
    field: 'totalOut',
    fieldType: 'price',
  },
  {
    field: 'result',
    fieldType: 'price',
  },
  {
    field: 'action',
  },
])
const cashAccountTable = ref(null)
const filterParams = ref({
  cashdeskId: getSelectedCashDeskId.value,
})

const chipAccountColumns = ref([
  {
    field: 'name',
    label: 'Account Name',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'transactionCode',
  },
  {
    field: 'totalIn',
    fieldType: 'price',
  },
  {
    field: 'totalOut',
    fieldType: 'price',
  },
  {
    field: 'result',
    fieldType: 'price',
  },
  {
    field: 'action',
  },
])

const onClickShowDetailAccount = (row, accountType = 'cage') => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('components/pages/cage-operations/tab-contens/AccountDetailDialog.vue'),
    ),
    componentProps: {
      cashdeskAccountId: row.cashdeskAccountId,
      filterFn:
        accountType === 'cage'
          ? cashdeskStore.fetchCashdeskTransactions
          : cashdeskStore.fetchCashdeskChipTransactions,
      accountType,
    },
  })
}
const cashAccountsTotalsGroupedByCurrency = () => {
  const data = cashAccountTable.value?.response?.cashAccountList || []
  const groupedData = []
  data.forEach((item) => {
    const existingItem = groupedData.find((group) => group.currencyName === item.currencyName)
    if (existingItem) {
      existingItem.totalIn += item.totalIn
      existingItem.totalOut += item.totalOut
      existingItem.result += item.result
    } else {
      groupedData.push({
        currencyName: item.currencyName,
        totalIn: item.totalIn,
        totalOut: item.totalOut,
        result: item.result,
      })
    }
  })
  return groupedData
}

const chipAccountsTotalsGroupedByCurrency = () => {
  const data = cashAccountTable.value?.response?.chipAccountList || []
  const groupedData = []
  data.forEach((item) => {
    const existingItem = groupedData.find((group) => group.currencyName === item.currencyName)
    if (existingItem) {
      existingItem.totalIn += item.totalIn
      existingItem.totalOut += item.totalOut
      existingItem.result += item.result
    } else {
      groupedData.push({
        currencyName: item.currencyName,
        totalIn: item.totalIn,
        totalOut: item.totalOut,
        result: item.result,
      })
    }
  })
  return groupedData
}

const showSummaryCashCard = ref(true)
const showSummaryChipCard = ref(true)
</script>

<style scoped></style>
