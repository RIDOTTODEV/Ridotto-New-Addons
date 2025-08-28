import { defineBoot } from '#q-app/wrappers'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
export default defineBoot(async ({ app }) => {
  app.use(ElementPlus)
})
