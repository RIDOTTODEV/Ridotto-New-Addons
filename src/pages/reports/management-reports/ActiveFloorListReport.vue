<script setup>
import { useReportStore } from 'src/stores/report-store'

import { onMounted, ref } from 'vue'

import { priceAbsFormatted } from 'src/helpers/helpers'
import { Loading } from 'quasar'

const reportStore = useReportStore()
const activeFloorListReport = ref(null)
onMounted(async () => {
  activeFloorListReport.value = await reportStore.getActiveFloorListReport()
})

const reloadReport = async () => {
  Loading.show({
    message: 'Yükleniyor...',
  })
  activeFloorListReport.value = await reportStore.getActiveFloorListReport()
  Loading.hide()
}
</script>

<template>
  <q-page class="q-pa-sm">
    <q-card class="no-box-shadow bg-transparent">
      <q-card-section class="q-pa-none row">
        <div class="col-md-4 col-xs-12 q-pa-sm">
          <div class="text-subtitle2 text-negative">
            {{ $t('slotMachinePlayers') }}
            ({{ activeFloorListReport?.slotCount }})
          </div>
          <q-markup-table square flat bordered separator="cell" dense>
            <thead>
              <tr class="app-cart-grey">
                <th class="text-center">Player</th>
                <th class="text-center">Currency</th>
                <th class="text-center">T.Over</th>
                <th class="text-center">Avg.B</th>
                <th class="text-center">T.O.Con</th>
                <th class="text-center">Avg.B.Con</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in activeFloorListReport?.slotMachinePlayers" :key="index">
                <td class="text-center">
                  <div v-player-detail="item.playerId" class="onHoverPlayerName">
                    {{ item.playerFullName }}
                  </div>
                </td>
                <td class="text-center">{{ item.currencyName }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item.turnover) }}
                </td>
                <td class="text-center bg-orange-1">
                  {{ priceAbsFormatted(item.avgBet) }}
                </td>
                <td class="text-center bg-grey-4">
                  {{ priceAbsFormatted(item.turnoverConverted) }}
                </td>
                <td class="text-center bg-grey-4">
                  {{ priceAbsFormatted(item.avgBetConverted) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-md-4 col-xs-12 q-pa-sm">
          <div class="text-subtitle2 text-negative">
            {{ $t('liveGamePlayers') }}
            ({{ activeFloorListReport?.liveGameCount }})
          </div>
          <q-markup-table square flat bordered separator="cell" dense>
            <thead>
              <tr class="app-cart-grey">
                <th class="text-center">Player</th>
                <th class="text-center">Table</th>
                <th class="text-center">Drop</th>
                <th class="text-center">Avg.B</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in activeFloorListReport?.liveGamePlayers" :key="index">
                <td class="text-center">
                  <div v-player-detail="item.playerId" class="onHoverPlayerName">
                    {{ item.playerFullName }}
                  </div>
                </td>
                <td class="text-center">{{ item.tableName }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item.drop) }}
                </td>
                <td class="text-center bg-orange-1">
                  {{ priceAbsFormatted(item.avgBet) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </q-card-section>
    </q-card>
    <div class="absolute-top-right q-mr-sm q-mt-sm">
      <q-btn
        icon="o_sync"
        color="blue-grey-8"
        text-color="white"
        unelevated
        no-caps
        @click="reloadReport"
        class="q-card--bordered"
      >
        <q-tooltip class="text-subtitle2 app-cart-grey text-dark flex no-wrap">{{
          $t('reloadReport')
        }}</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<style lang="scss">
.display-none {
  display: none;
}
.gap-x-sm {
  gap: 0.5rem;
}
.height-auto {
  height: auto;
}
.table-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.table-container .q-markup-table {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
