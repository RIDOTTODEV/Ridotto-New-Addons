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
import { ref, onMounted, inject } from 'vue'
import { usePlayerStore } from 'src/stores/player-store'
import Account from './Account.vue'
const playerStore = usePlayerStore()
const accounts = ref([])
const loading = ref(false)
const bus = inject('bus')
const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
})
onMounted(async () => {
  loading.value = true
  fetchPlayerCashlessAccounts()
})

const fetchPlayerCashlessAccounts = async () => {
  const res = await playerStore.fetchPlayerAccounts({ playerId: props.playerId })
  accounts.value = res.accounts
  loading.value = false
}
bus.on('reloadPlayerCashless', fetchPlayerCashlessAccounts)
</script>

<style scoped></style>
