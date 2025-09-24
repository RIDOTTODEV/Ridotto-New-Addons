<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getTimeInOutReportByTable"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="inOutReportByTableColumns"
      :filterParams="filterValues"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-8 flex row justify-start">
          <div class="row full-width flex justify-start">
            <q-select-box
              v-model="filterValues.tableId"
              :label="$t('table')"
              :options="tables"
              option-label="name"
              option-value="id"
              class="q-mr-sm"
            />

            <date-time-picker
              class="q-ml-sm"
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
              class="q-ml-sm"
              @click="inOutReportTable.fetchData()"
            />
          </div>
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
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { useTableStore } from 'src/stores/table-store'
import { storeToRefs } from 'pinia'
const reportStore = useReportStore()
const tableStore = useTableStore()
const { tables } = storeToRefs(tableStore)

tableStore.fetchTables()
const filterValues = ref({
  playerId: null,
  playerName: null,
})
const inOutReportTable = ref(null)

const columns = ref([
  /*   {
    field: 'tableId',
    label: 'Table Id',
  }, */
  {
    field: 'tableName',
    label: 'Table Name',
  },
  {
    field: 'totalPlayTime',
    label: 'Play Time',
  },
  {
    field: 'totalAvgBet',
    label: 'Avg Bet',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'totalCashDrop',
    label: 'Cash Drop',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'totalChipDrop',
    label: 'Chip Drop',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'totalResult',
    label: 'Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'totalOut',
    label: 'Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },
])
</script>

<style scoped></style>
