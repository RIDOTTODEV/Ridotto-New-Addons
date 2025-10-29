import { defineBoot } from '#q-app/wrappers'
import { Screen } from 'quasar'

export const getWindowHeight = () => {
  const height = Screen.height
  return Math.round((90 * height) / 100)
}

// directives
import qDraggableTable from 'quasar-ui-q-draggable-table'
import VueGridLayout from 'vue-grid-layout-v3'

import 'quasar-ui-q-draggable-table/dist/index.css'
import Permission from 'src/directive/Permission'
import createPlayerDetailDirective from 'src/directive/PlayerDetail'

// components
import SupaTable from '../components/atoms/SupaTable.vue'
import Sidebar from 'src/components/layout/Sidebar.vue'
import Header from 'src/components/layout/Header.vue'
import DateTimePicker from 'src/components/atoms/DateTimePicker.vue'
import QCurrencyInput from 'src/components/atoms/QCurrencyInput.vue'
import Information from 'src/components/ui/Information.vue'
import ChipGrid from 'src/components/atoms/ChipGrid.vue'
import ChipDetailTable from 'src/components/atoms/ChipDetailTable.vue'
import QSelectBox from 'src/components/atoms/QSelectBox.vue'
import SearchPlayerInput from 'src/components/atoms/SearchPlayerInput.vue'
import SearchMachineInput from 'src/components/atoms/SearchMachineInput.vue'
import Confirm from 'src/components/ui/Confirm.vue'
// this boot file will register component and the directive and other global properties
export default defineBoot(async ({ app, router }) => {
  // directives
  app.use(qDraggableTable)
  app.use(VueGridLayout)
  app.directive('el-perms', Permission)
  app.directive('player-detail', createPlayerDetailDirective(router))

  // components
  app.component('SupaTable', SupaTable)
  app.component('Sidebar', Sidebar)
  app.component('AppHeader', Header)
  app.component('DateTimePicker', DateTimePicker)
  app.component('QCurrencyInput', QCurrencyInput)
  app.component('Information', Information)
  app.component('ChipGrid', ChipGrid)
  app.component('ChipDetailTable', ChipDetailTable)
  app.component('QSelectBox', QSelectBox)
  app.component('SearchPlayerInput', SearchPlayerInput)
  app.component('SearchMachineInput', SearchMachineInput)
  app.component('Confirm', Confirm)
  // global properties
  app.config.globalProperties.$playerPhotoUrl = process.env.PLAYER_PHOTO_URL
  app.config.globalProperties.$getWindowHeight = getWindowHeight()
})
