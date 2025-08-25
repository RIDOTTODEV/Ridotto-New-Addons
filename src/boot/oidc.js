import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from 'src/stores/auth-store'
import mainOidc from 'src/helpers/oidc-lib'
import { initialize } from 'boot/initialize'

// this is a oidc connection to the main service
export default defineBoot(async ({ app, store, router }) => {
  const authStore = useAuthStore(store)
  const startupMainOidc = await mainOidc.startup()

  if (!startupMainOidc) {
    console.error('Failed to startup main oidc')
    //throw new Error('Failed to startup main oidc')
  }

  mainOidc.useRouter(router)
  const isAuthenticated = await mainOidc.isAuthenticated
  if (isAuthenticated) {
    const user = await mainOidc.user
    await authStore.setCurrentUser(user)
    await initialize()
  }

  app.provide('oidc', mainOidc)

  router.beforeEach(async (to, from, next) => {
    /*     const requiredPermission = to.meta.requiredPermission
    const requiresAuth = to.meta.requiresAuth || false
    const hasPermission = authStore.hasPermission(requiredPermission)
    const isInspector = authStore.isInspector
    if (requiresAuth && !mainOidc.isAuthenticated) {
      mainOidc.signIn()
    } else if (requiresAuth && !hasPermission) {
      next({ name: 'notAuthorized' })
    } else if (requiresAuth && isInspector && to.path !== '/inspector') {
      next({ path: 'inspector' })
    } else if (requiresAuth && !isInspector && to.path === '/inspector') {
      next({ path: 'notAuthorized' })
    } else {
      next()
    } */
    next()
  })
})
