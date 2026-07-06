<script setup>
import { ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useQuasar } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'

const bus = inject('bus')
const emits = defineEmits(['savedCageTransaction', 'cancel'])
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const cashdeskStore = useCashdeskStore()
const { transactionTypes, getSelectedCashDeskId } = storeToRefs(cashdeskStore)
const $q = useQuasar()

const inOutTabFormValues = ref({
  transactionType: null,
  currencyId: null,
  transactionCodeId: null,
  amount: null,
  note: null,
  cashDeskId: getSelectedCashDeskId.value,
})

const cageInOutCodes = computed(() => getTransactionCodesByGroups.value(['CageInOut']))

const selectedCurrency = computed(() =>
  inOutTabFormValues.value.currencyId
    ? currencyStore.getCurrencyById(inOutTabFormValues.value.currencyId)
    : null,
)

const selectedTransactionType = computed(() =>
  transactionTypes.value.find((t) => t.value === inOutTabFormValues.value.transactionType),
)

const selectedTransactionCode = computed(() =>
  cageInOutCodes.value.find((c) => c.id === inOutTabFormValues.value.transactionCodeId),
)

const isFormReady = computed(
  () =>
    !!(
      inOutTabFormValues.value.transactionType &&
      inOutTabFormValues.value.currencyId &&
      inOutTabFormValues.value.transactionCodeId &&
      inOutTabFormValues.value.amount
    ),
)

const selectTransactionType = (value) => {
  inOutTabFormValues.value.transactionType = value
}

const onSubmitInOutTabForm = async () => {
  const response = await cashdeskStore.createInOutTransferTransaction(inOutTabFormValues.value)
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    bus.emit('reloadCageBalance')
    emits('savedCageTransaction')
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
</script>

<template>
  <q-card class="q-card--bordered in-out-transfer">
    <q-card-section v-el-perms="'Addon.CageOperations.Tab.InOutCreate'" class="q-pa-none">
      <q-form @submit="onSubmitInOutTabForm" ref="form">
        <div class="row no-wrap-md">
          <div class="col-md-8 col-12">
            <div class="in-out-transfer__form">
              <div class="form-section">
                <div class="form-section__title">{{ $t('transactionType') }}</div>
                <q-field
                  v-model="inOutTabFormValues.transactionType"
                  :rules="[(val) => !!val || $t('requiredField')]"
                  borderless
                  hide-bottom-space
                  no-error-icon
                  class="transaction-type-field"
                >
                  <template #control>
                    <div class="transaction-type-selector">
                      <button
                        v-for="type in transactionTypes"
                        :key="type.value"
                        type="button"
                        class="transaction-type-option"
                        :class="{
                          'transaction-type-option--active':
                            inOutTabFormValues.transactionType === type.value,
                          'transaction-type-option--deposit': type.value === 'Deposit',
                          'transaction-type-option--withdrawal': type.value === 'Withdrawal',
                        }"
                        @click="selectTransactionType(type.value)"
                      >
                        {{ type.label }}
                      </button>
                    </div>
                  </template>
                </q-field>
              </div>

              <div class="form-section">
                <div class="form-section__title">{{ $t('transactionDetails') }}</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="inOutTabFormValues.currencyId"
                      outlined
                      dense
                      :options="currencies"
                      option-value="id"
                      :option-label="(val) => val.fullName + ' ' + val.name + ' - ' + val.symbol"
                      emit-value
                      map-options
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      clearable
                      class="super-small"
                      data-cy="currencyId"
                      behavior="menu"
                      :label="$t('currency')"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select-box
                      :options="cageInOutCodes"
                      option-value="id"
                      option-label="name"
                      v-model="inOutTabFormValues.transactionCodeId"
                      :label="$t('transactionCode')"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-currency-input
                      currency="USD"
                      v-model="inOutTabFormValues.amount"
                      outlined
                      dense
                      :rules="[(val) => !!val || $t('requiredField')]"
                      :precision="2"
                      :prepend="selectedCurrency?.symbol || ''"
                      data-cy="amount"
                      :label="$t('amount')"
                      hide-bottom-space
                      class="super-small"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="inOutTabFormValues.note"
                      outlined
                      dense
                      clearable
                      class="super-small"
                      data-cy="note"
                      :label="$t('note')"
                    />
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <q-btn
                  class=""
                  :label="$t('cancel')"
                  type="button"
                  color="negative"
                  icon="far fa-times-circle"
                  no-wrap
                  no-caps
                  @click="emits('cancel')"
                  flat
                />
                <q-btn
                  class=" "
                  :label="$t('save')"
                  icon="save"
                  type="submit"
                  unelevated
                  data-cy="submit"
                  no-caps
                  no-wrap
                  :disable="!isFormReady"
                  color="green-8"
                />
              </div>
            </div>
          </div>

          <div class="col-md-4 col-12">
            <div class="summary-card">
              <div class="summary-card__header">{{ $t('transactionSummary') }}</div>

              <div v-if="!inOutTabFormValues.transactionType" class="summary-card__empty">
                {{ $t('fillFormToSeeSummary') }}
              </div>

              <template v-else>
                <div class="summary-card__rows">
                  <div class="summary-card__row">
                    <span class="summary-card__label">{{ $t('transactionType') }}</span>
                    <span class="summary-card__value">{{ selectedTransactionType?.label || '—' }}</span>
                  </div>
                  <div class="summary-card__row">
                    <span class="summary-card__label">{{ $t('currency') }}</span>
                    <span class="summary-card__value">
                      {{
                        selectedCurrency
                          ? `${selectedCurrency.symbol} — ${selectedCurrency.name}`
                          : '—'
                      }}
                    </span>
                  </div>
                  <div class="summary-card__row">
                    <span class="summary-card__label">{{ $t('transactionCode') }}</span>
                    <span class="summary-card__value">
                      {{ selectedTransactionCode?.name || '—' }}
                    </span>
                  </div>
                  <div class="summary-card__row">
                    <span class="summary-card__label">{{ $t('amount') }}</span>
                    <span class="summary-card__value summary-card__value--amount">
                      <template v-if="inOutTabFormValues.amount">
                        {{ selectedCurrency?.symbol || '' }}
                        {{ priceAbsFormatted(inOutTabFormValues.amount) }}
                      </template>
                      <template v-else>—</template>
                    </span>
                  </div>
                  <div class="summary-card__row">
                    <span class="summary-card__label">{{ $t('note') }}</span>
                    <span class="summary-card__value">{{ inOutTabFormValues.note || '—' }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.in-out-transfer__form {
  padding: 10px 12px;
}

.form-section {
  & + & {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e8eaed;
  }
}

.form-section__title {
  font-size: 12px;
  font-weight: 600;
  color: #5f6368;
  margin-bottom: 8px;
}

.transaction-type-field {
  :deep(.q-field__control) {
    min-height: unset;
  }
}

.transaction-type-selector {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 280px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  overflow: hidden;
}

.transaction-type-option {
  flex: 1;
  padding: 7px 12px;
  border: none;
  border-right: 1px solid #dadce0;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #5f6368;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: #f8f9fa;
  }

  &--active {
    font-weight: 600;
  }

  &--deposit.transaction-type-option--active {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &--withdrawal.transaction-type-option--active {
    background: #fce8e6;
    color: #c62828;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #e8eaed;

  &__btn {
    min-height: 34px;
    padding: 0 16px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 4px;
  }


}

.summary-card {
  margin: 10px 10px 10px 0;
  padding: 12px;
  border-left: 1px solid #e8eaed;
  min-height: unset;

  &__header {
    font-size: 12px;
    font-weight: 600;
    color: #5f6368;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e8eaed;
  }

  &__empty {
    font-size: 12px;
    color: #9aa0a6;
    line-height: 1.4;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px solid #f1f3f4;
    font-size: 13px;

    &:last-child {
      border-bottom: none;
    }
  }

  &__label {
    flex-shrink: 0;
    color: #9aa0a6;
    font-size: 12px;
  }

  &__value {
    text-align: right;
    color: #202124;
    font-weight: 500;
    word-break: break-word;

    &--amount {
      font-weight: 600;
    }
  }
}

@media (max-width: 1023px) {
  .summary-card {
    margin: 0 10px 10px;
    border-left: none;
    border-top: 1px solid #e8eaed;
    padding-top: 12px;
  }
}
</style>
