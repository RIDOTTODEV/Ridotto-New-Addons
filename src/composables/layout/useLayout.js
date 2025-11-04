import { ref, onMounted } from 'vue'

import { useQuasar } from 'quasar'
import SetCashDesk from 'src/components/atoms/SetCashDesk.vue'
export const useLayout = () => {
  const drawer = ref(true)
  const $q = useQuasar()

  onMounted(() => {
    if ($q.screen.xs === true || $q.screen.sm === true) {
      drawer.value = false
    } else {
      drawer.value = true
    }
  })

  const onToggleDrawer = () => {
    drawer.value = !drawer.value
  }
  return {
    drawer,
    SetCashDesk,
    onToggleDrawer,
  }
}
