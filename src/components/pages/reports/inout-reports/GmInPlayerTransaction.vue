<template>
  <q-card
    flat
    class="bg-transparent no-box-shadow"
    v-if="filterFields?.TransactionType === 'Deposit'"
  >
    <q-card-section class="q-pa-none">
      <SupaTable
        :columns="columns"
        :filterParams="filterFields"
        :getDataFn="reportStore.getGmAftIns"
        tableName="gmInPlayerTransactionsTable"
        ref="gmInPlayerTransactionsTable"
        :frozenColumns="['dbCreationTimeUuid']"
      >
        <template v-slot:headerFilterSlots>
          <div class="col-6 flex row justify-start">
            <div class="row full-width flex justify-start">
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
                :setDateByLabel="props?.filterParams?.label"
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
                @click="gmInPlayerTransactionsTable.fetchData()"
              />
            </div>
          </div>
        </template>
      </SupaTable>
    </q-card-section>
    <q-card-section
      class="q-pa-none q-mt-md"
      v-if="gmInPlayerTransactionsTable?.response?.totals?.length > 0"
    >
      <div class="text-subtitle1">Totals</div>
      <q-markup-table dense separator="cell" square flat bordered>
        <thead>
          <tr>
            <th class="text-center">Currency</th>
            <th class="text-center">Count</th>
            <th class="text-center">Total Amount</th>
            <th class="text-center">Total Credit</th>
            <th class="text-center">Transaction Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in gmInPlayerTransactionsTable?.response?.totals" :key="item.id">
            <td class="text-center">{{ item.currencyName }}</td>
            <td class="text-center">{{ item.count }}</td>
            <td class="text-center">{{ priceAbsFormatted(item.totalAmount) }}</td>
            <td class="text-center">{{ priceAbsFormatted(item.totalCredit) }}</td>
            <td class="text-center">
              {{
                authStore.getEnumByName('Ridotto.Cm.Domain.BillAcceptor.AftTransactionType').values[
                  item.transactionType
                ]
              }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
  <q-card
    flat
    class="bg-transparent no-box-shadow"
    v-if="filterFields?.TransactionType === 'Withdrawal'"
  >
    <q-card-section class="q-pa-none">
      <SupaTable
        :columns="columnsDeposit"
        :filterParams="filterFields"
        :getDataFn="reportStore.getGmAftOuts"
        tableName="gmOutPlayerTransactionsTable"
        ref="gmInPlayerTransactionsTable"
        :frozenColumns="['dbCreationTimeUuid']"
      >
        <template v-slot:headerFilterSlots>
          <div class="col-6 flex row justify-start">
            <div class="row full-width flex justify-start">
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
                :setDateByLabel="props?.filterParams?.label"
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
                @click="gmInPlayerTransactionsTable.fetchData()"
              />
            </div>
          </div>
        </template>
      </SupaTable>
    </q-card-section>
    <q-card-section
      class="q-pa-none q-mt-md"
      v-if="gmInPlayerTransactionsTable?.response?.totals?.length > 0"
    >
      <div class="text-subtitle1">Totals</div>
      <q-markup-table dense separator="cell" square flat bordered>
        <thead>
          <tr>
            <th class="text-center">Currency</th>
            <th class="text-center">Count</th>
            <th class="text-center">Total Amount</th>
            <th class="text-center">Total Credit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in gmInPlayerTransactionsTable?.response?.totals" :key="item.id">
            <td class="text-center">{{ item.currencyName }}</td>
            <td class="text-center">{{ item.count }}</td>
            <td class="text-center">{{ priceAbsFormatted(item.totalAmount) }}</td>
            <td class="text-center">{{ priceAbsFormatted(item.totalCredit) }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { useAuthStore } from 'src/stores/auth-store'
import { priceAbsFormatted } from 'src/helpers/helpers'
const authStore = useAuthStore()
const reportStore = useReportStore()
const props = defineProps({
  filterParams: {
    type: Object,
    required: true,
    default: () => null,
  },
})

const filterFields = ref({
  ...props.filterParams,
})
const gmInPlayerTransactionsTable = ref(null)
const columns = ref([
  {
    name: 'dbCreationTimeUuid',
    label: 'Date',
    field: 'dbCreationTimeUuid',
    fieldType: 'date',
  },
  {
    name: 'floorNo',
    label: 'Machine No',
    field: 'floorNo',
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    fieldType: 'priceAbs',
  },
  {
    name: 'currencyName',
    label: 'Currency',
    field: 'currencyName',
  },
  {
    name: 'credit',
    label: 'Credit',
    field: 'credit',
    fieldType: 'priceAbs',
  },
  {
    name: 'returned',

    field: 'returned',
    fieldType: 'boolean',
  },
  {
    name: 'transferStatusCode',
    label: 'Transfer Status Code',
    field: 'transferStatusCode',
    format: (value) => {
      const enumValue = authStore.getEnumByName('Ridotto.Cm.Domain.Sas.TransferStatusCodes')
      return enumValue.values[value] || value
    },
  },

  {
    name: 'machineState',
    label: 'Machine State',
    field: 'machineState',
    format: (value) => {
      const enumValue = authStore.getEnumByName('Ridotto.Cm.Application.Enums.Gm.MachineStates')
      return enumValue.values[value] || value
    },
  },
  {
    name: 'isAnonymos',
    label: 'Is Anonymous',
    field: 'isAnonymos',
    fieldType: 'boolean',
  },
])

watch(
  () => props.filterParams,
  (newValue) => {
    filterFields.value = { ...newValue }
    setTimeout(() => {
      gmInPlayerTransactionsTable.value?.fetchData()
    }, 100)
  },
  { immediate: true, deep: true },
)

const columnsDeposit = ref([
  {
    name: 'dbCreationTimeUuid',
    label: 'Date',
    field: 'dbCreationTimeUuid',
    fieldType: 'date',
  },
  {
    name: 'floorNo',
    label: 'Machine No',
    field: 'floorNo',
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    fieldType: 'priceAbs',
  },
  {
    name: 'currencyName',
    label: 'Currency',
    field: 'currencyName',
  },
  {
    name: 'credit',
    label: 'Credit',
    field: 'credit',
    fieldType: 'priceAbs',
  },
  {
    name: 'machineState',
    label: 'Machine State',
    field: 'machineState',
    format: (value) => {
      const enumValue = authStore.getEnumByName('Ridotto.Cm.Application.Enums.Gm.MachineStates')
      return enumValue.values[value] || value
    },
  },
  {
    name: 'isAnonymos',
    label: 'Is Anonymous',
    field: 'isAnonymos',
    fieldType: 'boolean',
  },
  {
    name: 'handPayRequired',
    label: 'Hand Pay',
    field: 'handPayRequired',
  },
  {
    name: 'transactionType',
    label: 'Type',
    field: 'transactionType',
    format: (value) => {
      const enumValue = authStore.getEnumByName('Ridotto.Cm.Domain.BillAcceptor.AftTransactionType')
      return enumValue.values[value] || value
    },
  },
])
</script>
