import { inject, ref, watch, onMounted } from 'vue'
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

  const signalR = inject('signalR')
  const router = useRouter()

  const searchedPlayerOptions = ref([])
  const selectedPlayer = ref(null)
  const searchPlayerLoading = ref(false)

  const redirectToPlayerDetail = (player = null) => {
    if (player) {
      selectedPlayer.value = { ...player }
    }
    playerStore.setLastSearchedPlayer(selectedPlayer.value)

    const currentRoute = router.currentRoute.value.name
    if (currentRoute === 'playerOperations') {
      router.push({
        name: 'playerDetail',
        params: { playerId: selectedPlayer.value.id },
      })
    } else {
      router.push({
        name: 'customerInformation',
        query: { playerId: selectedPlayer.value.id },
      })
    }
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
    console.log('data', data)
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

  // listen to the hub for player search
  signalR.on('CardInserted', async (payload) => {
    if (router.currentRoute.value.name === 'players') {
      const needle = payload?.assistId
      const player = await playerStore.searchPlayer(needle)
      if (player) {
        // playerStore.setLastSearchedPlayer(player[0])

        await router.push({
          name: 'customerInformation',
          query: { playerId: player[0].id },
        })
      }
    }
  })

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
