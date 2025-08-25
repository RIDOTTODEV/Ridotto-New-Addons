<template>
  <div class="row">
    <div class="col-12">
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
</script>

<style scoped></style>
