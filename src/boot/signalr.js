import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from 'src/stores/auth-store'
import signalRService from 'src/helpers/signalr'
// this is a signalr connection to the card service
export default defineBoot(async ({ app, store, router }) => {
  const authStore = useAuthStore(store)
  /*   const cardDeskHubUrl = process.env.CARDDESK_HUB_URL */
  /*   const ridottoHubUrl = process.env.RIDOTTO_HUB_URL
   */ const inspectorHubUrl = process.env.INSPECTOR_HUB_URL
  /*   const cardDeskConnection = signalRService.connectToHub('carddesk', cardDeskHubUrl, false) */
  /*  const ridottoHubConnection = signalRService.connectToHub('ridotto', ridottoHubUrl) */
  let inspectorHubConnection = null

  router.beforeEach((to, from, next) => {
    if (to.name === 'inspector') {
      inspectorHubConnection = signalRService.connectToHub(
        'inspector',
        inspectorHubUrl,
        true,
        authStore.user.access_token,
      )
      app.provide('inspectorHubConnection', inspectorHubConnection)
    }
    next()
  })

  /*   app.provide('cardDeskConnection', cardDeskConnection) */
  app.provide('cardDeskConnection', {})
  app.provide('ridottoHubConnection', {})
})
