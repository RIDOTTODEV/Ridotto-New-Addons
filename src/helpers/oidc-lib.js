import { createOidcAuth, SignInType, LogLevel } from 'vue-oidc-client/vue3'
import { WebStorageStateStore, Log } from 'oidc-client'
import { useAuthStore } from 'stores/auth-store'
import { api } from 'boot/axios'
import { initialize } from 'boot/initialize'
const appRootUrl = process.env.BASE_URL

const oidcConf = {
  authority: process.env.OIDC_AUTH_URL,
  client_id: process.env.OIDC_CLIENT_ID,
  response_type: 'code',
  scope: 'openid profile roles api_scope permissions userclaims offline_access',

  monitorSession: true,
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),

  // Silent Renew ayarları
  automaticSilentRenew: true,
  silentRequestTimeout: 10000,
  silent_redirect_uri: `${appRootUrl}/silent-renew.html`,
  accessTokenExpiringNotificationTimeInSeconds: 60,
}
const mainOidc = createOidcAuth('main', SignInType.Window, appRootUrl, oidcConf, LogLevel.None)

Log.logger = console
Log.level = Log.DEBUG

// handle events
mainOidc.events.addAccessTokenExpiring(async function () {
  console.log('access token expiring')
  try {
    await mainOidc.startSilentRenew()
  } catch (error) {
    console.error('silent renew error', error)
    mainOidc.signOut().then(async () => {
      await mainOidc
        .signIn({
          useReplaceToNavigate: true,
          returnUrl: '/',
        })
        .catch(() => {
          window.location.href = appRootUrl
        })
    })
  }
})

mainOidc.events.addAccessTokenExpired(function () {
  console.log('access token expired')
  mainOidc.signOut().then(async () => {
    await mainOidc
      .signIn({
        useReplaceToNavigate: true,
        returnUrl: '/',
      })
      .catch(() => {
        window.location.href = appRootUrl
      })
  })
})

mainOidc.events.addSilentRenewError(function (err) {
  console.log('silent renew error', err)
  // console.error('silent renew error', err)
})

mainOidc.events.addUserLoaded(async function (user) {
  const authStore = useAuthStore()
  await authStore.setCurrentUser(user)
  api.defaults.headers.common['Authorization'] = `${user.token_type} ${user.access_token}`
  await initialize()
})

mainOidc.events.addUserUnloaded(function () {
  console.log('user unloaded')
})

mainOidc.events.addUserSignedOut(function () {
  console.log('user signed out')
})

mainOidc.events.addUserSessionChanged(function () {
  console.log('user session changed')
})

mainOidc.events.addUserSignedIn(function (user) {
  console.log('useruseruser', user)
})

export default mainOidc
