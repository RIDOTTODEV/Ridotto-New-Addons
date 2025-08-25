<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getPlayerResultReport"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="inOutReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerFullName', 'body-cell-chipDetails', 'body-cell-actions']"
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
      <template v-slot:body-cell-playerFullName="{ props }">
        <q-td :props="props">
          <span
            v-player-detail="props.row.playerId"
            :label="props.row.playerFullName"
            class="onHoverPlayerName"
          >
            {{ props.row.playerFullName }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-chipDetails="{ props }">
        <q-td :props="props">
          <q-btn
            size="13px"
            color="grey-2"
            text-color="dark"
            unelevated
            dense
            @click="onClickShowChipDetails(props.row)"
            icon="search"
          />
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
        <q-card-section class="row">
          <div class="col-6">
            <div class="row">
              <div class="text-h6 col-12">
                {{ $t('lgPlayerDailyResult') }}
              </div>
              <div class="text-subtitle1 text-bold">
                {{ $t('totalDrop') }}:
                <span class="text-negative">{{ formatPrice(dailyReportDetail?.totalDrop) }}</span>
              </div>
              <div class="text-subtitle1 text-bold q-ml-xl">
                {{ $t('totalOut') }}:
                <span class="text-negative">{{ formatPrice(dailyReportDetail?.totalOut) }}</span>
              </div>
            </div>
          </div>
          <div class="col-6 flex content-end justify-end">
            <div class="row">
              <date-time-picker
                class="super-small q-mr-sm"
                :set-date-by-label="dailyReportDetailParams?.label || null"
                v-model="dailyReportDetailParams"
              />

              <q-btn
                :label="$t('filter')"
                icon="tune"
                color="grey-2"
                text-color="dark"
                size="13px"
                unelevated
                no-caps
                @click="getPlayerResultDetailReport()"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <q-markup-table dense square class="q-ma-none" flat bordered separator="cell">
            <thead>
              <tr class="app-card-grey">
                <th class="text-center">Gaming Date</th>
                <th class="text-center">Player Full Name</th>
                <th class="text-center">Buyed Chips</th>
                <th class="text-center">Drop</th>
                <th class="text-center">Out</th>
                <th class="text-center">Chips In Pocket</th>
                <th class="text-center">Used Chips</th>
                <th class="text-center">Chip Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dailyReportDetail?.playerLgResults" :key="index">
                <td class="text-center">{{ item.gamingDateName }}</td>
                <td class="text-center">{{ item.playerFullName }}</td>
                <td class="text-center">{{ formatPrice(item.buyedChips) }}</td>
                <td class="text-center">{{ formatPrice(item.drop) }}</td>
                <td class="text-center">{{ formatPrice(item.out) }}</td>
                <td class="text-center">
                  {{ formatPrice(item.chipsInPocket) }}
                </td>
                <td class="text-center">{{ formatPrice(item.usedChips) }}</td>
                <td class="text-center">
                  <q-btn
                    size="13px"
                    color="grey-2"
                    text-color="dark"
                    unelevated
                    dense
                    @click="onClickShowChipDetails(item)"
                    icon="search"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      v-model="showChipDetailsDialog"
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
          <q-markup-table dense square class="q-ma-none" flat bordered separator="cell">
            <thead>
              <tr class="app-card-grey">
                <th class="text-center">Chip Denom Id</th>
                <th class="text-center">Chip Denom Name</th>
                <th class="text-center">Chip Type</th>
                <th class="text-center">Transaction Type</th>
                <th class="text-center">Source</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Total</th>
                <th class="text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in chipDetails" :key="index">
                <td class="text-center">{{ item.chipDenomId }}</td>
                <td class="text-center">{{ item.chipDenomName }}</td>
                <td class="text-center">{{ item.chipType }}</td>
                <td class="text-center">{{ item.transactionType }}</td>
                <td class="text-center">{{ item.source }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td class="text-center">{{ formatPrice(item.total) }}</td>
                <td class="text-center">{{ formatPrice(item.value) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { formatPrice } from 'src/helpers/helpers'
const reportStore = useReportStore()
const filterValues = ref({
  playerId: null,
  playerName: null,
})
const onSelectPlayer = (val) => {
  filterValues.value.playerId = val.id
  filterValues.value.playerName = val.value
}
const onClearPlayer = () => {
  filterValues.value.playerId = null
  filterValues.value.playerName = null
}
const inOutReportTable = ref(null)
const maximized = ref(false)

const columns = ref([
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'buyedChips',
    fieldType: 'price',
  },
  {
    field: 'drop',
    fieldType: 'price',
  },
  {
    field: 'out',
    fieldType: 'price',
  },
  {
    field: 'chipsInPocket',
    fieldType: 'price',
  },
  {
    field: 'usedChips',
    fieldType: 'price',
  },
  {
    field: 'chipDetails',
  },
  {
    field: 'actions',
  },
])

const showDailyReportDetailDialog = ref(false)
const dailyReportDetailParams = ref({
  PlayerId: null,
})
const dailyReportDetail = ref(null)
const showDailyReportDetail = async (row) => {
  dailyReportDetailParams.value = {
    ...filterValues.value,
    PlayerId: row.playerId,
  }
  showDailyReportDetailDialog.value = true
  getPlayerResultDetailReport()
}
const getPlayerResultDetailReport = async () => {
  dailyReportDetail.value = await reportStore.getPlayerResultDetailReport(
    dailyReportDetailParams.value,
  )
}

const showChipDetailsDialog = ref(false)

const chipDetails = ref(null)

const onClickShowChipDetails = (row) => {
  chipDetails.value = row?.chipDetails
  showChipDetailsDialog.value = true
}
</script>

<style scoped></style>
