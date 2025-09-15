<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class=" " square style="min-width: 700px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="row">
          <div class="col-8 flex">
            <div class="text-subtitle1 text-bold flex content-end items-center">
              <q-icon name="o_person" size="sm" />
              {{ player?.playerName }}
            </div>
          </div>
          <div class="col-4 flex content-center items-center justify-end">
            <span class="bg-warning text-capitalize q-pl-xs q-pr-xs text-subtitle2 q-ml-sm q-mr-sm"
              >{{ chipTransactionType }}
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <Information
          v-if="chipTransactionType === 'ChipIn'"
          class="full-width"
          content="Player’ın masaya chip drop yapmasıdır."
        />
        <Information
          v-if="chipTransactionType === 'ChipOut'"
          class="full-width"
          content="Player’ın masadan kalkarken üzerinden ne kadar çip ile kalktığı bilgisidir."
        />
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-6">
            <q-radio
              v-model="selectedChip"
              v-for="(chip, index) in casinoChips"
              :key="index"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="chip"
              :label="chip.name"
              size="lg"
              :disable="chip.type !== 'Chip'"
            />
          </div>
          <div class="col-6 flex content-center items-center justify-evenly">
            <div class="text-h6 text-bold text-negative">
              <span class=" ">{{ $t('total') }}: </span>{{ priceAbsFormatted(total) }}
            </div>
          </div>
          <div class="col-6">
            <div class="row" v-for="(denom, index) in selectedChip.children" :key="index">
              <div class="col-12 q-pa-xs">
                <q-input
                  type="number"
                  dense
                  class="super-small"
                  v-model="denom.quantity"
                  outlined
                  square
                  @focus="latestClickedDenomInputIndex = index"
                  :key="index"
                  @update:model-value="onInput"
                  :ref="
                    (el) => {
                      if (el) inputRefs[index] = el
                    }
                  "
                >
                  <template v-slot:append>
                    <div
                      class="text-subtitle2 text-bold q-pl-md appendAmount flex justify-end"
                      style="width: 200px"
                    >
                      {{ denom.quantity || 0 }} x {{ denom.value || 0 }} =
                      {{ priceAbsFormatted((denom.quantity || 0) * denom.value) }}
                    </div>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row">
              <div class="col-3 flex justify-center items-center">
                <q-img
                  src="/inspectors/up-arrow-up.svg"
                  class="cursor-pointer"
                  v-ripple
                  @click="onClickUpArrow"
                />
                <q-img
                  src="/inspectors/up-arrow-down.svg"
                  class="cursor-pointer"
                  v-ripple
                  @click="onClickDownArrow"
                />
              </div>
              <div class="col-9 row">
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
                <div class="col-6 q-pa-xs">
                  <q-btn
                    no-caps
                    color="negative"
                    unelevated
                    :label="$t('cancel')"
                    icon="far fa-times-circle"
                    @click="onDialogCancel"
                    class="full-width"
                  />
                </div>
                <div class="col-6 q-pa-xs">
                  <q-btn
                    no-caps
                    color="positive"
                    class="full-width"
                    unelevated
                    :label="$t('save')"
                    icon="far fa-check-circle"
                    @click="onOKClick"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'
import { i18n } from 'boot/i18n'
const inputRefs = ref([])
const $q = useQuasar()
const props = defineProps({
  chipTransactionType: {
    type: String,
    required: true,
  },
  player: {
    type: Object,
    required: true,
  },
  chips: {
    type: Array,
    required: true,
  },
})
const casinoChips = ref([])
const selectedChip = ref()
const latestClickedDenomInputIndex = ref(0)
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const onOKClick = () => {
  if (total.value === 0) {
    $q.notify({
      message: i18n.global.t('noDenomsSelected'),
      type: 'warning',
      position: 'bottom-right',
    })
  }
  const chipDenoms = casinoChips.value
    .map((chip) => {
      return chip.children.filter((denom) => +denom.quantity > 0)
    })
    .flat()
  onDialogOK({
    chips: [...chipDenoms],
    amount: total.value,
  })
}

onMounted(() => {
  casinoChips.value = JSON.parse(JSON.stringify(props.chips)).map((chip) => {
    return {
      ...chip,
      children: chip.children
        .map((denom) => {
          return {
            ...denom,
            quantity: '',
          }
        })
        .sort((a, b) => a.value - b.value),
    }
  })

  selectedChip.value = casinoChips.value[0]
})

watch(latestClickedDenomInputIndex, (newIndex) => {
  if (inputRefs.value[newIndex]) {
    inputRefs.value[newIndex].focus()
  }
})
const onClickNumber = (number) => {
  let value = selectedChip.value.children[latestClickedDenomInputIndex.value].quantity || ''
  if (value.length === 0 && number === 0) {
    return
  }
  let newValue = value + '' + number
  // check if the first number is 0 than remove it
  if (newValue.length === 1 && newValue[0] === '0') {
    newValue = newValue.slice(1)
  }
  selectedChip.value.children[latestClickedDenomInputIndex.value].quantity = newValue
}

const onClickCleanDenoms = () => {
  selectedChip.value.children.forEach((denom) => {
    denom.quantity = ''
  })
}

const onClickRevokeDenom = () => {
  let value = selectedChip.value.children[latestClickedDenomInputIndex.value].quantity || ''
  let newValue = value.slice(0, -1)
  selectedChip.value.children[latestClickedDenomInputIndex.value].quantity = newValue
}

const total = computed(() => {
  let total = 0
  casinoChips.value.forEach((chip) => {
    chip.children.forEach((denom) => {
      total += denom.value * denom.quantity || 0
    })
  })
  return total
})

const onClickUpArrow = () => {
  if (latestClickedDenomInputIndex.value === 0) {
    latestClickedDenomInputIndex.value = selectedChip.value.children.length - 1
  } else {
    latestClickedDenomInputIndex.value--
  }
}

const onClickDownArrow = () => {
  if (latestClickedDenomInputIndex.value >= selectedChip.value.children.length) {
    latestClickedDenomInputIndex.value = 0
  } else {
    latestClickedDenomInputIndex.value++
  }
}

const onInput = (e) => {
  if (e.startsWith('0')) {
    e = e.slice(1)
  }
  selectedChip.value.children[latestClickedDenomInputIndex.value].quantity = e
}
</script>
<style scoped lang="scss">
.appendAmount {
  margin-right: -5px;
  min-width: 100px;
  border-left: 1px solid #dddddd;
}
</style>
