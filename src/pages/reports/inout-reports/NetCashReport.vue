<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getNetCashReport"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="netCashReportColumns"
      :filterParams="filterValues"
      :frozenColumns="['playerName']"
    >
      <template v-slot:headerFilterSlots>
        <div class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto">
          <date-time-picker
            @selected-date="
              (val) => {
                filterValues = {
                  ...filterValues,
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
            @click="inOutReportTable.fetchData()"
          />
        </div>
      </template>

      <template v-slot:bottomRow="props">
        <q-tr :props="props" class="bg-grey-1">
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
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
const reportStore = useReportStore()
const filterValues = ref(null)
const inOutReportTable = ref(null)

const columns = ref([
  {
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'firstVisitDate',
    fieldType: 'date',
  },
  {
    field: 'lastVisitDate',
    fieldType: 'date',
  },
  {
    field: 'totalLgResult',
    label: 'Total LG Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'totalSlotResult',
    label: 'Total Slot Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'totalResult',
    label: 'Total Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'gamingExpense',
    label: 'Gaming Expense',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'documents',
    label: 'Documents',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'gamingLoss',
    label: 'Gaming Loss',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'netCash',
    label: 'Net Cash',
    fieldType: 'priceAbs',
    showTotal: true,
  },
])
</script>

<style scoped></style>
