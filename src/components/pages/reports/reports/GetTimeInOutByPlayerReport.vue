<template>
  <SupaTable
    :columns="columns"
    :getDataFn="reportStore.getTimeInOutReportByPlayer"
    ref="inOutReportTable"
    tableName="timeInOutByPlayerReportColumns"
    :filterParams="filterValues"
    :slotNames="['body-cell-playerFullName', 'body-cell-actions']"
    dataKey="playerLgResults"
  >
    <template v-slot:headerFilterSlots>
      <div class="col-6 flex row justify-start">
        <div class="row full-width flex justify-start">
          <SearchPlayerInput
            v-model="filterValues.playerId"
            :placeholder="$t('searchPlayer')"
            @onSelectPlayer="onSelectPlayer"
            :optionLabel="'value'"
            :displayedValue="filterValues.playerName"
            @onClear="onClearPlayer"
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

    <template v-slot:body-cell-actions="{ props }">
      <q-td :props="props">
        <q-btn
          size="13px"
          color="grey-2"
          text-color="dark"
          unelevated
          dense
          @click="
            () => {
              showDailyReportDetail(props.row)
            }
          "
          icon="search"
        />
      </q-td>
    </template>
  </SupaTable>

  <q-dialog
    maximized
    v-model="showDailyReportDetailDialog"
    transition-show="slide-up"
    transition-hide="slide-down"
    :class="maximized ? '' : 'historyModal'"
    backdrop-filter="brightness(40%)"
  >
    <q-card
      class="app-content-bg"
      :style="maximized ? '' : `height: ${$getWindowHeight}px!important;`"
    >
      <q-bar>
        <q-space />
        <q-btn dense flat icon="minimize" v-close-popup>
          <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximized = !maximized">
          <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <SupaTable
          :columns="detailColumns"
          :getDataFn="reportStore.getTimeInOutReport"
          :filterParams="dailyReportDetailParams"
          ref="inOutReportTable"
          tableName="timeInOutByPlayerReportDetailColumns"
          dataKey="playerLgResult"
        >
          <template v-slot:headerFilterSlots>
            <div class="col-6 flex row justify-start">
              <div class="row full-width flex justify-start content-center items-center">
                <q-chip
                  color="orange-4"
                  text-color="dark"
                  class="q-ml-sm text-capitalize"
                  :label="selectedPlayer.playerName"
                  square
                />
                <date-time-picker
                  class="q-ml-sm"
                  :setDate="filterValues"
                  @selected-date="
                    (val) => {
                      dailyReportDetailParams = {
                        ...dailyReportDetailParams,
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
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
const reportStore = useReportStore()
const filterValues = ref({
  PlayerId: null,
  PlayerName: null,
})
const onSelectPlayer = (val) => {
  filterValues.value.PlayerId = val.id
  filterValues.value.PlayerName = val.value
}
const onClearPlayer = () => {
  filterValues.value.PlayerId = null
  filterValues.value.PlayerName = null
}
const inOutReportTable = ref(null)
const maximized = ref(false)

const columns = ref([
  {
    field: 'playerId',
    label: 'Player Id',
  },
  {
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'totalPlayTime',
  },
  {
    field: 'totalAvgBet',
    fieldType: 'price',
  },
  {
    field: 'totalCashDrop',
    fieldType: 'price',
  },
  {
    field: 'totalChipDrop',
    fieldType: 'price',
  },
  {
    field: 'totalResult',
    fieldType: 'price',
  },
  {
    field: 'totalHandCount',
  },
  {
    field: 'totalOut',
    fieldType: 'price',
  },
  {
    field: 'theoretical',
    fieldType: 'price',
  },
  {
    field: 'actions',
  },
])

const detailColumns = ref([
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
    fieldType: 'price',
  },
  {
    field: 'cashDrop',
    label: 'Cash Drop',
    fieldType: 'price',
  },
  {
    field: 'chipDrop',
    label: 'Chip Drop',
    fieldType: 'price',
  },
  {
    field: 'out',
    label: 'Out',
    fieldType: 'price',
  },
  {
    field: 'result',
    label: 'Result',
    fieldType: 'price',
  },
])

const showDailyReportDetailDialog = ref(false)
const dailyReportDetailParams = ref({
  PlayerId: null,
})
const selectedPlayer = ref(null)
const showDailyReportDetail = async (row) => {
  selectedPlayer.value = row
  dailyReportDetailParams.value = {
    PlayerId: row.playerId,
  }

  showDailyReportDetailDialog.value = true
}
</script>

<style scoped></style>
