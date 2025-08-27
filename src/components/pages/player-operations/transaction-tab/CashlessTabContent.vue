<template>
  <div class="row full-width">
    <div class="col-5 q-pa-xs">
      <Accounts :player-id="playerId" v-if="selectedPlayer" />
    </div>
    <div class="col-7 q-pa-xs">
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
