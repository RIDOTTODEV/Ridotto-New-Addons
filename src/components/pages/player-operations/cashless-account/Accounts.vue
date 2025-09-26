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
import { ref, onMounted, watch, inject } from 'vue'
import { usePlayerStore } from 'src/stores/player-store'
import Account from './Account.vue'
const playerStore = usePlayerStore()
const bus = inject('bus')
const accounts = ref([])
const loading = ref(false)

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
  const response = await playerStore.getAccountsWithTotals({ playerId: props.playerId })
  accounts.value = response.data
  loading.value = false
}
watch(
  () => playerStore.dateTimeFilterValues,
  (newVal) => {
    if (Object.keys(newVal).length > 0) {
      fetchPlayerCashlessAccounts()
    }
  },
)
bus.on('reloadCashlessAccounts', fetchPlayerCashlessAccounts)
</script>

<style scoped></style>
