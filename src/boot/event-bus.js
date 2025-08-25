import { defineBoot } from '#q-app/wrappers'
import { EventBus } from 'quasar'

// this is a event bus for the app
const bus = new EventBus()
export default defineBoot(async ({ app }) => {
  app.config.globalProperties.$bus = bus
  app.provide('bus', bus)
})
export { bus }
