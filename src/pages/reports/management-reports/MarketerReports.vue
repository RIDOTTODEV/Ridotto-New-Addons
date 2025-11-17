<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="operationsStore.getMarketerReports"
      :filterValues="filterValues"
      ref="marketerReportsTable"
      tableName="marketerReportsColumns"
      :filterParams="filterValues"
    >
      <template v-slot:headerFilterSlots>
        <div
          class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto content-center items-center"
        >
          <q-select-box
            outlined
            dense
            v-model="filterValues.groupCodeIds"
            :options="groupCodes"
            option-value="id"
            option-label="code"
            :label="$t('group code')"
            class="super-small fixed-field-width"
            multiple
            :disable="!filterValues.byGroupCodeReport"
          />
          <q-checkbox
            v-model="filterValues.byGroupCodeReport"
            :label="$t('By Group Code Report')"
            class="super-small"
            @update:model-value="
              (val) => {
                if (!val) {
                  filterValues.groupCodeIds = []
                }
              }
            "
          />
          <q-select-box
            outlined
            dense
            v-model="filterValues.marketerId"
            :options="marketers"
            option-value="id"
            option-label="name"
            :label="$t('marketer')"
            class="super-small fixed-field-width"
            clearable
          />

          <date-time-picker
            @selected-date="
              (val) => {
                filterValues = {
                  ...filterValues,
                  ...val,
                }
              }
            "
            class="xs:w-full sm:w-auto"
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
            @click="marketerReportsTable.fetchData()"
          />
        </div>
      </template>
      <template v-slot:bottomRow="props">
        <q-tr :props="props">
          <q-td
            v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]"
            :key="index"
            :name="col.name"
            align="center"
            :class="{
              'bg-red-1':
                col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) < 0,
              'bg-green-1':
                col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) > 0,
            }"
          >
            <div class="text-subtitle2" v-if="col.showTotal">
              {{ col.format(props.rows.reduce((acc, item) => acc + item[col.field], 0)) }}
            </div>
            <div class="text-subtitle2" v-else>-</div>
          </q-td>
        </q-tr>
      </template>
    </SupaTable>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOperationsStore } from 'src/stores/operations-store'
const operationsStore = useOperationsStore()
const { marketers, groupCodes } = storeToRefs(operationsStore)
const filterValues = ref({
  groupCodeIds: [],
  marketerId: null,
  byGroupCodeReport: null,
})

const marketerReportsTable = ref(null)

const columns = ref([
  {
    name: 'groupCode',
    label: 'Group Code',
    field: 'groupCode',
    showTotal: false,
  },
  {
    name: 'marketerName',
    label: 'Marketer Name',
    field: 'marketerName',
    showTotal: false,
  },
  {
    name: 'lgResult',
    label: 'LG Result',
    field: 'lgResult',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'slResult',
    label: 'SL Result',
    field: 'slResult',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'credit',
    label: 'Credit',
    field: 'credit',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'discount',
    label: 'Discount',
    field: 'discount',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'comp',
    label: 'Comp',
    field: 'comp',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'totalGameResult',
    label: 'Total Game Result',
    field: 'totalGameResult',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'expense',
    label: 'Expense',
    field: 'expense',
    showTotal: true,
    fieldType: 'priceAbs',
  },

  {
    name: 'currencyName',
    label: 'Currency',
    field: 'currencyName',
    showTotal: false,
  },
  {
    name: 'ccFee',
    label: 'CC Fee',
    field: 'ccFee',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'netResult',
    label: 'Net Result',
    field: 'netResult',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    name: 'commissionPercent',
    label: 'Commission Percent',
    field: 'commissionPercent',
    showTotal: true,
    fieldType: 'price',
    format: (val) => {
      return val ? val + ' %' : '-'
    },
  },
  {
    name: 'commissionAmount',
    label: 'Commission Amount',
    field: 'commissionAmount',
    showTotal: true,
    fieldType: 'priceAbs',
  },
])
onMounted(async () => {
  await operationsStore.fetchMarketers()
  await operationsStore.fetchGroupCodes()
})
</script>

<style scoped></style>
