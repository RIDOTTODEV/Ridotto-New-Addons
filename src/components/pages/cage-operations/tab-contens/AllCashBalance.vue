<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { priceAbsFormatted } from 'src/helpers/helpers'
const cashDeskStore = useCashdeskStore()
const { getSelectedCashDeskId } = storeToRefs(cashDeskStore)
const allCashDeskCountDenominations = ref([])

onMounted(async () => {
  allCashDeskCountDenominations.value = await cashDeskStore.fetchAllCashDeskCountDenominations({
    cashdeskId: getSelectedCashDeskId.value,
  })
})
</script>

<template>
  <div class="row full-width" v-if="allCashDeskCountDenominations.length > 0">
    <div class="col q-pa-sm" v-for="(item, index) in allCashDeskCountDenominations" :key="index">
      <div class="row flex justify-between">
        <div class="text-subtitle1">{{ item.currencyName }}</div>
        <div class="text-subtitle1">
          {{ priceAbsFormatted(item.totalAmount) }}
        </div>
        <el-tooltip class="item" effect="dark" content="Reset" placement="top-start">
          <q-icon
            name="o_delete_forever"
            color="primary"
            class="cursor-pointer my-icon"
            size="20px"
            disabled
            v-el-perms="'Addon.CageOperations.Tab.BalanceResetAll'"
          />
        </el-tooltip>
      </div>
      <q-markup-table separator="cell" flat square bordered dense>
        <thead>
          <tr>
            <th class="grey-card text-center">Denom</th>
            <th class="grey-card text-right">Amount</th>
          </tr>
        </thead>
        <tbody class="denom-body">
          <tr v-for="(denom, denomIndex) in item.cashdeskCountDenominations" :key="denomIndex">
            <td class="text-center cursor-not-allowed">
              {{ denom.denomination }}
            </td>
            <td class="text-center bg-grey-2">
              <q-field
                style="overflow: hidden"
                v-model="denom.quantity"
                hide-bottom-space
                borderless
                standout
                disabled
                dense
                flat
                type="number"
                class="q-pa-none q-ma-none super-small text-center"
                lazy-rules
                input-class="text-center"
              >
                <template v-slot:control="{ id, modelValue, emitValue }">
                  <input
                    type="number"
                    :id="id"
                    class="q-field__input q-pa-none number-to-text text-center bg-white myInput"
                    :value="modelValue"
                    @change="(e) => emitValue(e.target.value)"
                    pattern="[0-9]+([\.,][0-9]+)?"
                    v-el-perms="'Addon.CageOperations.Tab.BalanceUpdate'"
                    readonly
                    disable
                  />
                </template>
              </q-field>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<style lang="scss">
.q-table tbody tr td {
  height: 20px !important;
}

input.number-to-text::-webkit-outer-spin-button,
input.number-to-text::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'].number-to-text {
  -moz-appearance: textfield;
}

.myInput input {
  cursor: pointer !important;
}
</style>
