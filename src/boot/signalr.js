import { defineBoot } from '#q-app/wrappers'

import signalRService from 'src/helpers/signalr'
// this is a signalr connection to the card service
export default defineBoot(async ({ app }) => {
  const cardDeskHubUrl = process.env.CARDDESK_HUB_URL
  const ridottoHubUrl = process.env.RIDOTTO_HUB_URL
  const cardDeskConnection = signalRService.connectToHub('carddesk', cardDeskHubUrl, false)
  const ridottoHubConnection = signalRService.connectToHub('ridotto', ridottoHubUrl)
  app.provide('cardDeskConnection', cardDeskConnection)
  app.provide('ridottoHubConnection', ridottoHubConnection)
})
