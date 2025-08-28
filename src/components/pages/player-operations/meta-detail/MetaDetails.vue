<template>
  <q-card class="full-width" square v-if="selectedPlayer">
    <q-card-section class="row q-pa-none">
      <div class="col-4 q-pa-sm">
        <PlayerProfile />
      </div>
      <div class="col-2 q-pa-sm flex justify-center content-start">
        <q-chip
          v-for="(account, index) in playerDepositAndCredits"
          :key="index"
          color="grey-2"
          text-color="black"
          size="13px"
          no-caps
          square
          class="full-width"
        >
          <div class="row full-width">
            <div class="text-caption col-12 flex justify-center content-center items-center">
              {{ account.transType }}
              {{ priceAbsFormatted(account.balance) }}
            </div>
          </div>
        </q-chip>

        <div class="">
          <q-chip
            :color="selectedPlayer.player.isActive ? 'green-8' : 'red-8'"
            text-color="white"
            size="11px"
            no-caps
            square
            :label="$t(selectedPlayer.player.isActive ? 'isActive' : 'isNotActive')"
            class="full-width"
            :icon="selectedPlayer.player.isActive ? 'fa fa-check' : 'fa fa-times'"
            clickable
            @click="onChangeActiveStatus"
          />
          <q-chip
            :color="selectedPlayer.player.discountStatus ? 'green-8' : 'red-8'"
            text-color="white"
            size="11px"
            no-caps
            square
            :label="$t(selectedPlayer.player.discountStatus ? 'discount' : 'noDiscount')"
            class="full-width"
            :class="{
              'blink-warning': !selectedPlayer.player.discountStatus,
            }"
            :icon="selectedPlayer.player.discountStatus ? 'fa fa-check' : 'fa fa-times'"
            clickable
            @click="onChangeDiscountStatus"
          />
          <q-chip
            v-if="selectedPlayer.player.isSit"
            color="red-8"
            text-color="white"
            size="11px"
            no-caps
            square
            :label="selectedPlayer.player.floorNo"
            class="full-width blink-warning"
            icon="fa fa-check"
          />
        </div>
      </div>
      <div class="col-3 q-pa-sm">
        <PlayerFriends
          v-if="selectedPlayer"
          :player="selectedPlayer.player"
          :player-id="playerId"
          :show-friends-permission="'Addon.Operations.CustomerInformation.ShowFriends'"
          :reload-friends-permission="'Addon.Operations.CustomerInformation.ReloadFriends'"
        />
      </div>
      <div class="col-3 q-pa-sm">
        <PlayerNote
          v-if="selectedPlayer"
          :player-id="playerId"
          :note-source="'General'"
          :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
          :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
          :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
          :min-height="60"
          :title="$t('generalNotes')"
        />
        <PlayerNote
          v-if="selectedPlayer"
          :player-id="playerId"
          :note-source="'PublicRelations'"
          :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
          :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
          :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
          :min-height="60"
          :title="$t('publicRelationsNotes')"
        />
      </div>
    </q-card-section>
    <q-card-section class="row flex justify-start q-pt-none q-pb-sm q-px-sm">
      <q-btn
        data-cy="newCageTransaction"
        v-el-perms="'Addon.CashlessOperations.Transaction.CreateCageTransaction'"
        class="q-mr-sm q-card--bordered"
        no-caps
        size="13px"
        :label="$t('cashTransaction')"
        icon="o_payments"
        unelevated
        color="grey-2"
        text-color="black"
        @click="onClickPlayerCashTransaction"
      />

      <q-btn
        class="q-mr-sm q-card--bordered"
        no-caps
        size="13px"
        :label="$t('inOutSelectedNameReport')"
        icon="o_import_export"
        unelevated
        color="grey-2"
        text-color="black"
        @click="showInOutSelectedNameReport = true"
      />
      <date-time-picker
        v-el-perms="'Addon.CashlessOperations.Transaction.Filter'"
        class="q-mr-sm q-card--bordered"
        @selected-date="playerStore.setDateTimeFilterValues"
      />
    </q-card-section>
  </q-card>

  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :class="maximizedReport ? '' : 'historyModal'"
    backdrop-filter="brightness(40%)"
    v-model="showInOutSelectedNameReport"
  >
    <q-card
      class="app-content-bg"
      :style="maximizedReport ? '' : `height: ${$getWindowHeight}px!important;`"
    >
      <q-bar>
        <q-space />
        <q-btn dense flat icon="minimize" v-close-popup>
          <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximizedReport = !maximizedReport">
          <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-none" v-if="showInOutSelectedNameReport">
        <InOutSelectedNameReport :filterParams="inOutSelectedNameReportFilterParams" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import PlayerProfile from 'src/components/pages/player-operations/meta-detail/PlayerProfile.vue'
import { usePlayer } from 'src/composables/player-operations/usePlayer'
import PlayerNote from 'src/components/pages/player-operations/meta-detail/PlayerNote.vue'
import PlayerFriends from 'src/components/pages/player-operations/meta-detail/PlayerFriends.vue'
import InOutSelectedNameReport from 'src/pages/reports/inout-reports/InOutSelectedNameReport.vue'
const {
  selectedPlayer,
  playerDepositAndCredits,
  priceAbsFormatted,
  onClickPlayerCashTransaction,
  playerStore,
  showInOutSelectedNameReport,
  inOutSelectedNameReportFilterParams,
  maximizedReport,
  playerId,
  onChangeActiveStatus,
  onChangeDiscountStatus,
} = usePlayer()
</script>

<style lang="scss">
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
    opacity: 1;
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
</style>
