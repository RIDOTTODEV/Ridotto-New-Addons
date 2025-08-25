import { defineBoot } from '#q-app/wrappers'
import * as signalR from '@microsoft/signalr'

// this is a signalr connection to the card service
export default defineBoot(async ({ app }) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.CARD_SERVICE_URL}`)
    .withAutomaticReconnect()
    .build()

  //await connection.start()
  app.provide('signalR', connection)
})
