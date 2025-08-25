<template>
  <q-page class="q-pa-md">
    <div class="row">
      <meta-details />
    </div>
    <div class="row q-mt-md">
      <tabs />
    </div>
  </q-page>
</template>
<script setup>
import { onMounted } from 'vue'
import MetaDetails from 'src/components/pages/player-operations/meta-detail/MetaDetails.vue'
import Tabs from 'src/components/pages/player-operations/transaction-tab/Tabs.vue'
import { usePlayer } from 'src/composables/player-operations/usePlayer'
const { initPlayer } = usePlayer()
onMounted(async () => {
  await initPlayer()
})
</script>
