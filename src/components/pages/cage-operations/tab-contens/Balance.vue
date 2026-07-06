<script setup>
import { priceAbsFormatted } from 'src/helpers/helpers'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref, inject } from 'vue'
const bus = inject('bus')
const cashdeskStore = useCashdeskStore()
const { currentCashDeskBalance, currentCashDeskChipBalance } = storeToRefs(cashdeskStore)
const authStore = useAuthStore()
const { getDefaultCurrencyName } = storeToRefs(authStore)
const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)

onMounted(() => {
  cashdeskStore.setCashdeskBalance()
})
bus.on('reloadCageBalance', () => {
  cashdeskStore.setCashdeskBalance()
})
const total = computed(() => {
  return currentCashDeskBalance.value + currentCashDeskChipBalance.value
})

const showTotal = ref(false)

const reloadAll = (e) => {
  e.stopPropagation()
  cashdeskStore.setCashdeskBalance()
}
</script>

<template>
  <div class="balance-wrapper">
    <div
      class="balance-card"
      v-if="!showTotal"
      v-el-perms="'Addon.CageOperations.Balance.ShowCurrentBalances'"
      @click="showTotal = true"
    >
      <div class="balance-item">
        <div class="balance-icon balance-icon--cash">
          <q-img src="/assets/icons8-cash-80.png" width="22px" height="22px" no-spinner />
        </div>
        <div class="balance-info">
          <div class="balance-label">
            {{ $t('cash') }}
            <span class="status-dot" />
            <span class="balance-unit" v-if="currencies.length" data-cy="cageCurrencyName">
              {{ getDefaultCurrencyName }}
            </span>
          </div>
          <div class="balance-value-row">
            <span
              class="balance-value"
              :class="currentCashDeskBalance >= 0 ? 'value-positive' : 'value-negative'"
              data-cy="cageTotal"
            >
              {{ priceAbsFormatted(currentCashDeskBalance) }}
            </span>
          </div>
        </div>
      </div>

      <div class="balance-divider" />

      <div class="balance-item balance-item--chip">
        <div class="balance-icon balance-icon--chip">
          <q-img src="/assets/icons8-casino-chip-64.png" width="22px" height="22px" no-spinner />
        </div>
        <div class="balance-info">
          <div class="balance-label">
            {{ $t('chip') }}
            <span class="status-dot" />
          </div>
          <div class="balance-value-row">
            <span
              class="balance-value balance-value--chip"
              :class="currentCashDeskChipBalance >= 0 ? 'value-chip-positive' : 'value-negative'"
              data-cy="cageTotal"
            >
              {{ priceAbsFormatted(currentCashDeskChipBalance) }}
            </span>
          </div>
        </div>
      </div>

      <div class="balance-divider" />

      <button
        type="button"
        class="balance-reload"
        data-cy="reloadCageBalanceBtn"
        v-el-perms="'Addon.CageOperations.Balance.CurrentBalanceReload'"
        @click="reloadAll"
      >
        <q-icon name="sync" size="18px" />
      </button>
    </div>

    <div
      class="balance-card balance-card--total"
      v-if="showTotal"
      v-el-perms="'Addon.CageOperations.Balance.ShowCurrentBalances'"
      @click="showTotal = false"
    >
      <div class="balance-item balance-item--total">
        <div class="balance-icon balance-icon--cash">
          <q-img src="/assets/icons8-cash-80.png" width="22px" height="22px" no-spinner />
        </div>
        <div class="balance-info">
          <div class="balance-label">
            {{ $t('total') }}
            <span class="status-dot" />
          </div>
          <div class="balance-value-row">
            <span
              class="balance-value"
              :class="total >= 0 ? 'value-positive' : 'value-negative'"
              data-cy="cageTotal"
            >
              {{ priceAbsFormatted(total) }}
            </span>
            <span class="balance-unit" v-if="currencies.length" data-cy="cageCurrencyName">
              {{ getDefaultCurrencyName }}
            </span>
          </div>
        </div>
      </div>

      <div class="balance-divider" />

      <button
        type="button"
        class="balance-reload"
        data-cy="reloadCageBalanceBtn"
        v-el-perms="'Addon.CageOperations.Balance.CurrentBalanceReload'"
        @click="reloadAll"
      >
        <q-icon name="sync" size="18px" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.balance-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media (min-width: 600px) {
    width: auto;
  }
}

.balance-card {
  display: flex;
  align-items: center;
  height: 52px;
  max-height: 52px;
  // padding: 0 14px;
  background-color: #ffffff !important;
  border: 1px solid #e9ecef !important;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  width: 100%;
  color: #1f2937;

  &:hover {
    box-shadow: 0 2px 6px rgba(16, 24, 40, 0.08);
  }

  @media (min-width: 600px) {
    width: auto;
  }
}

.balance-card--total {
  min-width: 240px;
}

.balance-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  height: 100%;
  flex: 0 0 auto;
  min-width: 0;
}

.balance-item--total {
  flex: 0 0 auto;
}

.balance-item--chip {
  padding-right: 0;
}

.balance-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--cash {
    background-color: #e6f6ec !important;
  }

  &--chip {
    background-color: #fff3e0 !important;
  }
}

.balance-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.1;
}

.balance-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #1f2937 !important;
  letter-spacing: 0.1px;
}

.balance-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 2px;
}

.balance-value {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.2px;
  white-space: nowrap;
}

.value-positive {
  color: #108f3d !important;
}

.value-chip-positive {
  color: #f29100 !important;
}

.value-negative {
  color: #dc3545 !important;
}

.balance-unit {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af !important;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.balance-divider {
  width: 1px;
  align-self: stretch;
  background-color: #eef0f3 !important;
  margin: 8px 0;
}

.balance-reload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  margin-left: 4px;
  border: none;
  border-radius: 8px;
  background-color: transparent !important;
  color: #6b7280 !important;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.3s ease;

  &:hover {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
  }

  &:active :deep(.q-icon) {
    transform: rotate(180deg);
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  min-width: 6px;
  border-radius: 50%;
  background-color: #16a34a !important;
  display: inline-block;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.15);
}

@media (max-width: 600px) {
  .balance-value {
    font-size: 15px;
  }

  .balance-icon {
    width: 32px;
    height: 32px;
  }

  .balance-item {
    padding: 0 6px;
    gap: 8px;
  }
}
</style>
