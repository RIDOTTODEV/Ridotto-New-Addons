import { ref } from 'vue'
import SetCashDesk from 'src/components/atoms/SetCashDesk.vue'
export const useLayout = () => {
  const drawer = ref(true)

  return {
    drawer,
    SetCashDesk,
  }
}
