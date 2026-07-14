import { defineBoot } from '#q-app/wrappers'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
    },
    formField: {
      sm: {
        fontSize: '0.75rem',
        paddingX: '0.5rem',
        paddingY: '0.25rem'
      },
      lg: {
        fontSize: '1rem',
        paddingX: '0.875rem',
        paddingY: '0.625rem'
      }
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        },
        formField: {
          focusBorderColor: '{zinc.950}'
        }
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        },
        formField: {
          focusBorderColor: '{zinc.50}'
        }
      }
    }
  }
});

export default defineBoot(async ({ app }) => {
  app.use(PrimeVue, {
    theme: {
      preset: Noir,
      options: {
        darkModeSelector: '.q-dark',
        prefix: 'p',
        cssLayer: false,
        cssVariables: true
      },
      zIndex: {
        modal: 1100,        //dialog, drawer
        overlay: 1000,      //select, popover
        menu: 1000,         //overlay menus
        tooltip: 1100       //tooltip
    }
    },
     license: process.env.VITE_PRIMEUI_LICENSE_KEY
  });
});
