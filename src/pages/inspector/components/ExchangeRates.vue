<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { debounce } from 'quasar'
const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
const exchangeRateColumns = ref([
  {
    name: 'fromCurrency',
    align: 'center',
    label: 'From Currency',
    field: 'fromCurrencyName',
    sortable: false,
    visible: true,
  },
  {
    name: 'toCurrency',
    align: 'center',
    label: 'To Currency',
    field: 'toCurrencyName',
    sortable: false,
    visible: true,
  },
  {
    name: 'rate',
    align: 'center',
    label: 'Rate',
    field: 'rate',
    sortable: false,
    visible: true,
  },
])
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags, getCurrencyById, getDefaultCurrency } = storeToRefs(currencyStore)
const { getConvertedAmount } = currencyStore
const exchangeTabRates = ref([])
const formValues = ref({
  fromCurrencyId: null,
  toCurrencyId: getDefaultCurrency.value?.id,
  amount: '',
  convertedAmount: 0,
})

const onChangeFromCurrency = async () => {
  setConvertedAmount()
  await getExchangeTabRates(formValues.value.fromCurrencyId)
}
const setConvertedAmount = debounce(async () => {
  formValues.value.receivedAmount = null
  if (
    !formValues.value.fromCurrencyId ||
    !formValues.value.toCurrencyId ||
    +formValues.value.amount <= 0
  )
    return
  formValues.value.receivedAmount = await getConvertedAmount(
    formValues.value.fromCurrencyId,
    formValues.value.toCurrencyId,
    formValues.value.amount,
  )
}, 1000)
const swapCurrencies = () => {
  const temp = formValues.value.fromCurrencyId
  formValues.value.fromCurrencyId = formValues.value.toCurrencyId
  formValues.value.toCurrencyId = temp
  setConvertedAmount()
  getExchangeTabRates(formValues.value.fromCurrencyId)
}
const getExchangeTabRates = async (currencyId) => {
  if (!currencyId) return
  exchangeTabRates.value = await currencyStore.fetchLatestRatesBefore({
    FromCurrencyId: currencyId,
  })
}
const onClickNumber = (number) => {
  let value = formValues.value.amount || ''
  if (value.length === 0 && number === 0) {
    return
  }
  formValues.value.amount = value + '' + number
  return
}
const onClickCleanDenoms = () => {
  formValues.value.amount = ''
}
const onClickRevokeDenom = () => {
  let value = formValues.value.amount || ''
  if (value.length === 0) {
    return
  }
  if (value.toString().length > 0) {
    formValues.value.amount = value.toString().slice(0, -1)
  }
}
onMounted(async () => {
  if (exchangeTabRates.value.length === 0) {
    exchangeTabRates.value = await currencyStore.fetchLatestRatesBefore({
      FromCurrencyId: getDefaultCurrency.value?.id,
    })
  }
})
const onBeforeShow = () => {
  formValues.value.amount = ''
  formValues.value.convertedAmount = ''
  formValues.value.fromCurrencyId = null
  formValues.value.receivedAmount = null
  formValues.value.toCurrencyId = getDefaultCurrency.value?.id
  getExchangeTabRates(getDefaultCurrency.value?.id)
}
</script>

<template>
  <q-btn
    unelevated
    color="grey-2"
    class="q-mr-sm q-card--bordered"
    text-color="negative"
    icon="currency_exchange"
  >
    <q-popup-proxy style="margin-top: 10px" breakpoint="700" @before-show="onBeforeShow">
      <q-card style="min-width: 820px !important">
        <q-card-section class="row q-pa-xs">
          <div class="col-8 q-pa-sm">
            <div class="row">
              <div class="text-subtitle2">
                {{ $t('exchangeRates') }}
              </div>
            </div>
            <div class="row">
              <div class="col-7 q-pa-xs">
                <div class="text-subtitle2">
                  {{ $t('fromCurrency') }}
                  <span class="text-negative">*</span>
                </div>
                <q-select
                  v-model="formValues.fromCurrencyId"
                  outlined
                  dense
                  :options="getCurrenciesWithFlags"
                  option-value="id"
                  :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('requiredField')]"
                  clearable
                  @update:model-value="onChangeFromCurrency"
                  class="super-small"
                  hide-bottom-space
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
                  <template v-slot:after>
                    <q-icon
                      @click="swapCurrencies"
                      name="swap_horiz"
                      class="q-mr-sm cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-5 q-pa-xs">
                <div class="text-subtitle2">
                  {{ $t('toCurrency') }}
                  <span class="text-negative">*</span>
                </div>
                <q-select
                  v-model="formValues.toCurrencyId"
                  outlined
                  dense
                  :options="getCurrenciesWithFlags"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('requiredField')]"
                  :disable="formValues.fromCurrencyId === null"
                  clearable
                  :option-disable="(val) => val.id === formValues.fromCurrencyId"
                  @update:model-value="setConvertedAmount"
                  class="super-small"
                  hide-bottom-space
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
            </div>
            <div class="row">
              <div class="col-7 q-pa-xs">
                <div class="text-subtitle2">
                  {{ $t('exchangeReceivedAmount') }}
                  <span class="text-negative">*</span>
                </div>
                <q-currency-input
                  currency="USD"
                  v-model="formValues.receivedAmount"
                  outlined
                  dense
                  :rules="[(val) => !!val || $t('requiredField')]"
                  :readonly="true"
                  :prepend="
                    formValues.toCurrencyId ? getCurrencyById(formValues.toCurrencyId).symbol : ''
                  "
                  :precision="2"
                  :copy-value="true"
                />
              </div>
              <div class="col-5 q-pa-xs">
                <div class="text-subtitle2">
                  {{ $t('exchangeSaleAmount') }}
                  <span class="text-negative">*</span>
                </div>
                <q-currency-input
                  currency="USD"
                  v-model="formValues.amount"
                  outlined
                  dense
                  :prepend="
                    formValues.fromCurrencyId
                      ? getCurrencyById(formValues.fromCurrencyId).symbol
                      : ''
                  "
                  @update:model-value="setConvertedAmount"
                  :debounce="300"
                  :autofocus="true"
                  :precision="2"
                />
              </div>
            </div>
          </div>
          <div class="col-4 q-pa-sm row">
            <div class="col-4 q-pa-xs" v-for="(number, index) in numbers" :key="index">
              <q-btn
                :label="number"
                :key="index"
                class="text-bold full-width"
                unelevated
                color="blue-grey-8"
                outline
                @click="onClickNumber(number)"
              />
            </div>
            <div class="col-4 q-pa-xs">
              <q-btn
                class="text-bold full-width"
                unelevated
                color="blue-grey-8"
                outline
                @click="onClickRevokeDenom"
              >
                <q-img src="/inspectors/icons8-back-50.png" style="width: 28px" />
              </q-btn>
            </div>
            <div class="col-4 q-pa-xs">
              <q-btn
                class="text-bold full-width"
                unelevated
                color="blue-grey-8"
                outline
                @click="onClickCleanDenoms"
              >
                <q-img src="/inspectors/icons8-clean-48.png" style="width: 28px" />
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-xs q-pl-sm q-pr-sm q-pb-sm">
          <div class="" style="margin-top: -35px; max-width: 200px !important">
            <div class="text-subtitle2">
              {{ $t('exchangeRates') }}
            </div>
          </div>
          <q-table
            square
            :rows="exchangeTabRates"
            :columns="exchangeRateColumns"
            dense
            hide-bottom
            row-key="id"
            class="no-box-shadow q-pl-none"
            :rows-per-page-options="[10]"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  auto-width
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-center q-custom-table"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr
                :props="props"
                :class="
                  +formValues.toCurrencyId &&
                  props.row.toCurrencyName === getCurrencyById(formValues.toCurrencyId).name
                    ? 'bg-green-1 text-dark text-bold'
                    : ''
                "
              >
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <div class="text-center">
                    {{ col.value }}
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>

<style scoped lang="scss"></style>
