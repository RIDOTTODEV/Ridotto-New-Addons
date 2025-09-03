import { ref, inject, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
const authStore = useAuthStore()
import SetCashDesk from 'src/components/atoms/SetCashDesk.vue'
export const useLayout = () => {
  const drawer = ref(true)
  const chubConnection = inject('ridottoHubConnection')

  onMounted(() => {
    chubConnection.on('WebPanelGamingDateSwitch', () => {
      authStore.fetchDefaultGamingDateInfo()
    })
  })
  return {
    drawer,
    SetCashDesk,
  }
}
