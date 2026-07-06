<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'

const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags, getCurrencyById } = storeToRefs(currencyStore)
const { getConvertedAmount } = currencyStore
const formValues = ref({
  fromCurrencyId: null,
  toCurrencyId: null,
  amount: 0,
  convertedAmount: 0,
})

const onChangeFromCurrency = () => {
  formValues.value.toCurrencyId = null
  setConvertedAmount()
}
const setConvertedAmount = async () => {
  formValues.value.receivedAmount = null
  if (
    !formValues.value.fromCurrencyId ||
    !formValues.value.toCurrencyId ||
    !formValues.value.amount
  )
    return
  formValues.value.receivedAmount = await getConvertedAmount(
    formValues.value.fromCurrencyId,
    formValues.value.toCurrencyId,
    formValues.value.amount,
  )
}

const swapCurrencies = () => {
  const temp = formValues.value.fromCurrencyId
  formValues.value.fromCurrencyId = formValues.value.toCurrencyId
  formValues.value.toCurrencyId = temp
  setConvertedAmount()
}
</script>

<template>
  <button type="button" class="exchange-trigger">
    <q-icon name="currency_exchange" size="16px" class="exchange-trigger__icon" />
    <span class="exchange-trigger__label">{{ $t('exchange') }}</span>
 
    <q-popup-proxy style="margin-top: 10px !important">
      <q-card style="max-width: 300px">
        <q-card-section class="row">
          <div class="col-12 q-pa-xs">
            <div class="text-subtitle2">
              {{ $t('exchangeSaleAmount') }}
              <span class="text-negative">*</span>
            </div>
            <q-currency-input
              currency="USD"
              v-model="formValues.amount"
              outlined
              dense
              :rules="[(val) => !!val || $t('requiredField')]"
              :prepend="
                formValues.fromCurrencyId ? getCurrencyById(formValues.fromCurrencyId).symbol : ''
              "
              @update:model-value="setConvertedAmount"
              :debounce="300"
              :autofocus="true"
              :precision="2"
            />
          </div>
          <div class="col-12 q-pa-xs">
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
                <q-icon @click="swapCurrencies" name="swap_vert" class="q-mr-sm cursor-pointer" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-xs">
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
          <div class="col-12 q-pa-xs">
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
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </button>
</template>

<style scoped lang="scss">
.exchange-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin-right: 8px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: rgba(15, 34, 58, 0.06);
    color: #1f2937;
  }

  &:focus-visible {
    outline: 2px solid rgba(16, 185, 129, 0.45);
    outline-offset: 1px;
  }

  &__icon {
    color: #6b7280;
    flex-shrink: 0;
  }

  &__label {
    text-transform: capitalize;
    white-space: nowrap;
    line-height: 1;
  }

  &:hover .exchange-trigger__icon {
    color: #1f2937;
  }
}

:global(.body--dark) .exchange-trigger {
  color: #cbd5e1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    color: #f1f5f9;
  }

  .exchange-trigger__icon {
    color: #94a3b8;
  }

  &:hover .exchange-trigger__icon {
    color: #f1f5f9;
  }
}
</style>
