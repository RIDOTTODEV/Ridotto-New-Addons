<template>
  <div class="row">
    <div class="col-12">
      <q-card class="no-box-shadow q-mb-md" v-if="cashAccountsTotalsGroupedByCurrency().length > 0">
        <q-card-section class="q-pa-none">
          <div class="row bg-grey-2 q-card--bordered">
            <div class="col-1 text-center">
              <div class="text-subtitle2">#</div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ $t('currencyName') }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ $t('totalIn') }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ $t('totalOut') }}
              </div>
            </div>
            <div class="col text-center">
              <div class="text-subtitle2">
                {{ $t('result') }}
              </div>
            </div>
          </div>
          <div
            class="row q-card--bordered"
            v-for="(total, index) in cashAccountsTotalsGroupedByCurrency()"
            :key="index"
          >
            <div class="col-1 text-center bg-grey-2">
              <div class="text-subtitle2">
                {{ index + 1 }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ total.currencyName }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ priceAbsFormatted(total.totalIn) }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ priceAbsFormatted(total.totalOut) }}
              </div>
            </div>
            <div class="col text-center">
              <div class="text-subtitle2">
                {{ priceAbsFormatted(total.result) }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <SupaTable
        :columns="cashAccountColumns"
        :getDataFn="cashdeskStore.fetchCashdeskAccounts"
        :rowsPerPage="10"
        tableName="cashAccountColumns"
        :filterParams="filterParams"
        :slotNames="['body-cell-action']"
        ref="cashAccountTable"
        dataKey="cashAccountList"
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
    <div class="col-12 q-mt-md">
      <q-card class="no-box-shadow q-mb-md" v-if="chipAccountsTotalsGroupedByCurrency().length > 0">
        <q-card-section class="q-pa-none">
          <div class="row bg-grey-2 q-card--bordered">
            <div class="col-1 text-center">
              <div class="text-subtitle2">#</div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ $t('currencyName') }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ $t('totalIn') }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ $t('totalOut') }}
              </div>
            </div>
            <div class="col text-center">
              <div class="text-subtitle2">
                {{ $t('result') }}
              </div>
            </div>
          </div>
          <div
            class="row q-card--bordered"
            v-for="(total, index) in chipAccountsTotalsGroupedByCurrency()"
            :key="index"
          >
            <div class="col-1 text-center bg-grey-2">
              <div class="text-subtitle2">
                {{ index + 1 }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ total.currencyName }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ priceAbsFormatted(total.totalIn) }}
              </div>
            </div>
            <div class="col text-center border-right-1">
              <div class="text-subtitle2">
                {{ priceAbsFormatted(total.totalOut) }}
              </div>
            </div>
            <div class="col text-center">
              <div class="text-subtitle2">
                {{ priceAbsFormatted(total.result) }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <SupaTable
        :columns="chipAccountColumns"
        :getDataFn="cashdeskStore.fetchCashdeskAccounts"
        :rowsPerPage="10"
        tableName="chipAccountColumns"
        :filterParams="filterParams"
        :slotNames="['body-cell-action']"
        ref="chipAccountTable"
        dataKey="chipAccountList"
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
</script>

<style scoped></style>
