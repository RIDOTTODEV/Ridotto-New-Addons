<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card square style="min-width: 700px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="row">
          <div class="col-8 flex">
            <div class="text-subtitle1 text-bold flex content-end items-center">
              <q-icon name="o_person" size="sm" /> {{ player?.playerName }}
            </div>
          </div>
          <div class="col-4 flex content-center items-center justify-end">
            <span
              class="bg-warning text-capitalize q-pl-xs q-pr-xs text-subtitle2 q-ml-sm q-mr-sm"
              >{{ $t('averageBet') }}</span
            >
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-7">
            <div class="row">
              <div class="col-12 q-pa-xs">
                <div class="text-subtitle2">
                  {{ $t('amount') }} <span class="text-negative">*</span>
                </div>
                <q-input
                  v-model="formValues.avgBet"
                  outlined
                  dense
                  type="number"
                  :rules="[(val) => (val && val > 0) || $t('requiredField')]"
                  class="super-small"
                  hide-bottom-space
                  data-cy="amount"
                  ref="amountRef"
                  @click="clickedAvgBetInput = true"
                />
              </div>
            </div>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-4 q-pa-xs" v-for="(number, index) in numbers" :key="index">
                <q-btn
                  :label="number"
                  :key="index"
                  size="xl"
                  class="text-bold full-width"
                  unelevated
                  color="blue-grey-8"
                  style="width: 58px"
                  outline
                  @click="onClickNumber(number)"
                />
              </div>
              <div class="col-4 q-pa-xs">
                <q-btn
                  padding="10px"
                  size="xl"
                  class="text-bold full-width"
                  unelevated
                  color="blue-grey-8"
                  style="width: 58px"
                  outline
                  @click="onClickRevokeDenom"
                >
                  <q-img src="/inspectors/icons8-back-50.png" style="width: 40px" />
                </q-btn>
              </div>
              <div class="col-4 q-pa-xs">
                <q-btn
                  padding="10px"
                  size="xl"
                  class="text-bold full-width"
                  unelevated
                  color="blue-grey-8"
                  style="width: 58px"
                  outline
                  @click="onClickCleanDenoms"
                >
                  <q-img src="/inspectors/icons8-clean-48.png" style="width: 40px" />
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row q-pa-sm">
        <div class="col-6">
          <div class="text-h6 text-bold text-negative">
            <span class=" ">{{ $t('total') }}: </span>{{ priceAbsFormatted(formValues.avgBet) }}
          </div>
        </div>
        <div class="col-6 text-right">
          <q-btn
            no-caps
            color="negative"
            unelevated
            :label="$t('cancel')"
            icon="far fa-times-circle"
            @click="onDialogCancel"
            class="q-mr-sm"
          />
          <q-btn
            no-caps
            color="positive"
            unelevated
            :label="$t('save')"
            icon="far fa-check-circle"
            @click="onOKClick"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
import { useDialogPluginComponent } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'

defineProps({
  player: {
    type: Object,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const formValues = ref({
  avgBet: null,
})

const onOKClick = () => {
  onDialogOK({ ...formValues.value })
}

const amountRef = ref(null)

const clickedAvgBetInput = ref(true)

const onClickNumber = (number) => {
  if (clickedAvgBetInput.value) {
    let oldValue = formValues.value.avgBet || ''
    let newValue = oldValue + '' + number
    if (parseFloat(newValue) <= 0) {
      formValues.value.avgBet = ''
    } else {
      formValues.value.avgBet = newValue
    }
    amountRef.value.focus()
    return
  }
}

const onClickCleanDenoms = () => {
  formValues.value.avgBet = ''
}

const onClickRevokeDenom = () => {
  if (clickedAvgBetInput.value) {
    let oldValue = formValues.value.avgBet || ''
    let newValue = oldValue.slice(0, -1)
    formValues.value.avgBet = newValue
    amountRef.value.focus()
    return
  }
}
</script>
