<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags, getCurrencyById } = storeToRefs(currencyStore)
const transactionCodeStore = useTransactionCodeStore()

const cashdeskStore = useCashdeskStore()
const { getSelectedCashDeskId } = storeToRefs(cashdeskStore)

const filterTransactionCodesByGroupTypes = ref(['Exchange'])
const exchangeTabRates = ref([])
const transactionCodesByGroupTypeOptions = ref([])
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
const exchangeFormValues = ref({
  cashDeskId: getSelectedCashDeskId.value,
  fromCurrencyId: currencyStore.getCurrenciesWithFlags[1]?.id,
  toCurrencyId: currencyStore.getCurrenciesWithFlags[0]?.id,
  amount: null,
  receivedAmount: null,
  note: null,
  transactionCodeId: null,
})

const $q = useQuasar()
const onSubmitExchangeTabForm = async () => {
  const response = await cashdeskStore.createExchangeTransferTransaction(exchangeFormValues.value)
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    setTimeout(() => {
      emits('savedCageTransaction')
    }, 1000)
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
const emits = defineEmits(['savedCageTransaction', 'cancel'])
const setExchangeConvertedAmount = async () => {
  exchangeFormValues.value.receivedAmount = null
  if (
    !exchangeFormValues.value.fromCurrencyId ||
    !exchangeFormValues.value.toCurrencyId ||
    !exchangeFormValues.value.amount
  )
    return
  exchangeFormValues.value.receivedAmount = await currencyStore.getConvertedAmount(
    exchangeFormValues.value.fromCurrencyId,
    exchangeFormValues.value.toCurrencyId,
    exchangeFormValues.value.amount,
  )
}
const onChangeExchangeTabFromCurrency = async () => {
  exchangeFormValues.value.toCurrencyId = null
  await getExchangeTabRates()
  await setExchangeConvertedAmount()
}
const getExchangeTabRates = async () => {
  if (!exchangeFormValues.value.fromCurrencyId) return
  exchangeTabRates.value = await currencyStore.getLatestRates(
    exchangeFormValues.value.fromCurrencyId,
  )
}

const swapExchangeCurrencies = async () => {
  const temp = exchangeFormValues.value.fromCurrencyId
  exchangeFormValues.value.fromCurrencyId = exchangeFormValues.value.toCurrencyId
  exchangeFormValues.value.toCurrencyId = temp
  await getExchangeTabRates()
  await setExchangeConvertedAmount()
}
const onFilterTransactionCodesByGroupType = (val, update) => {
  if (val === '') {
    update(() => {
      transactionCodesByGroupTypeOptions.value = transactionCodeStore.getTransactionCodesByGroups(
        filterTransactionCodesByGroupTypes.value,
      )
    })
    return
  }
}

onMounted(async () => {
  await getExchangeTabRates()
})
</script>

<template>
  <q-card class="q-card--bordered">
    <q-card-section class="q-pa-none">
      <div class="full-width q-pl-sm q-pr-sm q-mt-sm">
        <Information content="Kasada yapılan  para dönüşümleri için kullanılacak." />
      </div>
      <q-form @submit="onSubmitExchangeTabForm" class="col-12 row" ref="form">
        <div class="col-8">
          <div class="row">
            <div class="col-12 row">
              <div class="col q-pa-md">
                <q-select
                  :label="$t('fromCurrency')"
                  v-model="exchangeFormValues.fromCurrencyId"
                  outlined
                  dense
                  :options="getCurrenciesWithFlags"
                  option-value="id"
                  :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('requiredField')]"
                  clearable
                  @update:model-value="onChangeExchangeTabFromCurrency"
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
                            width="20px"
                            height="20px"
                            class="q-mr-sm"
                          />
                          {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected-item="scope">
                    <div class="text-subtitle2 q-mt-xs">
                      <q-img
                        :src="scope.opt.flag"
                        fit="contain"
                        width="20px"
                        height="20px"
                        class="q-mr-sm"
                      />
                      {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                    </div>
                  </template>
                </q-select>
              </div>
              <div class="col-1 q-pa-md flex justify-center">
                <q-btn
                  unelevated
                  icon="swap_horiz"
                  size="13px"
                  color="grey-2"
                  text-color="dark"
                  @click="swapExchangeCurrencies"
                />
              </div>
              <div class="col q-pa-md">
                <q-select
                  :label="$t('toCurrency')"
                  v-model="exchangeFormValues.toCurrencyId"
                  outlined
                  dense
                  :options="getCurrenciesWithFlags"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('requiredField')]"
                  :disable="exchangeFormValues.fromCurrencyId === null"
                  clearable
                  :option-disable="(val) => val.id === exchangeFormValues.fromCurrencyId"
                  @update:model-value="setExchangeConvertedAmount"
                  class="super-small"
                  hide-bottom-space
                  data-cy="toCurrencyId"
                  behavior="menu"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>
                          <q-img
                            :src="scope.opt.flag"
                            fit="contain"
                            width="20px"
                            height="20px"
                            class="q-mr-sm"
                          />
                          {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected-item="scope">
                    <div class="text-subtitle2 q-mt-xs">
                      <q-img
                        :src="scope.opt.flag"
                        fit="contain"
                        width="20px"
                        height="20px"
                        class="q-mr-sm"
                      />
                      {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                    </div>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="col-6 q-pa-md">
              <q-currency-input
                :label="$t('exchangeSaleAmount')"
                currency="USD"
                v-model="exchangeFormValues.amount"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredField')]"
                :prepend="
                  exchangeFormValues.fromCurrencyId
                    ? getCurrencyById(exchangeFormValues.fromCurrencyId).symbol
                    : ''
                "
                @update:model-value="setExchangeConvertedAmount"
                :debounce="300"
                :precision="2"
                data-cy="amount"
              />
            </div>
            <div class="col-6 q-pa-md">
              <q-currency-input
                :label="$t('exchangeReceivedAmount')"
                currency="USD"
                v-model="exchangeFormValues.receivedAmount"
                outlined
                dense
                :rules="[(val) => !!val || $t('requiredField')]"
                :prepend="
                  exchangeFormValues.toCurrencyId
                    ? getCurrencyById(exchangeFormValues.toCurrencyId).symbol
                    : ''
                "
                :precision="4"
                data-cy="receivedAmount"
              />
            </div>
            <div class="col-6 q-pa-md">
              <q-select
                :label="$t('transactionCode')"
                v-model="exchangeFormValues.transactionCodeId"
                outlined
                dense
                :options="transactionCodesByGroupTypeOptions"
                option-value="id"
                option-label="name"
                map-options
                emit-value
                :rules="[(val) => !!val || $t('requiredField')]"
                clearable
                @filter="onFilterTransactionCodesByGroupType"
                use-input
                class="super-small"
                popup-content-class="height-400"
                data-cy="transactionCodeId"
                behavior="menu"
                hide-bottom-space
              />
            </div>
            <div class="col-6 q-pa-md">
              <q-input
                :label="$t('note')"
                v-model="exchangeFormValues.note"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="note"
              />
            </div>
            <div class="col-12 q-pa-md flex content-start">
              <q-btn
                size="13px"
                color="negative"
                :label="$t('cancel')"
                icon="cancel"
                type="button"
                unelevated
                data-cy="submit"
                no-wrap
                no-caps
                class="q-mr-sm"
                @click="emits('cancel')"
              />
              <q-btn
                size="13px"
                color="primary"
                :label="$t('save')"
                icon="save"
                type="submit"
                unelevated
                data-cy="submit"
                no-caps
                no-wrap
              />
            </div>
          </div>
        </div>
        <div class="col-4 q-pa-sm">
          <div class="text-subtitle2">
            {{ $t('exchangeRates') }}
          </div>
          <q-table
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
                  exchangeFormValues.toCurrencyId &&
                  props.row.toCurrencyName === getCurrencyById(exchangeFormValues.toCurrencyId).name
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
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss"></style>
