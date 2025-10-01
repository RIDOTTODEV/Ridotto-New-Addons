<script setup>
import { storeToRefs } from 'pinia'
import { useChipManagementStore } from 'src/stores/chip-management-store'
import { formatPrice } from 'src/helpers/helpers'
import { onMounted, ref, watch } from 'vue'

const model = defineModel({
  required: true,
  type: Array,
  default: () => [],
})
const emit = defineEmits(['initChips'])
const props = defineProps({
  chipCurrencyId: {
    type: Number,
    default: () => null,
    required: false,
  },
})
const chipManagementStore = useChipManagementStore()

const { chips, gamingChipTypes, getChipsGridFormatted } = storeToRefs(chipManagementStore)

const chipsFormatted = ref([])

onMounted(() => {
  if (chips.value.length === 0) {
    chipManagementStore.fetchChips()
  }
  if (gamingChipTypes.value.length === 0) {
    chipManagementStore.fetchGamingChipTypes()
  }
  chipsFormatted.value = JSON.parse(
    JSON.stringify([...getChipsGridFormatted.value(props.chipCurrencyId)]),
  )
  emit('initChips', chipsFormatted.value)
})

watch(
  () => getChipsGridFormatted.value(props.chipCurrencyId),
  (value) => {
    if (value) {
      chipsFormatted.value = JSON.parse(JSON.stringify([...value]))
      emit('initChips', chipsFormatted.value)
    }
  },
)

const onUpdate = (denom, value) => {
  denom.amount = +value * denom.value
  const data = chipsFormatted.value
    .map((chip) => {
      return chip?.children
        .filter((d) => d.amount > 0)
        .map((d) => {
          return {
            chipDenomId: d.chipDenomId,
            value: parseFloat(d.value),
            quantity: parseInt(d.quantity),
            chipId: d.chipId,
            chipCurrencyId: d.chipCurrencyId,
            amount: parseFloat(d.amount),
            chipDenomName: d.chipDenomName || null,
            chipType: d.chipType || null,
            currencyName: chip.currencyName || null,
          }
        })
    })
    .reduce((acc, val) => acc.concat(val), [])
  model.value = data
}

watch(model, (value) => {
  if (value.length === 0) {
    chipsFormatted.value = JSON.parse(
      JSON.stringify([...getChipsGridFormatted.value(props.chipCurrencyId)]),
    )
  }
})

// watch the chipCurrencyId
watch(
  () => props.chipCurrencyId,
  (value) => {
    // Yeni değer ile chipleri yeniden yükle
    chipsFormatted.value = JSON.parse(JSON.stringify([...getChipsGridFormatted.value(value)]))
  },
  { immediate: true },
)
</script>

<template>
  <q-card flat square class="app-cart">
    <q-card-section class="row q-pa-none">
      <div class="col q-pa-xs" v-for="(item, index) in chipsFormatted" :key="index">
        <div class="row">
          <div class="col-12 text-left flex justify-start content-center">
            <div class="text-subtitle2 text-bold q-pl-xs">
              {{ item.currencyName }} - {{ item?.name }}
              <span class="text-negative text-bold">*</span>
            </div>
            <span class="q-ml-sm q-mr-sm">|</span>
            <div
              :style="{
                backgroundColor: item.color,
                width: '20px',
                height: '20px',
                borderRadius: '50px',
              }"
            ></div>
          </div>
        </div>
        <q-markup-table separator="cell" flat square bordered dense>
          <thead>
            <tr>
              <th>Denom</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody class="denom-body">
            <tr v-for="(denom, denomIndex) in item.children" :key="denomIndex">
              <td class="text-center">
                {{ denom.value }}
              </td>
              <td class="bg-grey-2">
                <q-field
                  style="overflow: hidden"
                  v-model="denom.quantity"
                  hide-bottom-space
                  borderless
                  standout
                  dense
                  flat
                  type="number"
                  class="q-pa-none q-ma-none super-small text-center"
                  lazy-rules
                  @focus="(e) => (e.target.select ? e.target.select() : null)"
                  @update:model-value="(val) => onUpdate(denom, val)"
                  :autofocus="index === 0"
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
                    />
                  </template>
                </q-field>
              </td>
              <td class="text-center">
                {{ formatPrice(denom.quantity * denom.value) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="text-right" colspan="3" style="border-top: 1px solid #e2e2e2 !important">
                <div class="text-caption text-bold">
                  {{ $t('total') }}:
                  <span class="text-negative q-ml-md">
                    {{
                      formatPrice(
                        item.children.reduce((acc, curr) => acc + curr.quantity * curr.value, 0),
                      )
                    }}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </q-markup-table>
      </div>
      <div
        class="q-pa-sm q-mt-md q-mb-md col-12 flex justify-start content-start app-cart-grey q-card--bordered"
      >
        <div class="flex row no-wrap justify-start content-start">
          <div class="text-subtitle1 text-bold full-width">{{ $t('total') }}:</div>
          <div class="text-subtitle1 text-bold text-negative q-ml-md">
            {{
              formatPrice(
                chipsFormatted.reduce(
                  (acc, curr) => acc + curr.children.reduce((acc, curr) => acc + curr.amount, 0),
                  0,
                ),
              )
            }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.myInput {
  border: 1px solid #dddddd;
  margin-left: 2px;
  margin-right: 2px;
}
</style>
