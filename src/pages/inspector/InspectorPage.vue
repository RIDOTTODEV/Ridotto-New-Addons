<script setup>
import ExchangeRates from 'src/pages/inspector/components/ExchangeRates.vue'
import { useInspector } from 'src/composables/inspectors/useInspector'
import CurrentPlayerChipHistory from 'src/pages/inspector/components/CurrentPlayerChipHistory.vue'
import CurrentPlayerCashHistory from 'src/pages/inspector/components/CurrentPlayerCashHistory.vue'
import { formatPrice } from 'src/helpers/helpers'

const {
  getTableFloatDenomsAsGroup,
  tableSitPlayers,
  playersTableColumns,
  inspectorTables,
  currentTable,
  upFunctionCards,
  currentTab,
  date,
  currentPlayer,
  currentTableCurrency,
  digitalClock,
  onClickSelectTable,
  onClickPlayerTimePauseOrResume,
  selectionInspectorTables,
  onClickDefineAverageBet,
  onClickTimeOutCurrentPLayer,
  onClickCashInOut,
  onClickChipInOut,
  onClickShowPhoto,
  onClickPlayer,
  onClickOrderToPlayer,
  mainOidc,
  currentInspector,
  onClickMarkerInOut,
  onClickDeletePlayer,
  onClickPlayerLgInfo,
} = useInspector()
</script>

<template>
  <q-page class="q-pa-md app-content-bg">
    <q-header elevated class="app-cart-grey text-dark">
      <q-toolbar>
        <q-toolbar-title class="row flex content-center items-center">
          <div class="col-5">
            <div class="row flex content-center items-center">
              <q-avatar>
                <q-icon name="o_person" size="sm" />
              </q-avatar>
              <div class="text-h6 text-capitalize">
                {{ currentInspector?.inspectorName }}
              </div>
              <div class="text-h6 q-ml-lg text-negative text-bold">
                {{ currentTable?.name }}
              </div>
            </div>
          </div>
          <div class="col-2">
            <q-btn flat padding="0px" class="bg-blue-grey-8 full-width" glossy>
              <template v-slot:default>
                <div class="row q-pa-xs q-card--bordered full-width text-grey-2">
                  <div class="col-12 q-pa-xs q-card--bordered" style="border: 1px solid white">
                    <div class="text-h5 text-bold">{{ digitalClock }}</div>
                  </div>
                </div>
              </template>
            </q-btn>
          </div>
          <div class="col-5">
            <div class="flex content-end items-end justify-end">
              <exchange-rates v-el-perms="'Addon.Inspector.Action.ExchangeRates'" />
              <q-btn
                color="grey-2"
                unelevated
                class="q-mr-sm q-card--bordered"
                text-color="dark"
                no-wrap
                no-caps
                @click="mainOidc.signOut()"
              >
                <q-icon name="logout" size="sm" class="q-mr-xs" />
                <div>Logout</div>
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="row">
      <div class="col-12 q-pa-xs">
        <div class="row">
          <div class="col-5 q-pa-xs">
            <div
              v-for="(chip, chipIndex) in getTableFloatDenomsAsGroup"
              :key="chipIndex"
              :class="
                chip[0]?.chipType === 'Plate'
                  ? 'q-mt-sm row bg-white q-card--bordered'
                  : 'row bg-white q-card--bordered'
              "
            >
              <div class="col bg-white text-left q-card--bordered">
                <div class="text-caption text-bold q-ml-sm">
                  {{ chip[0]?.chipType }}
                  <span class="text-negative">*</span>
                </div>
                <div class="bg-dark text-caption text-white text-left text-bold full-width">
                  <span class="q-ml-sm">Qty</span>
                </div>
              </div>
              <div
                class="col bg-white text-center q-card--bordered"
                v-for="(item, itemIndex) in chip"
                :key="itemIndex"
              >
                <div class="text-caption text-bold">
                  {{ item?.chipValue }}
                </div>
                <div class="bg-dark text-caption text-white text-center text-bold full-width">
                  {{ item.quantity }}
                </div>
              </div>
            </div>
          </div>
          <div class="col row">
            <q-btn
              v-for="(table, index) in inspectorTables"
              :key="index"
              text-color="grey-5"
              @click="onClickSelectTable(table)"
              style="width: 150px !important"
              outline
              padding="5px"
              :class="
                currentTable?.id === table.id
                  ? 'heartbeat bg-green-1 col q-ma-xs'
                  : '  bg-white col q-ma-xs'
              "
            >
              <template v-slot:default>
                <div class="row text-blue-grey-8">
                  <div class="row col-12">
                    <div class="col-12">
                      <q-icon
                        name="task_alt"
                        size="2em"
                        color="positive"
                        v-if="currentTable?.chipSaveLock"
                      >
                        <q-tooltip class="app-cart-grey text-dark text-subtitle2" :delay="1500">{{
                          $t('tableChipSaveLock')
                        }}</q-tooltip>
                      </q-icon>
                    </div>
                    <div class="col-12 flex justify-center">
                      <div class="text-subtitle2 text-bold">
                        {{ table.name }}
                        <q-tooltip :delay="2000" class="app-cart-grey text-dark text-subtitle2">{{
                          $t('tableName')
                        }}</q-tooltip>
                      </div>
                    </div>
                    <div class="col-12 flex justify-center">
                      <div class="text-caption text-bold q-ml-sm text-negative">
                        {{ table?.gameName }}
                        <q-tooltip :delay="2000" class="app-cart-grey text-dark text-subtitle2">{{
                          $t('tableGameName')
                        }}</q-tooltip>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="text-caption text-bold">
                        {{ table?.floatSetName }}
                        <q-tooltip :delay="2000" class="app-cart-grey text-dark text-subtitle2">{{
                          $t('tableFloatSet')
                        }}</q-tooltip>
                      </div>
                    </div>
                    <div class="col-12">
                      <q-chip square dense class="text-caption" icon="calendar_month">
                        {{ table?.gamingDateName }}
                        <q-tooltip class="app-cart-grey text-dark text-subtitle2">{{
                          $t('tableGamingDate')
                        }}</q-tooltip>
                      </q-chip>
                    </div>
                  </div>

                  <div
                    class="absolute-top-left text-caption text-negative rounded-borders q-mt-xs q-ml-xs"
                  >
                    <span class="q-pl-xs q-pr-xs"> {{ currentTableCurrency?.name }}</span>
                    <q-tooltip class="app-cart-grey text-dark text-subtitle2">{{
                      $t('tableChipCurrency')
                    }}</q-tooltip>
                  </div>
                  <div
                    v-if="table?.isAnyoneSit"
                    class="absolute-top-right text-caption bg-negative text-white rounded-borders q-mt-xs q-mr-xs"
                  >
                    <span class="q-pl-xs q-pr-xs"> <q-icon name="group" size="15px" /></span>
                    <q-tooltip class="app-cart-grey text-dark text-subtitle2">{{
                      $t('hasPlayers')
                    }}</q-tooltip>
                  </div>
                </div>
              </template>
            </q-btn>
          </div>
          <div class="col-2 row">
            <q-btn
              class="q-ma-xs bg-white full-width"
              unelevated
              color="grey-6"
              @click="selectionInspectorTables"
              outline
              v-el-perms="'Addon.Inspector.Action.SelectTable'"
            >
              <template v-slot:default>
                <div class="row">
                  <div class="row col-12">
                    <div class="col-12">
                      <q-img src="/inspectors/icons8-add-50.png" width="50px" />
                    </div>
                  </div>
                </div>
              </template>
            </q-btn>
          </div>
        </div>
        <div class="row q-pa-xs flex content-center items-center justify-start">
          <div class="col q-mt-sm flex justify-between no-wrap">
            <q-btn
              color="grey-1"
              unelevated
              class="q-mr-sm q-card--bordered"
              text-color="dark"
              no-wrap
              no-caps
              v-for="(item, index) in upFunctionCards"
              :key="index"
              @click="item.fn"
              v-el-perms="item.elPermission"
            >
              <q-img v-if="item.icon" :src="'/' + item.icon" width="25px" class="q-mr-xs" />
              <div>{{ item.title }}</div>
            </q-btn>
          </div>
          <div class="col"></div>
        </div>
      </div>
      <div class="col-7 q-pa-xs">
        <q-table
          square
          dense
          bordered
          separator="cell"
          class="no-box-shadow myTable bg-transparent"
          table-class="separateTwiceRow"
          :rows-per-page-options="[0]"
          :rows="tableSitPlayers"
          :columns="playersTableColumns"
          hide-bottom
          row-key="playerId"
          style="margin-top: 1px !important"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="
                currentPlayer?.playerId === props.row.playerId
                  ? 'inspectorTableRow cursor-pointer inpectorTable'
                  : 'cursor-pointer inpectorTable'
              "
            >
              <q-td
                auto-width
                key="playerImage"
                align="center"
                @click="onClickShowPhoto(props.row)"
                v-el-perms="'Addon.Inspector.Player.ShowPhoto'"
              >
                <q-img
                  :src="
                    props.row.playerImage
                      ? 'data:image/png;base64,' + props.row.playerImage
                      : '/assets/no-photo.png'
                  "
                  width="45px"
                  class="q-ma-xs"
                  style="border-radius: 5px"
                />
              </q-td>
              <q-td
                auto-width
                key="playerName"
                align="center"
                @click="onClickPlayer(props.row, true)"
                v-el-perms="'Addon.Inspector.Player.SelectPlayer'"
              >
                <div class="text-subtitle2">{{ props.row.playerName }}</div>
                <q-badge
                  v-if="props.row.marker !== 0"
                  align="top"
                  floating
                  class="q-mr-sm q-mt-sm"
                  color="negative"
                >
                  <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                    <div class="text-subtitle2">
                      {{ $t('markerIn') }} :
                      {{ formatPrice(props.row?.marker) }}
                    </div>
                  </q-tooltip>
                </q-badge>
              </q-td>
              <q-td
                auto-width
                key="avgBet"
                align="center"
                @click="
                  () => {
                    onClickPlayer(props.row)
                    onClickDefineAverageBet()
                  }
                "
                v-el-perms="'Addon.Inspector.Player.DefineAverageBet'"
              >
                <div
                  class="text-subtitle2 avgBet"
                  :class="{ 'blink-warning': props.row.avgBet === 0 }"
                >
                  {{ props.row.avgBet }}
                </div>
                <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                  <Information
                    class="full-width"
                    content="Avg bet 0'is  oyuncuya avg bet girilmelidir."
                  />
                </q-tooltip>
              </q-td>
              <q-td auto-width key="inTime" align="center" class="cursor-not-allowed">
                <div class="text-subtitle2">
                  {{ date.formatDate(props.row.inTime, 'HH:mm') }}
                </div>
              </q-td>
              <q-td
                auto-width
                key="status"
                align="right"
                style="padding-right: 0 !important"
                v-el-perms="'Addon.Inspector.Player.TimePauseOrResume'"
              >
                <q-btn
                  color="grey-2"
                  unelevated
                  class="q-mr-sm"
                  text-color="dark"
                  no-wrap
                  no-caps
                  @click="
                    () => {
                      ;(onClickPlayer(props.row), onClickPlayerTimePauseOrResume(props.row))
                    }
                  "
                >
                  <q-img
                    :src="
                      props.row.status === 'Pause'
                        ? '/inspectors/icons8-next-48.png'
                        : '/inspectors/icons8-pause-48.png'
                    "
                    width="25px"
                    class="q-mr-xs"
                  />
                  <div>
                    {{ props.row.status === 'Pause' ? $t('pause') : $t('playing') }}
                  </div>
                  <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                    <Information
                      class="full-width"
                      content="Player’ın masadaki oturma süresinin başlamasını veya durdurmasını sağlar"
                    />
                  </q-tooltip>
                </q-btn>

                <q-btn
                  color="grey-2"
                  unelevated
                  class="q-mr-sm"
                  text-color="dark"
                  no-wrap
                  no-caps
                  :disabled="props.row.marker !== 0"
                  @click="
                    () => {
                      ;(onClickPlayer(props.row), onClickTimeOutCurrentPLayer())
                    }
                  "
                  v-el-perms="'Addon.Inspector.Player.TimeOutCurrentPLayer'"
                >
                  <q-img
                    src="/inspectors/icons8-time-machine-40.png"
                    width="25px"
                    class="q-mr-xs"
                  />
                  <div>{{ $t('timeOut') }}</div>
                  <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                    <Information
                      class="full-width"
                      content="Player’ın masadan kaldırmak için kullanılır. Marker varsa kaldırılamaz."
                    />
                  </q-tooltip>
                </q-btn>
                <q-btn
                  color="grey-2"
                  unelevated
                  class="q-mr-sm"
                  text-color="dark"
                  no-wrap
                  no-caps
                  :disabled="props.row.marker !== 0"
                  @click="
                    () => {
                      ;(onClickPlayer(props.row), onClickDeletePlayer(props.row))
                    }
                  "
                  v-el-perms="'Addon.Inspector.Player.DeletePlayer'"
                >
                  <q-img src="/inspectors/icons8-remove-48.png" width="25px" class="q-mr-xs" />
                  <div>{{ $t('delete') }}</div>
                  <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                    <Information
                      class="full-width"
                      content="Player’ın masadan kaldırmak için kullanılır. Marker varsa kaldırılamaz."
                    />
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr :props="props">
              <q-td colspan="100%" style="padding: 0 !important">
                <div
                  :class="
                    currentPlayer?.playerId === props.row.playerId
                      ? 'inspectorTableRow row full-width inpectorTable'
                      : 'row full-width inpectorTable'
                  "
                  :style="
                    props.rowIndex === tableSitPlayers.length - 1
                      ? {
                          paddingTop: '6px',
                          paddingBottom: '8px',
                          paddingLeft: '10px',
                          marginBottom: '0!important',
                        }
                      : {
                          paddingTop: '6px',
                          paddingBottom: '8px',
                          paddingLeft: '10px',
                          //marginBottom: '10px!important',
                        }
                  "
                >
                  <div class="col-12 flex justify-end no-wrap">
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickMarkerInOut('MarkerIn'))
                        }
                      "
                      v-el-perms="'Addon.Inspector.Player.MarkerIn'"
                    >
                      <q-img
                        src="/inspectors/icons8-add-database-48.png"
                        width="25px"
                        class="q-mr-xs"
                      />
                      <div>{{ $t('markerIn') }}</div>
                    </q-btn>
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm q-pa-xs"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickMarkerInOut('MarkerOut'))
                        }
                      "
                      v-el-perms="'Addon.Inspector.Player.MarkerOut'"
                    >
                      <q-img
                        src="/inspectors/icons8-remove-database-48.png"
                        width="25px"
                        class="q-mr-xs"
                      />
                      <div>{{ $t('markerOut') }}</div>
                    </q-btn>
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm q-pa-xs"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickChipInOut('ChipIn'))
                        }
                      "
                      v-el-perms="'Addon.Inspector.Player.ChipIn'"
                    >
                      <q-img src="/inspectors/icons8-plus-48.png" width="25px" class="q-mr-xs" />
                      <div>{{ $t('chipIn') }}</div>
                    </q-btn>
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm q-pa-xs"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickChipInOut('ChipOut', 'Chip'))
                        }
                      "
                      v-el-perms="'Addon.Inspector.Player.ChipOut'"
                    >
                      <q-img src="/inspectors/icons8-remove-40.png" width="25px" class="q-mr-xs" />
                      <div>{{ $t('chipOut') }}</div>
                    </q-btn>
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm q-pa-xs"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickCashInOut())
                        }
                      "
                      v-el-perms="'Addon.Inspector.Player.CashIn'"
                    >
                      <q-img src="/inspectors/icons8-cash-64.png" width="25px" class="q-mr-xs" />
                      <div>{{ $t('cashIn') }}</div>
                    </q-btn>
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm q-pa-xs"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickOrderToPlayer())
                        }
                      "
                      v-el-perms="'Addon.Inspector.Player.OrderToPlayer'"
                    >
                      <q-img src="/inspectors/icons8-waiter-64.png" width="25px" class="q-mr-xs" />
                      <div>{{ $t('order') }}</div>
                      <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                        <Information
                          class="full-width"
                          content="Player’a sipariş vermek için kullanılır."
                        />
                      </q-tooltip>
                    </q-btn>
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm q-card--bordered"
                      text-color="dark"
                      no-wrap
                      no-caps
                      dense
                      v-el-perms="'Addon.Inspector.Action.Info'"
                      @click="
                        () => {
                          ;(onClickPlayer(props.row), onClickPlayerLgInfo())
                        }
                      "
                    >
                      <q-img src="inspectors/icons8-info.svg" width="25px" class="q-mr-xs" />
                      <div>Info</div>
                    </q-btn>
                  </div>
                </div>
              </q-td>
            </q-tr>
            <q-tr :props="props">
              <q-td colspan="100%" style="padding: 0 !important">
                <div
                  :class="
                    currentPlayer?.playerId === props.row.playerId
                      ? 'inspectorTableRow row full-width inpectorTable'
                      : 'row full-width inpectorTable'
                  "
                  :style="
                    props.rowIndex === tableSitPlayers.length - 1
                      ? {
                          paddingTop: '2px',
                          paddingBottom: '2px',
                          paddingLeft: '10px',
                          marginBottom: '0!important',
                        }
                      : {
                          paddingTop: '2px',
                          paddingBottom: '2px',
                          paddingLeft: '10px',
                          marginBottom: '10px!important',
                        }
                  "
                >
                  <div class="col-12 flex content-center items-center">
                    <div class="text-caption">
                      <span
                        v-for="chip in props.row?.chips.filter((chip) => chip.chipCode !== ' ')"
                        :key="chip.chipCode"
                        class="q-ml-sm"
                      >
                        {{ chip.chipCode }}=({{ chip.quantity }})
                      </span>
                    </div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                auto-width
                v-for="col in props.cols.filter((col) => col.name !== 'playerId')"
                :key="col.name"
                :props="props"
                class="text-center"
                style="padding: 0 !important"
                v-el-perms="col?.elPermission"
              >
                <div class="full-width full-height q-custom-table" style="margin-bottom: 7px">
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-5 q-pa-xs" v-show="currentPlayer">
        <q-tabs
          v-model="currentTab"
          dense
          active-color="white"
          indicator-color="blue-grey-8"
          active-bg-color="blue-grey-8"
          align="justify"
          narrow-indicator
          no-caps
          inline-label
          shrink
          style="max-width: 400px !important"
        >
          <q-tab
            name="currentPlayerChipHistory"
            class="q-card--bordered"
            :class="
              currentTab === 'currentPlayerChipHistory'
                ? 'q-mr-sm'
                : ' bg-grey-1 text-dark q-card--bordered'
            "
            :label="$t('chipHistory')"
            icon="o_casino"
            v-el-perms="'Addon.Inspector.Player.ChipHistory'"
          />
          <q-tab
            name="currentPlayerCashHistory"
            class="q-card--bordered"
            :class="
              currentTab === 'currentPlayerCashHistory'
                ? 'q-ml-sm'
                : ' bg-grey-1 text-dark q-card--bordered'
            "
            :label="$t('cashHistory')"
            icon="o_payments"
            v-el-perms="'Addon.Inspector.Player.CashHistory'"
          />
        </q-tabs>
        <q-tab-panels v-model="currentTab" animated class="q-mt-xs">
          <q-tab-panel name="currentPlayerChipHistory" class="q-pa-none">
            <Information
              class="full-width"
              content="Seçilen oyuncunun masada chip in ve chip out işlemleri gösterir."
            />
            <current-player-chip-history v-el-perms="'Addon.Inspector.Player.ChipHistory'" />
          </q-tab-panel>
          <q-tab-panel name="currentPlayerCashHistory" class="q-pa-none">
            <Information
              class="full-width"
              content="Seçilen oyuncunun masada cash drop bilgisini verir."
            />
            <current-player-cash-history v-el-perms="'Addon.Inspector.Player.CashHistory'" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.customTable .q-table__top {
  padding: 0 !important;
}

.myTable .q-table__middle {
  margin-top: 0 !important;
}

.separateTwiceRow table {
  border-collapse: separate;
  //border-spacing: 0 10px;
}

/* ----------------------------------------------
* Generated by Animista on 2023-6-8 13:7:44
* Licensed under FreeBSD License.
* See http://animista.net/license for more info.
* w: http://animista.net, t: @cssanimista
* ---------------------------------------------- */
.heartbeat {
  -webkit-animation: heartbeat 2.5s ease-in-out infinite alternate-reverse both;
  animation: heartbeat 2.5s ease-in-out infinite alternate-reverse both;
}

@-webkit-keyframes heartbeat {
  from {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: center center;
    transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.91);
    transform: scale(0.91);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
    transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.87);
    transform: scale(0.87);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}

@keyframes heartbeat {
  from {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: center center;
    transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    background-color: #1aff00 !important;
  }
  10% {
    -webkit-transform: scale(0.91);
    transform: scale(0.91);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
    transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.87);
    transform: scale(0.87);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}

@keyframes blink-warning {
  0% {
    background-color: #ff0000;
    color: #fff;
    opacity: 1;
    transform: scale(1);
  }
  50% {
    background-color: #ff0000;
    color: #fff;
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    background-color: #ff0000;
    color: #fff;
    opacity: 1;
    transform: scale(1);
  }
}

.blink-warning {
  animation: blink-warning 1s ease-in-out infinite;
  color: #fff;
  display: inline-block;
  transform-origin: center;
}
.avgBet {
  width: 20px;
}
.currencyBackground {
  background-color: rgb(244 71 35) !important;
}
</style>
