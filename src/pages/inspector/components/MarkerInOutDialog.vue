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
          v-if="chipTransactionType === 'MarkerIn'"
          class="full-width"
          content="Marker in "
        />
        <Information
          v-if="chipTransactionType === 'MarkerOut'"
          class="full-width"
          content="Marker out"
        />
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-7">
            <div class="row">
              <div class="col-12 q-pa-xs">
                <q-input type="number" dense v-model="form.amount" outlined square autofocus />
              </div>
            </div>

            <div class="text-h6 text-bold text-negative text-center">
              <span class=" ">{{ $t('total') }}: </span>{{ priceAbsFormatted(total) }}
            </div>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-12 row">
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
import { computed, onMounted, ref } from 'vue'

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'
import { i18n } from 'boot/i18n'

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
const form = ref({
  amount: 0,
})
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

  onDialogOK({
    amount: form.value.amount,
  })
}

onMounted(() => {
  casinoChips.value = JSON.parse(JSON.stringify(props.chips)).map((chip) => {
    return {
      ...chip,
      children: chip.children.map((denom) => {
        return {
          ...denom,
          quantity: '',
        }
      }),
    }
  })
})

const onClickNumber = (number) => {
  let value = form.value.amount || ''
  if (value.length === 0 && number === 0) {
    return
  }
  let newValue = value + '' + number
  form.value.amount = newValue
}

const onClickCleanDenoms = () => {
  form.value.amount = ''
}

const onClickRevokeDenom = () => {
  let value = form.value.amount
  let newValue = value.slice(0, -1)
  form.value.amount = newValue
}

const total = computed(() => {
  return form.value.amount
})
</script>
<style scoped lang="scss">
.appendAmount {
  margin-right: -5px;
  min-width: 100px;
  border-left: 1px solid #dddddd;
}
</style>
