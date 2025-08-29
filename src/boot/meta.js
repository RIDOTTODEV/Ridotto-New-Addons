import { defineBoot } from '#q-app/wrappers'
import { i18n } from 'boot/i18n'

// this is a meta data for the app
export default defineBoot(async ({ router }) => {
  const updateMeta = (routeName) => {
    const title = 'Ridotto'
    const template = routeName ? `${title} - ${i18n.global.t(`${routeName}`)}` : title

    // Update document title directly
    document.title = template

    // Update meta tags if needed
    const metaTags = {
      title: title,
      titleTemplate: () => template,
    }

    return metaTags
  }
  updateMeta()
  router.beforeEach((to, from, next) => {
    const routeName = to.name
    updateMeta(routeName)
    next()
  })
})
