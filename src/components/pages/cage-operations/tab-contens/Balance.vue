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
</script>

<template>
  <div class="row flex justify-end no-wrap content-start items-start">
    <q-markup-table
      dense
      separator="cell"
      square
      class="no-box-shadow cursor-pointer app-cart-grey"
      bordered
      v-if="!showTotal"
      v-el-perms="'Addon.CageOperations.Balance.ShowCurrentBalances'"
    >
      <thead @click="showTotal = true">
        <tr>
          <th class="text-center app-cart-grey">
            <div class="text-subtitle2 text-bold">
              <q-img
                src="/assets/icons8-cash-80.png"
                style="width: 20px; height: 20px"
                class="q-mr-xs"
              />
              {{ $t('cash') }}
            </div>
          </th>
          <th class="text-center app-cart-grey">
            <div class="text-subtitle2 text-bold">
              <q-img
                src="/assets/icons8-casino-chip-64.png"
                style="width: 20px; height: 20px"
                class="q-mr-xs"
              />
              {{ $t('chip') }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="min-150 text-center text-white">
            <div
              class="text-balance text-bold heartbeat flex content-center items-center justify-center"
              :style="
                currentCashDeskBalance >= 0
                  ? 'background-color: #108f3d!important'
                  : 'background-color: #dc3545!important'
              "
            >
              <span data-cy="cageTotal">{{ priceAbsFormatted(currentCashDeskBalance) }}</span>
              <span
                class="cursor-pointer q-ml-sm"
                v-if="currencies.length"
                data-cy="cageCurrencyName"
              >
                {{ getDefaultCurrencyName }}
              </span>
              <q-icon
                data-cy="reloadCageBalanceBtn"
                name="sync"
                size="xs"
                class="cursor-pointer"
                v-el-perms="'Addon.CageOperations.Balance.CurrentBalanceReload'"
                @click="cashdeskStore.setCashdeskCashBalance()"
              />
            </div>
          </td>
          <td
            class="min-150 text-center borderLeftWhite text-white"
            v-el-perms="'Addon.CageOperations.Balance.ShowCurrentBalances'"
          >
            <div
              class="text-balance text-bold heartbeat flex content-center items-center justify-center"
              :style="
                currentCashDeskChipBalance >= 0
                  ? 'background-color: #108f3d!important'
                  : 'background-color: #dc3545!important'
              "
            >
              <span data-cy="cageTotal">{{ priceAbsFormatted(currentCashDeskChipBalance) }}</span>
              <q-icon
                data-cy="reloadCageBalanceBtn"
                name="sync"
                size="xs"
                class="cursor-pointer"
                v-el-perms="'Addon.CageOperations.Balance.CurrentBalanceReload'"
                @click="cashdeskStore.setCashdeskChipBalance()"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-markup-table
      dense
      separator="cell"
      square
      class="no-box-shadow cursor-pointer"
      bordered
      style="min-width: 290px"
      v-if="showTotal"
    >
      <thead @click="showTotal = false">
        <tr>
          <th class="text-center app-cart-grey">
            <div class="text-subtitle2 text-bold">
              <q-img
                src="/assets/icons8-cash-80.png"
                style="width: 20px; height: 20px"
                class="q-mr-xs"
              />
              {{ $t('total') }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            class="min-150 text-center text-white"
            v-el-perms="'Addon.CageOperations.Balance.ShowCurrentBalances'"
          >
            <div
              class="text-balance text-bold heartbeat flex content-center items-center justify-center"
              :style="
                total >= 0
                  ? 'background-color: #108f3d!important'
                  : 'background-color: #dc3545!important'
              "
            >
              <span data-cy="cageTotal">{{ priceAbsFormatted(total) }}</span>
              <span
                class="cursor-pointer q-ml-sm"
                v-if="currencies.length"
                data-cy="cageCurrencyName"
              >
                {{ getDefaultCurrencyName }}
              </span>
              <q-icon
                data-cy="reloadCageBalanceBtn"
                name="sync"
                size="xs"
                class="q-mb-xs cursor-pointer"
                v-el-perms="'Addon.CageOperations.Balance.CurrentBalanceReload'"
                @click="cashdeskStore.setCashdeskBalance()"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<style scoped lang="scss">
.text-balance {
  font-size: 0.85rem !important;
  border-radius: 3px;
  padding: 4px;
  @media (max-width: 1240px) {
    font-size: 1.3vw !important;
  }
}
.borderLeftWhite {
  border-left: 0.5px solid white !important;
}
.min-150 {
  min-width: 130px;
}

.gaming-date-chip {
  transition: all 0.2s ease;
  min-height: 36px !important;
  padding: 8px 12px !important;
  width: auto !important;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
