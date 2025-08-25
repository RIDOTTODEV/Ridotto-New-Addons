<template>
  <q-dialog
    v-model="show"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    transition-duration="400"
  >
    <q-card
      class="bg-dark text-white"
      style="opacity: 0.9"
      @click="selectedCashDesk?.id ? (show = false) : (show = true)"
    >
      <q-card-section class="flex flex-center q-mt-xl">
        <div style="width: 800px">
          <div class="row">
            <div class="col-12">
              <div class="text-h6 q-ml-md">
                {{ $t('chooseCashDesk') }}
              </div>
              <div class="text-subtitle1 q-ml-md">
                {{ $t('Please choose the cashdesk account you want to use.') }}
              </div>
              <q-separator class="q-mt-md q-mb-md q-ml-md q-mr-md" color="grey-9" />
            </div>
            <div class="col-12 q-mt-md">
              <div class="text-h5 q-ml-md">
                {{ $t('cashDeskList') }}
              </div>
            </div>
            <div class="col-12 flex">
              <q-btn
                size="22px"
                class="q-px-xl q-py-xs q-ma-md"
                v-for="(cashDesk, i) in cashdesks"
                :key="i"
                :color="
                  currentCashDesk && currentCashDesk.id === cashDesk.id
                    ? 'primary'
                    : getCashDeskBgColor(cashDesk)
                "
                :text-color="
                  currentCashDesk && currentCashDesk.id === cashDesk.id ? 'white' : 'grey-2'
                "
                no-caps
                unelevated
                @click="setCurrentCashDesk(cashDesk)"
                :data-cy="i === 0 ? 'MainCashDesk' : 'CashDesk' + i"
              >
                <template v-slot:default>
                  <div class="text-h6">
                    {{ cashDesk.name }}
                    <div class="text-caption">
                      {{ cashDesk.gamingDate }}
                    </div>
                  </div>
                </template>
              </q-btn>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, inject } from 'vue'
import { Loading, QSpinnerGears } from 'quasar'
import { useRouter } from 'vue-router'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
const cashdeskStore = useCashdeskStore()
import { storeToRefs } from 'pinia'
const { cashdesks, selectedCashDesk } = storeToRefs(cashdeskStore)
const authStore = useAuthStore()
const { getDefaultGamingDateId } = storeToRefs(authStore)
const router = useRouter()

const getCashDeskBgColor = (cashDesk) => {
  return cashDesk.gamingDateId === getDefaultGamingDateId.value ? 'grey-8' : 'negative'
}
const currentCashDesk = ref(null)
const show = ref(false)
const bus = inject('bus')

bus.on('setNewCashDesk', () => {
  cashdeskStore.getCashdesks()
  show.value = !show.value
  if (selectedCashDesk.value) {
    currentCashDesk.value = selectedCashDesk.value
  }
})
const setCurrentCashDesk = (cashDesk) => {
  currentCashDesk.value = cashDesk
  cashdeskStore.setCurrentCashDesk(cashDesk)

  Loading.show({
    message: 'Loading',
    delay: 0,
    spinnerSize: 140,
    spinnerColor: 'white',
    spinner: QSpinnerGears,
    messageColor: 'white',
    backgroundColor: 'primary',
    messageClass: 'text-h6',
  })
  setTimeout(() => {
    Loading.hide()
    show.value = false

    //check if the route name is cashDeskDetail then redirect to cashDeskDetail with new params
    if (router.currentRoute.value.name === 'cashDeskDetail') {
      router
        .push({
          name: 'cashDeskDetail',
          params: {
            id: cashDesk.id,
          },
        })
        .then(() => {
          window.location.reload()
        })
    }
  }, 1000)
}
</script>
<style scoped lang="scss"></style>
