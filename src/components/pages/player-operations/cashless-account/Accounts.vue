<template>
  <div class="row">
    <Account
      v-for="account in accounts"
      :key="account.id"
      :account="account"
      :player-id="playerId"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlayerStore } from 'src/stores/player-store'
import Account from './Account.vue'
const playerStore = usePlayerStore()
const accounts = ref([])
const loading = ref(false)
const props = defineProps({
  playerId: {
    type: Number,
    required: true,
  },
})
onMounted(async () => {
  loading.value = true
  const res = await playerStore.fetchPlayerAccounts({ playerId: props.playerId })
  accounts.value = res.accounts
  loading.value = false
})
</script>

<style scoped></style>
