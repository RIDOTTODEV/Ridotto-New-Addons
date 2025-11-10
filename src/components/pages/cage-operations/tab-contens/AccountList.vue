<template>
  <div class="row">
    <div class="col-12">
      <div>
        <CurrencyResultCard
          :currencyTotals="cashAccountsTotalsGroupedByCurrency()"
          :showSummaryCard="showSummaryCashCard"
        />
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
          dataKey="cashAccountInfoOutput.cashAccountList"
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
        <CurrencyResultCard
          :currencyTotals="chipAccountsTotalsGroupedByCurrency()"
          :showSummaryCard="showSummaryChipCard"
        />
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
          dataKey="chipAccountInfoOutput.chipAccountList"
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
import CurrencyResultCard from '../CurrencyResultCard.vue'
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
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
  const data = cashAccountTable.value?.response?.cashAccountInfoOutput?.cashAccountTotals || []
  return data
}

const chipAccountsTotalsGroupedByCurrency = () => {
  const data = cashAccountTable.value?.response?.chipAccountInfoOutput?.chipAccountTotals || []
  return data
}

const showSummaryCashCard = ref(true)
const showSummaryChipCard = ref(true)
</script>

<style scoped></style>
