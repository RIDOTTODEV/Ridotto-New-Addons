<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getTimeInOutReport"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="timeInOutReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerName']"
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
            <SearchPlayerInput
              v-model="filterValues.playerId"
              :placeholder="$t('searchPlayer')"
              @onSelectPlayer="
                (val) => {
                  filterValues.playerId = val?.id
                  filterValues.playerName = val?.value
                }
              "
              :optionLabel="'value'"
              :displayedValue="filterValues.playerName"
              @onClear="
                () => {
                  filterValues.playerId = null
                  filterValues.playerName = null
                }
              "
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
      <template v-slot:body-cell-playerName="{ props }">
        <q-td :props="props">
          <span
            v-player-detail="props.row.playerId"
            :label="props.row.playerName"
            class="onHoverPlayerName"
          >
            {{ props.row.playerName }}
          </span>
        </q-td>
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
  {
    field: 'playerId',
    label: 'Player Id',
  },
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'table',
    label: 'Table',
  },
  {
    field: 'inTime',
    label: 'In Time',
    fieldType: 'date',
  },
  {
    field: 'outTime',
    label: 'Out Time',
    fieldType: 'date',
  },
  {
    field: 'playTime',
    label: 'Play Time',
  },
  {
    field: 'avgBet',
    label: 'Avg Bet',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'cashDrop',
    label: 'Cash Drop',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'chipDrop',
    label: 'Chip Drop',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'out',
    label: 'Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'result',
    label: 'Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },
])
</script>

<style scoped></style>
