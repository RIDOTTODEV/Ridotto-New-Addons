import { defineBoot } from '#q-app/wrappers'
import PrimeVue, { defaultOptions } from 'primevue/config'

import Aura from '@primeuix/themes/aura'
/* import Nora from '@primeuix/themes/nora'
import Material from '@primeuix/themes/material'
import Lara from '@primeuix/themes/lara' */
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import { definePreset } from '@primeuix/themes'
import Paginator from 'primevue/paginator'

import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ConfirmationService from 'primevue/confirmationservice'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{sky.950}',
          inverseColor: '#ffffff',
          hoverColor: '{sky.900}',
          activeColor: '{sky.800}',
        },
        highlight: {
          background: '{sky.950}',
          focusBackground: '{sky.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{sky.50}',
          inverseColor: '{sky.950}',
          hoverColor: '{sky.100}',
          activeColor: '{sky.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
})

export default defineBoot(async ({ app }) => {
  app.use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        prefix: 'p',
        darkModeSelector: '.dark',
        cssLayer: false,
      },
    },
    zIndex: {
      modal: 1100, //dialog, drawer
      overlay: 1000, //select, popover
      menu: 1000, //overlay menus
      tooltip: 1100, //tooltip
    },

    locale: {
      ...defaultOptions.locale,
    },
  })
  app.component('PButton', Button)
  app.component('DataTable', DataTable)
  app.component('Column', Column)
  app.component('Toast', Toast)
  app.use(ToastService)
  app.component('MultiSelect', MultiSelect)
  app.component('InputText', InputText)
  app.component('Paginator', Paginator)
  app.component('IconField', IconField)
  app.component('InputIcon', InputIcon)
  app.component('PSelect', Select)
  app.component('InputNumber', InputNumber)
  app.component('DatePicker', DatePicker)
  app.use(ConfirmationService)
})
