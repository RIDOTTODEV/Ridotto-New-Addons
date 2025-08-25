// Permission.js
import { useAuthStore } from 'src/stores/auth-store'
const authStore = useAuthStore()
export default {
  mounted(el, binding) {
    const permission = authStore.hasPermission(binding.value)
    if (!permission) {
      el.parentNode.removeChild(el)
    }
  },

  updated(el, binding) {
    const permission = authStore.hasPermission(binding.value)
    if (!permission) {
      el.parentNode?.removeChild(el)
    }
  },

  beforeUnmount(el, binding) {
    const permission = authStore.hasPermission(binding.value)
    if (!permission) {
      el.parentNode?.removeChild(el)
    }
  },
}
