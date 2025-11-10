<template>
  <div class="row">
    <div class="col-md-5 col-sm-12 col-xs-12 q-pt-xs">
      <Accounts :player-id="playerId" v-if="selectedPlayer" />
    </div>
    <div class="col-md-7 col-sm-12 col-xs-12 q-pa-xs">
      <LastCashlessTransaction :player-id="playerId" v-if="selectedPlayer" class="q-mb-md" />
      <LastCageTransaction :player-id="playerId" v-if="selectedPlayer" />
    </div>
  </div>
</template>

<script setup>
import Accounts from 'src/components/pages/player-operations/cashless-account/Accounts.vue'
import LastCageTransaction from 'src/components/pages/player-operations/transactions/LastCageTransaction.vue'
import LastCashlessTransaction from 'src/components/pages/player-operations/transactions/LastCashlessTransaction.vue'
import { usePlayer } from 'src/composables/player-operations/usePlayer'
const { selectedPlayer, playerId } = usePlayer()
</script>

<style scoped></style>
