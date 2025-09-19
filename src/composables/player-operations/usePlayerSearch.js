import {
  /*   inject, */
  ref,
  watch,
  onMounted,
} from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from 'src/stores/player-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { formatPrice } from 'src/helpers/helpers'
import { useRouter } from 'vue-router'
export function usePlayerSearch() {
  const playerStore = usePlayerStore()
  const cashdeskStore = useCashdeskStore()
  const { lastSearchedPlayers } = storeToRefs(playerStore)
  const { cashDeskSummary } = storeToRefs(cashdeskStore)

  /* const signalR = inject('cardDeskConnection') */
  const router = useRouter()

  const searchedPlayerOptions = ref([])
  const selectedPlayer = ref(null)
  const searchPlayerLoading = ref(false)

  const redirectToPlayerDetail = (player = null) => {
    if (player) {
      selectedPlayer.value = { ...player }
    }
    playerStore.setLastSearchedPlayer(selectedPlayer.value)

    router.push({
      name: 'playerDetail',
      params: { playerId: selectedPlayer.value.id },
    })
  }

  const onSearchPlayer = async (val, update) => {
    if (val === '') {
      update(() => {
        searchedPlayerOptions.value = []
      })
      searchPlayerLoading.value = false
      return
    }
    const needle = val.toLowerCase()
    searchPlayerLoading.value = true
    const data = await playerStore.searchPlayer(needle)

    update(() => {
      searchedPlayerOptions.value = data
    })
    searchPlayerLoading.value = false

    if (data.length === 1) {
      setTimeout(() => {
        selectedPlayer.value = data[0]
        redirectToPlayerDetail()
      }, 1000)
    }
  }

  watch(selectedPlayer, (val) => {
    if (val === null) return
    redirectToPlayerDetail()
  })

  onMounted(() => {
    playerStore.initLastSearchedPlayers()
  })

  return {
    playerStore,
    cashdeskStore,
    formatPrice,
    lastSearchedPlayers,
    searchedPlayerOptions,
    selectedPlayer,
    searchPlayerLoading,
    onSearchPlayer,
    redirectToPlayerDetail,
    cashDeskSummary,
  }
}
