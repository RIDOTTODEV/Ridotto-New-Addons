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
              <q-icon name="o_person" size="sm" />
              {{ player?.playerName }}
            </div>
          </div>
          <div class="col-4 flex justify-end items-center content-center">
            <q-btn icon="o_info" size="sm" flat dense color="orange-8">
              <q-tooltip class="bg-white text-black">
                <Information class="full-width" content="Player’ın masaya cash drop yapmasıdır." />
              </q-tooltip>
            </q-btn>
            <span
              class="bg-warning text-capitalize q-ml-sm q-mr-sm text-subtitle2 q-pl-sm q-pr-sm"
              >{{ $t('cashIn') }}</span
            >
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-12">
            <q-img
              src="/inspectors/icons8-cash-64.png"
              fit="contain"
              style="width: 40px"
              v-if="selectedInOutMethod === 'CashIn'"
              class="q-ml-sm"
            />
            <q-img
              src="/inspectors/icons8-chip-52.png"
              fit="contain"
              style="width: 40px"
              v-else
              class="q-ml-sm"
            />
            <q-radio
              v-model="selectedInOutMethod"
              v-for="(inOutMethod, index) in inOutMethods"
              :key="index"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="inOutMethod.value"
              :label="inOutMethod.name"
              size="lg"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-6">
            <div class="row" v-if="selectedInOutMethod === 'Plaque'">
              <div class="row" v-for="(denom, index) in plaquesFormatted[0]?.children" :key="index">
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
                    :ref="
                      (el) => {
                        if (el) inputRefs[index] = el
                      }
                    "
                    readonly
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
              <div class="row full-width">
                <div class="col-12 q-pa-xs">
                  <div class="text-subtitle2 text-grey-8">
                    {{ $t('total') }}
                  </div>
                  <q-input
                    :model-value="
                      priceAbsFormatted(
                        plaquesFormatted[0].children.reduce(
                          (acc, curr) => acc + (parseInt(curr.quantity) || 0) * curr.value,
                          0,
                        ),
                      )
                    "
                    readonly
                    class="super-small"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>
            <div class="row" v-if="selectedInOutMethod === 'CashIn'">
              <div
                class="row"
                v-for="(denom, index) in selectedCurrency.denominations"
                :key="index"
              >
                <div class="col-12 q-pa-xs" v-if="index === 0">
                  <div class="text-subtitle2">
                    {{ $t('fromCurrency') }}
                    <span class="text-negative">*</span>
                  </div>
                  <q-select
                    v-model="selectedCurrency"
                    outlined
                    dense
                    :options="casinoCurrencies"
                    :option-label="
                      (val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol
                    "
                    emit-value
                    map-options
                    :rules="[(val) => !!val || $t('requiredField')]"
                    clearable
                    class="super-small"
                    hide-bottom-space
                    data-cy="fromCurrencyId"
                    behavior="menu"
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>
                            <q-img
                              :src="scope.opt.flag"
                              fit="contain"
                              width="25px"
                              height="25px"
                              class="q-mr-sm"
                            />
                            {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:selected-item="scope">
                      <div class="text-subtitle2">
                        <q-img
                          :src="scope.opt.flag"
                          fit="contain"
                          width="25px"
                          height="25px"
                          class="q-mr-sm"
                        />
                        {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                      </div>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 q-pa-xs">
                  <q-input
                    type="number"
                    dense
                    class="super-small"
                    v-model="denom.quantity"
                    outlined
                    square
                    @focus="onFocusDenom(index)"
                    :key="index"
                    :ref="
                      (el) => {
                        if (el) inputRefs[index] = el
                      }
                    "
                    readonly
                  >
                    <template v-slot:append>
                      <div
                        class="text-subtitle2 text-bold q-pl-md text-right appendAmount flex justify-end"
                        style="width: 200px"
                      >
                        {{ denom.quantity || 0 }} x {{ denom.denom || 0 }} =
                        {{ priceAbsFormatted((denom.quantity || 0) * denom.denom) }}
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row full-width">
                <div class="col-12 q-pa-xs">
                  <div class="text-subtitle2 text-grey-8">
                    {{
                      $t('totalByDefaultCurrency', {
                        currency: defaultCurrency?.name,
                      })
                    }}
                  </div>
                  <q-input v-model="formFields.total" readonly class="super-small" outlined dense>
                    <template v-slot:append>
                      <div class="row flex justify-end appendTotalAmount">
                        <div
                          class="q-pl-sm"
                          v-for="(currency, index) in casinoCurrencies"
                          :key="index"
                        >
                          <div
                            class="text-subtitle2 text-grey-8 flex items-center content-center"
                            v-show="
                              currency.denominations.reduce(
                                (acc, curr) => acc + curr.quantity * curr.denom,
                                0,
                              )
                            "
                          >
                            <q-img
                              :src="currency.flag"
                              fit="contain"
                              width="20px"
                              height="20px"
                              class="q-mr-sm"
                            />
                            {{ currency.fullName }}
                            -
                            {{
                              priceAbsFormatted(
                                currency.denominations.reduce(
                                  (acc, curr) => acc + curr.quantity * curr.denom,
                                  0,
                                ),
                              )
                            }}
                            {{ currency.symbol }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 row">
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
            <div class="col-9">
              <div
                class="row"
                :style="{
                  marginTop: selectedInOutMethod === 'CashIn' ? '21px' : '0px',
                }"
              >
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
              <div class="row">
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
import { debounce, useDialogPluginComponent, useQuasar } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'
import { i18n } from 'boot/i18n'
import { useCurrencyStore } from 'src/stores/currency-store'
import ConfirmDialog from './ConfirmDialog.vue'
const currencyStore = useCurrencyStore()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()
const props = defineProps({
  defaultCurrencyId: {
    type: Number,
    required: true,
  },
  currencies: {
    type: Array,
    required: true,
  },
  player: {
    type: Object,
    required: true,
  },
  plaques: {
    type: Array,
    required: true,
  },
})
const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
const inputRefs = ref([])
const formFields = ref({
  total: 0,
})
const casinoCurrencies = ref([])
const selectedCurrency = ref(null)
const clickedAmountInput = ref(false)
const latestClickedDenomInputIndex = ref(-1)
const defaultCurrency = computed(() => {
  return (
    props.currencies.find((currency) => currency.id === props.defaultCurrencyId) ||
    casinoCurrencies.value[0]
  )
})
const plaquesFormatted = ref([])
const onFocusDenom = (index) => {
  latestClickedDenomInputIndex.value = index
  clickedAmountInput.value = false
}
onMounted(() => {
  casinoCurrencies.value = JSON.parse(JSON.stringify(props.currencies)).map((currency) => {
    currency.denominations = currency.denominations
      .map((denom) => {
        denom.quantity = ''
        return denom
      })
      .sort((a, b) => a.denom - b.denom)
    return currency
  })
  selectedCurrency.value =
    casinoCurrencies.value.find((currency) => currency.id === props.defaultCurrencyId) ||
    casinoCurrencies.value[0]

  plaquesFormatted.value = JSON.parse(JSON.stringify(props.plaques)).map((plaque) => {
    return {
      ...plaque,
      children: plaque.children.map((denom) => {
        return {
          ...denom,
          quantity: 0,
        }
      }),
    }
  })
})

const onClickNumber = (number) => {
  if (latestClickedDenomInputIndex.value === -1) {
    return
  }
  let value = ''
  if (selectedInOutMethod.value === 'CashIn') {
    value = selectedCurrency.value.denominations[latestClickedDenomInputIndex.value].quantity || ''
  } else {
    value = plaquesFormatted.value[0].children[latestClickedDenomInputIndex.value].quantity || ''
  }

  if (value.length === 0 && number === 0) {
    return
  }
  let newValue = value + '' + number
  if (selectedInOutMethod.value === 'CashIn') {
    selectedCurrency.value.denominations[latestClickedDenomInputIndex.value].quantity = newValue
  } else {
    plaquesFormatted.value[0].children[latestClickedDenomInputIndex.value].quantity = newValue
  }
}
const onClickCleanDenoms = () => {
  if (selectedInOutMethod.value === 'CashIn') {
    selectedCurrency.value.denominations.map((denom) => {
      denom.quantity = ''
    })
  } else {
    plaquesFormatted.value[0].children.map((denom) => {
      denom.quantity = ''
    })
  }
}
const onClickRevokeDenom = () => {
  let value = ''
  if (selectedInOutMethod.value === 'CashIn') {
    value = selectedCurrency.value.denominations[latestClickedDenomInputIndex.value].quantity || ''
  } else {
    value = plaquesFormatted.value[0].children[latestClickedDenomInputIndex.value].quantity || ''
  }

  let newValue = value.slice(0, -1)
  if (selectedInOutMethod.value === 'CashIn') {
    selectedCurrency.value.denominations[latestClickedDenomInputIndex.value].quantity = newValue
  } else {
    plaquesFormatted.value[0].children[latestClickedDenomInputIndex.value].quantity = newValue
  }
}
const onOKClick = () => {
  const data = formatCurrencies()
  if (selectedInOutMethod.value === 'CashIn' && data.length === 0) {
    $q.notify({
      message: i18n.global.t('noDenomsSelected'),
      type: 'warning',
      position: 'bottom-right',
    })
    return
  }
  if (selectedInOutMethod.value === 'Plaque' && plaquesFormatted.value[0].children.length === 0) {
    $q.notify({
      message: i18n.global.t('noPlaquesSelected'),
      type: 'warning',
      position: 'bottom-right',
    })
    return
  }

  $q.dialog({
    component: ConfirmDialog,
    componentProps: {
      actionTitle: selectedInOutMethod.value === 'CashIn' ? 'Cash In' : 'Plaque In',
      playerName: props.player.playerName,
      message:
        selectedInOutMethod.value === 'CashIn'
          ? i18n.global.t('confirmCashIn')
          : i18n.global.t('confirmPlaqueIn'),
    },
  }).onOk(() => {
    onDialogOK({
      cashInfos: data,
      selectedInOutMethod: selectedInOutMethod.value,
      plaques: plaquesFormatted.value[0]?.children,
      plaquesTotal:
        plaquesFormatted.value[0]?.children.reduce(
          (acc, curr) => acc + curr.quantity * curr.value,
          0,
        ) || 0,
    })
  })
}
watch(
  () => casinoCurrencies.value,
  () => {
    setTotalByDefaultCurrency()
  },
  { deep: true },
)
watch(latestClickedDenomInputIndex, (newIndex) => {
  if (inputRefs.value[newIndex]) {
    inputRefs.value[newIndex].focus()
  }
})
const setTotalByDefaultCurrency = debounce(async () => {
  const formatted = formatCurrencies()
  await Promise.all(
    formatted.map(async (currency) => {
      if (currency.currencyId === defaultCurrency.value.id) {
        formFields.value.total = currency.amount
      } else {
        const convertedTotal = await currencyStore.getConvertedAmount(
          currency.currencyId,
          defaultCurrency.value.id,
          currency.amount,
        )
        formFields.value.total += convertedTotal
      }
    }),
  )
}, 1000)
const formatCurrencies = () => {
  const data = casinoCurrencies.value
    .map((currency) => {
      return {
        currencyId: currency.id,
        cashInfoDetails: currency.denominations
          .map((denom) => {
            return {
              currencyDenomId: denom.id,
              currencyDenom: denom.denom,
              quantity: parseInt(denom.quantity) || 0,
            }
          })
          .filter((denom) => denom.quantity > 0),
        amount: currency.denominations.reduce((acc, curr) => acc + curr.quantity * curr.denom, 0),
      }
    })
    .filter((currency) => currency.cashInfoDetails.length > 0)
  return data || []
}
const onClickUpArrow = () => {
  if (selectedInOutMethod.value === 'CashIn') {
    if (latestClickedDenomInputIndex.value === 0) {
      latestClickedDenomInputIndex.value = selectedCurrency.value.denominations.length - 1
    } else {
      latestClickedDenomInputIndex.value--
    }
  } else {
    if (latestClickedDenomInputIndex.value === 0) {
      latestClickedDenomInputIndex.value = plaquesFormatted.value[0].children.length - 1
    } else {
      latestClickedDenomInputIndex.value--
    }
  }
}

const onClickDownArrow = () => {
  if (selectedInOutMethod.value === 'CashIn') {
    if (latestClickedDenomInputIndex.value >= selectedCurrency.value.denominations.length) {
      latestClickedDenomInputIndex.value = 0
    } else {
      latestClickedDenomInputIndex.value++
    }
  } else {
    if (latestClickedDenomInputIndex.value >= plaquesFormatted.value[0].children.length) {
      latestClickedDenomInputIndex.value = 0
    } else {
      latestClickedDenomInputIndex.value++
    }
  }
}

const inOutMethods = ref([
  {
    name: 'Cash In',
    value: 'CashIn',
  },
  {
    name: 'Plaque In',
    value: 'Plaque',
  },
])
const selectedInOutMethod = ref(inOutMethods.value[0].value)
</script>
<style scoped lang="scss">
.appendAmount {
  margin-right: -5px;
  min-width: 100px;
  border-left: 1px solid #dddddd;
}

.appendTotalAmount {
  //min-width: 470px !important;
  border-left: 1px solid #dddddd;
}
</style>
