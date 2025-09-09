import * as signalR from '@microsoft/signalr'

class SignalRService {
  constructor() {
    this.connections = {}
  }
  connectToHub(hubName, url, tryReconnect = true, token = null) {
    if (this.connections[hubName]) {
      return this.connections[hubName]
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
      })
      .build()
    const reconnect = () => {
      setTimeout(() => {
        console.log(`${hubName} bağlantısı kopmuş, yeniden bağlanmaya çalışılıyor...`)

        connection.start().catch((err) => {
          console.error(`${hubName} yeniden bağlanırken hata:`, err)
          reconnect()
        })
      }, 5000)
    }
    connection.onclose(() => (tryReconnect ? reconnect() : null))
    connection
      .start()
      .then(() => {
        console.log(`${hubName} bağlantısı başarılı!`)
      })
      .catch((err) => {
        console.error(`${hubName} bağlantısı başarılı!`, err)
        reconnect()
      })

    this.connections[hubName] = connection
    return connection
  }
  getConnection(hubName) {
    if (this.connections[hubName]) {
      return this.connections[hubName]
    }
    return null
  }
  stopConnection(hubName) {
    if (this.connections[hubName]) {
      this.connections[hubName].stop()
      console.log(`${hubName} bağlantısı durduruldu.`)
      delete this.connections[hubName]
    }
  }
}
const signalRService = new SignalRService()
export default signalRService
