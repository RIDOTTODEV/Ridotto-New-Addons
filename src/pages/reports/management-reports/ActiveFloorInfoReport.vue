<script setup>
import { useReportStore } from 'src/stores/report-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { onMounted, ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth-store'
import { priceAbsFormatted } from 'src/helpers/helpers'
const reportStore = useReportStore()
const authStore = useAuthStore()
const currencyStore = useCurrencyStore()
const activeFloorInfo = ref(null)
const bus = inject('bus')
const { getDefaultCurrencyId } = storeToRefs(authStore)
const { getCurrencyById } = storeToRefs(currencyStore)

const defaultCurrency = computed(() => getCurrencyById.value(getDefaultCurrencyId.value))
onMounted(async () => {
  activeFloorInfo.value = await reportStore.getActiveFloorInfo()
})

const optionFormValues = ref({
  playerPreview: true,
  noContactInfo: false,
  activeSlotPlayers: false,
  watchLiveResult: false,
})

const showLiveGameResult = (value) => {
  let values = {
    lgDrop: activeFloorInfo.value.lgInfo.lgDrop,
    lgResult: activeFloorInfo.value.lgInfo.lgResult,
    slTOver: activeFloorInfo.value.slotInfo.slotTurnover,
    sltResult: activeFloorInfo.value.slotInfo.slotResult,
    lastActivity: '0',
  }
  bus.emit('showLiveGameResult', {
    toggle: value,
    ...values,
  })
}
</script>

<template>
  <q-page class="q-pa-sm" style="background-color: #bac6da">
    <q-card class="no-box-shadow bg-transparent">
      <q-card-section class="q-pa-none row">
        <div class="col-6">
          <div class="row">
            <div class="col-6 q-pa-xs">
              <q-expansion-item
                dense
                dense-toggle
                expand-separator
                ref="optionExpansionItem"
                class="q-card--bordered"
                label="Options"
              >
                <q-card class="no-box-shadow" flat>
                  <q-card-section class="q-pa-none">
                    <div class="q-gutter-sm q-pl-md q-pb-md">
                      <div>
                        <q-checkbox
                          color="grey-10"
                          dense
                          v-model="optionFormValues.playerPreview"
                          label="Player Preview"
                        />
                      </div>
                      <div>
                        <q-checkbox
                          color="grey-10"
                          dense
                          v-model="optionFormValues.noContactInfo"
                          label="No Contact Info"
                        />
                      </div>
                      <div>
                        <q-checkbox
                          color="grey-10"
                          dense
                          v-model="optionFormValues.activeSlotPlayers"
                          label="Active Slot Players"
                        />
                      </div>
                      <div class="">
                        <q-checkbox
                          color="grey-10"
                          dense
                          v-model="optionFormValues.watchLiveResult"
                          label="Watch Live Result"
                          @update:model-value="showLiveGameResult"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                dense
                dense-toggle
                expand-separator
                ref="optionExpansionItem"
                class="q-card--bordered q-mt-md"
                label="LG Result By Game Type"
                default-opened
              >
                <q-card>
                  <q-card-section class="q-pa-none row flex justify-between">
                    <div
                      class="col-6 q-pa-xs gap-x-sm no-wrap flex justify-between content-end items-center"
                    >
                      <div class="text-subtitle2">Cash</div>
                      <q-input
                        square
                        class="super-small"
                        dense
                        :model-value="priceAbsFormatted(activeFloorInfo?.lgResultByGame?.cashDrop)"
                        outlined
                        input-class="text-left"
                        bg-color="orange-1"
                        hide-bottom-space
                        readonly
                      />
                    </div>
                    <div
                      class="col-6 q-pa-xs gap-x-sm no-wrap flex justify-between content-end items-center"
                    >
                      <div class="text-subtitle2">Plaque</div>
                      <q-input
                        square
                        class="super-small"
                        dense
                        :model-value="priceAbsFormatted(activeFloorInfo?.lgResultByGame?.chipDrop)"
                        outlined
                        input-class="text-left"
                        bg-color="orange-1"
                        hide-bottom-space
                        readonly
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-markup-table square flat bordered separator="cell" dense class="q-mt-md">
                <thead>
                  <tr class="app-cart-grey">
                    <th class="text-center">Game</th>
                    <th class="text-center">T.Cash</th>
                    <th class="text-center">T.Plaque</th>
                    <th class="text-center">T.Drop</th>
                    <th class="text-center">T.Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in activeFloorInfo?.lgResultByGame?.gameResults"
                    :key="index"
                  >
                    <td class="text-center">{{ item.gameName }}</td>
                    <td class="text-center bg-orange-1">
                      {{ priceAbsFormatted(item.totalCashDrop) }}
                    </td>
                    <td class="text-center bg-green-1">
                      {{ priceAbsFormatted(item.totalChipDrop) }}
                    </td>
                    <td class="text-center bg-orange-1">
                      {{ priceAbsFormatted(item.totalDrop) }}
                    </td>
                    <td class="text-center bg-green-1">
                      {{ priceAbsFormatted(item.totalResult) }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
              <div class="row q-mt-md">
                <div class="col-12 text-center">
                  <span class="text-subtitle2 text-indigo-10">LG</span>
                </div>
                <div class="col-12 no-wrap flex justify-between">
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Tbl/Plyr</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="
                        activeFloorInfo?.lgInfo?.tableCount +
                        '/' +
                        activeFloorInfo?.lgInfo?.playerCount
                      "
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">TotalBet</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="priceAbsFormatted(activeFloorInfo?.lgInfo?.totalAvgBet)"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Win/Min</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="priceAbsFormatted(activeFloorInfo?.lgInfo?.winMin)"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Avg.Bet</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="priceAbsFormatted(activeFloorInfo?.lgInfo?.avgBet)"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                </div>
                <div class="col-12 no-wrap flex justify-between">
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-bold text-indigo-10">Lg Drop</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="
                        priceAbsFormatted(activeFloorInfo?.lgInfo?.lgDrop) +
                        ' ' +
                        defaultCurrency?.symbol
                      "
                      outlined
                      input-class="text-left text-white"
                      bg-color="red-10"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-bold text-indigo-10">Lg Result</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="
                        priceAbsFormatted(activeFloorInfo?.lgInfo?.lgResult) +
                        ' ' +
                        defaultCurrency?.symbol
                      "
                      outlined
                      input-class="text-left text-white"
                      bg-color="red-10"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12 text-center">
                  <span class="text-subtitle2 text-indigo-10">SLOT</span>
                </div>
                <div class="col-12 no-wrap flex justify-between">
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Players</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="activeFloorInfo?.slotInfo?.playerCount"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Total.Bet</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="priceAbsFormatted(activeFloorInfo?.slotInfo?.totalAvgBet)"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Win/Min</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="priceAbsFormatted(activeFloorInfo?.slotInfo?.winMin)"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-negative">Avg.Bet</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="priceAbsFormatted(activeFloorInfo?.slotInfo?.avgBet)"
                      outlined
                      input-class="text-left"
                      bg-color="orange-1"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                </div>
                <div class="col-12 no-wrap flex justify-between">
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-bold text-indigo-10">SL Turnover</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="
                        priceAbsFormatted(activeFloorInfo?.slotInfo?.slotTurnover) +
                        ' ' +
                        defaultCurrency?.symbol
                      "
                      outlined
                      input-class="text-left text-white"
                      bg-color="red-10"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-bold text-indigo-10">SL Drop</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="
                        priceAbsFormatted(activeFloorInfo?.slotInfo?.drop) +
                        ' ' +
                        defaultCurrency?.symbol
                      "
                      outlined
                      input-class="text-left text-white"
                      bg-color="red-10"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                  <div class="q-pa-xs text-center">
                    <span class="text-caption text-bold text-indigo-10">SL Result</span>
                    <q-input
                      square
                      class="super-small"
                      dense
                      :model-value="
                        priceAbsFormatted(activeFloorInfo?.slotInfo?.slotResult) +
                        ' ' +
                        defaultCurrency?.symbol
                      "
                      outlined
                      input-class="text-left text-white"
                      bg-color="red-10"
                      hide-bottom-space
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 q-pa-xs">
              <div class="table-container">
                <q-markup-table square flat bordered separator="cell" dense>
                  <thead>
                    <tr class="app-cart-grey">
                      <th class="text-center text-bold text-negative">
                        Live Game ({{ activeFloorInfo?.lgSitPlayers?.length }})
                      </th>
                      <th class="text-center">Table.N</th>
                      <th class="text-center">Avg.B</th>
                      <th class="text-center">Chips.I.P</th>
                      <th class="text-center">Cash.D</th>
                      <th class="text-center">Plaque.D</th>
                      <th class="text-center text-indigo-10">P</th>
                      <th class="text-center text-indigo-10">I</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in activeFloorInfo?.lgSitPlayers" :key="index">
                      <td class="text-center">{{ item.playerName }}</td>
                      <td class="text-center">{{ item.tableName }}</td>
                      <td class="text-center bg-orange-1">
                        {{ priceAbsFormatted(item.avgBet) }}
                      </td>
                      <td class="text-center bg-green-2">
                        {{ priceAbsFormatted(item.chipInPocket) }}
                      </td>
                      <td class="text-center bg-orange-1">
                        {{ priceAbsFormatted(item.cashDrop) }}
                      </td>
                      <td class="text-center bg-green-2">
                        {{ priceAbsFormatted(item.plaqueDrop) }}
                      </td>
                      <td class="text-center">
                        <q-icon v-if="item.p" name="warning" color="warning" size="xs" />
                        <q-icon v-else name="check_circle" color="positive" size="xs" />
                      </td>
                      <td class="text-center">
                        <q-icon v-if="item.i" name="warning" color="warning" size="xs" />
                        <q-icon v-else name="check_circle" color="positive" size="xs" />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-markup-table square flat bordered separator="cell" dense>
                  <thead>
                    <tr class="app-cart-grey">
                      <th class="text-center text-bold text-negative">
                        Slot ({{ activeFloorInfo?.slotSitPlayers?.length }})
                      </th>
                      <th class="text-center">T.Over</th>
                      <th class="text-center">Avg.B</th>
                      <th class="text-center">Floor.N</th>
                      <th class="text-center text-indigo-10">P</th>
                      <th class="text-center text-indigo-10">I</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in activeFloorInfo?.slotSitPlayers" :key="index">
                      <td class="text-center">{{ item.playerName }}</td>
                      <td class="text-center">{{ item.turnover }}</td>
                      <td class="text-center bg-orange-1">
                        {{ priceAbsFormatted(item.avgBet) }}
                      </td>
                      <td class="text-center bg-red-1">{{ item.floorNo }}</td>
                      <td class="text-center">
                        <q-icon v-if="item.p" name="warning" color="warning" size="xs" />
                        <q-icon v-else name="check_circle" color="positive" size="xs" />
                      </td>
                      <td class="text-center">
                        <q-icon v-if="item.i" name="warning" color="warning" size="xs" />
                        <q-icon v-else name="check_circle" color="positive" size="xs" />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 q-pa-sm">
          <div class="col-12">
            <span class="text-subtitle2"
              >Active Tables
              <span class="text-negative">({{ activeFloorInfo?.activeTables?.length }})</span></span
            >
          </div>
          <div class="row">
            <div
              class="col-6 q-pa-sm"
              v-for="(item, index) in activeFloorInfo?.activeTables"
              :key="index"
            >
              <span class="text-subtitle2 text-negative text-capitalize">{{
                item.inspectorName || 'Test Inspector'
              }}</span>
              <q-markup-table square flat bordered separator="cell" dense>
                <thead>
                  <tr class="app-cart-grey">
                    <th class="text-center text-bold text-negative">
                      {{ item.tableName }}
                    </th>
                    <th class="text-center">Avg Bet</th>
                    <th class="text-center">T.Drop</th>
                    <th class="text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(player, index) in item.players" :key="index">
                    <td class="text-center text-capitalize">{{ player.playerName }}</td>
                    <td class="text-center">
                      {{ priceAbsFormatted(player.avgBet) }}
                    </td>
                    <td class="text-center">
                      {{ priceAbsFormatted(player.totalDrop) }}
                    </td>
                    <td class="text-center bg-orange-1 cursor-pointer">
                      {{ priceAbsFormatted(player.result) }}
                      <q-menu
                        transition-show="scale"
                        transition-hide="scale"
                        anchor="bottom middle"
                      >
                        <q-list dense separator style="min-width: 200px">
                          <q-item
                            class="bg-grey-2 flex justify-center items-center content-center no-wrap"
                          >
                            <span class="text-caption text-bold text-negative text-capitalize">
                              {{ player.playerName }}</span
                            >
                          </q-item>
                          <q-item class="flex justify-between items-center content-center no-wrap">
                            <span class="text-caption">Cash Drop: </span>
                            <span class="text-caption">{{
                              priceAbsFormatted(player.cashDrop)
                            }}</span>
                          </q-item>
                          <q-item
                            class="flex justify-between items-center content-center q-pa-none no-wrap"
                          >
                            <span class="text-caption">Chip Drop: </span>
                            <span class="text-caption">{{
                              priceAbsFormatted(player.chipDrop)
                            }}</span>
                          </q-item>
                          <q-item class="flex justify-between items-center content-center no-wrap">
                            <span class="text-caption">Total Drop: </span>
                            <span class="text-caption">{{
                              priceAbsFormatted(player.totalDrop)
                            }}</span>
                          </q-item>
                          <q-item class="flex justify-between items-center content-center no-wrap">
                            <span class="text-caption">Avg Bet: </span>
                            <span class="text-caption">{{ priceAbsFormatted(player.avgBet) }}</span>
                          </q-item>
                          <q-item
                            class="bg-orange-1 flex justify-between items-center content-center no-wrap"
                          >
                            <span class="text-caption text-bold">Result: </span>
                            <span class="text-caption text-bold">{{
                              priceAbsFormatted(player.result)
                            }}</span>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
  <!--   <q-page class="q-pa-md">
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none">
        <div class="text-h6">
          {{ $t("menus.activeFloorInfo") }}
        </div>
      </q-card-section>
    </q-card>
    <q-card flat square>
      <q-card-section>
        <div class="text-subtitle1 text-bold">
          {{ $t("activeFloorInfo.lgResultByGame") }}
        </div>
        <Information
          class="full-width q-mt-sm q-mb-sm"
          content="Oyun bazlı olarak drop ve result bilgisini verir."
        />
        <q-markup-table square flat bordered separator="cell" dense>
          <thead>
            <tr class="app-cart-grey">
              <th class="text-center">Game Name</th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-orange-7' : 'bg-orange-1',
                ]"
              >
                Total Cash Drop
              </th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-green-7' : 'bg-green-1',
                ]"
              >
                Total Chip Drop
              </th>
              <th class="text-center">Total Drop</th>
              <th class="text-center">Total Out</th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-red-7' : 'bg-red-1',
                ]"
              >
                Total Result
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in reportStore.activeFloorInfo
                ?.lgResultByGame?.gameResults"
              :key="index"
            >
              <td class="text-center">{{ item.gameName }}</td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-orange-7' : 'bg-orange-1',
                ]"
              >
                {{ formatPrice(item.totalCashDrop) }}
              </td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-green-7' : 'bg-green-1',
                ]"
              >
                {{ formatPrice(item.totalChipDrop) }}
              </td>
              <td class="text-center">{{ formatPrice(item.totalDrop) }}</td>
              <td class="text-center">{{ formatPrice(item.totalOut) }}</td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-red-7' : 'bg-red-1',
                ]"
              >
                {{ formatPrice(item.totalResult) }}
              </td>
            </tr>
            <tr>
              <td class="text-center"></td>
              <td class="text-center text-bold">
                {{
                  formatPrice(
                    reportStore.activeFloorInfo?.lgResultByGame?.cashDrop
                  )
                }}
              </td>
              <td class="text-center text-bold">
                {{
                  formatPrice(
                    reportStore.activeFloorInfo?.lgResultByGame?.chipDrop
                  )
                }}
              </td>
              <td class="text-center"></td>
              <td class="text-center"></td>
              <td class="text-center text-bold"></td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card flat square>
      <q-card-section>
        <div class="text-subtitle1 text-bold">
          {{ $t("activeFloorInfo.lgInfo") }}
        </div>
        <Information
          class="full-width q-mt-sm q-mb-sm"
          content="Anlık olarak aktif olan masa sayısı , masalarda oturan oyuncu sayısı cash drop , avg bet  ve result bilgisini verir."
        />
        <q-markup-table square flat bordered separator="cell" dense>
          <thead>
            <tr class="app-cart-grey">
              <th class="text-center">Table Count</th>
              <th class="text-center">Player Count</th>
              <th class="text-center">Avg Bet</th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-orange-7' : 'bg-orange-1',
                ]"
              >
                Total Cash Drop
              </th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-green-7' : 'bg-green-1',
                ]"
              >
                Total Result
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">
                {{ reportStore.activeFloorInfo?.lgInfo?.tableCount }}
              </td>
              <td class="text-center">
                {{ reportStore.activeFloorInfo?.lgInfo?.playerCount }}
              </td>
              <td class="text-center">
                {{ formatPrice(reportStore.activeFloorInfo?.lgInfo?.avgBet) }}
              </td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-orange-7' : 'bg-orange-1',
                ]"
              >
                {{
                  formatPrice(
                    reportStore.activeFloorInfo?.lgInfo?.totalCashDrop
                  )
                }}
              </td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-green-7' : 'bg-green-1',
                ]"
              >
                {{
                  formatPrice(reportStore.activeFloorInfo?.lgInfo?.totalResult)
                }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card flat square>
      <q-card-section>
        <div class="text-subtitle1 text-bold">
          {{ $t("activeFloorInfo.sitPlayers") }}
        </div>
        <Information
          class="full-width q-mt-sm q-mb-sm"
          content="Aktif oyun oynayan oyuncu bilgilerini verir."
        />
        <q-markup-table square flat bordered separator="cell" dense>
          <thead>
            <tr class="app-cart-grey">
              <th class="text-center">Player Name</th>
              <th class="text-center">Table Name</th>
              <th class="text-center">Cash Drop</th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-blue-7' : 'bg-blue-1',
                ]"
              >
                Chip Drop
              </th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-red-7' : 'bg-red-1',
                ]"
              >
                Avg Bet
              </th>
              <th
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-green-7' : 'bg-green-1',
                ]"
              >
                Total Result
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in reportStore.activeFloorInfo?.sitPlayers"
              :key="index"
            >
              <td class="text-center">{{ item.playerName }}</td>
              <td class="text-center">{{ item.tableName }}</td>
              <td class="text-center">{{ formatPrice(item.cashDrop) }}</td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-blue-7' : 'bg-blue-1',
                ]"
              >
                {{ formatPrice(item.chipDrop) }}
              </td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-red-7' : 'bg-red-1',
                ]"
              >
                {{ formatPrice(item.avgBet) }}
              </td>
              <td
                :class="[
                  'text-center',
                  'text-bold',
                  $q.dark.isActive ? 'bg-green-7' : 'bg-green-1',
                ]"
              >
                {{ formatPrice(item.result) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card flat square>
      <q-card-section>
        <div class="text-subtitle1 text-bold">
          {{ $t("activeFloorInfo.activeTables") }}
        </div>
        <Information
          class="full-width q-mt-sm q-mb-sm"
          content="Akitf olan masa ve üzerindeki oyuncu bilgilerini verir."
        />
        <q-markup-table square flat bordered separator="cell" dense>
          <thead>
            <tr class="app-cart-grey">
              <th class="text-center">Table Name</th>
              <th class="text-center">Players</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in reportStore.activeFloorInfo?.activeTables"
              :key="index"
            >
              <td class="text-center">{{ item.tableName }}</td>
              <td>
                <q-markup-table square flat bordered separator="cell" dense>
                  <thead>
                    <tr class="app-cart-grey">
                      <th class="text-center">Player Name</th>
                      <th class="text-center">Cash Drop</th>
                      <th class="text-center">Chip Drop</th>
                      <th class="text-center">Avg Bet</th>
                      <th class="text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(player, i) in item?.players" :key="i">
                      <td class="text-center">{{ player.playerName }}</td>
                      <td class="text-center">
                        {{ formatPrice(player.cashDrop) }}
                      </td>
                      <td class="text-center">
                        {{ formatPrice(player.chipDrop) }}
                      </td>
                      <td class="text-center">
                        {{ formatPrice(player.avgBet) }}
                      </td>
                      <td class="text-center">
                        {{ formatPrice(player.result) }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page> -->
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
