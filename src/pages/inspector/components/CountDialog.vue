<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="" square style="min-width: 800px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="row">
          <div class="col-12 flex">
            <div class="text-subtitle1 text-bold flex content-end items-center">
              <q-icon name="hourglass_empty" size="sm" />
              {{ $t('tableCount') }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <Information
          class="full-width"
          content="Masaları gün sonu kapatılırken sayılan çipler buradan girilecektir."
        />
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-6">
            <div class="row" v-for="(denom, index) in tableFloatDenoms" :key="index">
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
                  @update:model-value="onInput"
                >
                  <template v-slot:append>
                    <div
                      class="text-subtitle2 text-bold q-pl-md appendAmount flex justify-end"
                      style="width: 200px"
                    >
                      {{ denom.quantity || 0 }} x {{ denom.chipDenom || 0 }} =
                      {{ priceAbsFormatted((denom.quantity || 0) * denom.chipDenom) }}
                    </div>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row absolute-bottom">
              <div class="col-12 q-pa-xs flex justify-start">
                <div class="text-h6 text-bold text-grey-5 text-center">
                  <span class=" ">
                    <q-icon name="o_info" size="sm" />
                    {{ $t('totalDrop') }}: </span
                  >{{ priceAbsFormatted(totalDrop) }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row">
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
                <div class="row">
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
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useTableStore } from 'src/stores/table-store'
const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
import { useDialogPluginComponent } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'

const tableStore = useTableStore()
const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  totalDrop: {
    type: Number,
    required: false,
  },
})
const tableFloatDenoms = ref([])
const SelectedTableFloatDenom = ref()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const onOKClick = async () => {
  let formData = {
    chipInfo: [...tableFloatDenoms.value],
    tableId: props.table.id,
    floatSetId: props.table.floatSetId,
  }
  const result = await tableStore.updateChipCount(formData)

  if (result.status === 200) {
    onDialogOK({})
  }
}

onMounted(async () => {
  const tableCount = await tableStore.getTableCountByTable({
    tableId: props.table.id,
    gamingDateId: props.table.gamingDateId,
    floatSetId: props.table.floatSetId,
  })

  tableFloatDenoms.value = tableCount.chipInfo
    .filter((chip) => chip.chipType === 'Chip')
    .sort((a, b) => a.chipDenom - b.chipDenom)

  SelectedTableFloatDenom.value = tableFloatDenoms.value[0]
})

const latestClickedDenomInputIndex = ref(0)
const inputRefs = ref([])

watch(latestClickedDenomInputIndex, (newIndex) => {
  if (inputRefs.value[newIndex]) {
    inputRefs.value[newIndex].focus()
  }
})

const onClickNumber = (number) => {
  let value = tableFloatDenoms.value[latestClickedDenomInputIndex.value].quantity || ''
  if (value.length === 0 && number === 0) {
    return
  }
  let newValue = value + '' + number
  tableFloatDenoms.value[latestClickedDenomInputIndex.value].quantity = newValue
}

const onClickCleanDenoms = () => {
  tableFloatDenoms.value.forEach((denom) => {
    denom.quantity = ''
  })
}

const onClickRevokeDenom = () => {
  let value = tableFloatDenoms.value[latestClickedDenomInputIndex.value].quantity || ''
  let newValue = value.slice(0, -1)
  tableFloatDenoms.value[latestClickedDenomInputIndex.value].quantity = newValue
}

const onClickUpArrow = () => {
  if (latestClickedDenomInputIndex.value === 0) {
    latestClickedDenomInputIndex.value = tableFloatDenoms.value.length - 1
  } else {
    latestClickedDenomInputIndex.value--
  }
}

const onClickDownArrow = () => {
  if (latestClickedDenomInputIndex.value >= tableFloatDenoms.value.length) {
    latestClickedDenomInputIndex.value = 0
  } else {
    latestClickedDenomInputIndex.value++
  }
}
const onInput = (e) => {
  if (e.startsWith('0')) {
    e = e.slice(1)
  }
  tableFloatDenoms.value[latestClickedDenomInputIndex.value].quantity = e
}
</script>
<style scoped lang="scss">
.appendAmount {
  margin-right: -5px;
  min-width: 100px;
  border-left: 1px solid #dddddd;
}
</style>
