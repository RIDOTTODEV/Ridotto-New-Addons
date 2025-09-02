<template>
  <q-input
    ref="inputRef"
    v-model="formattedValue"
    outlined
    dense
    lazy-rules
    :placeholder="placeholder"
    :autofocus="autofocus"
    :clearable="clearable"
    :rules="customRules"
    :hint="hint"
    :disable="disable"
    :readonly="readonly"
    :hide-bottom-space="hideBottomSpace"
    class="super-small"
    @change="onChangeContent"
  >
    <!--  bunu nerde kullandın kontrol et  {{  :debounce="debounce"}}-->
    <template v-slot:prepend>
      <div class="text-subtitle1" v-if="prepend !== ''">
        {{ prepend }}
      </div>
    </template>
    <template v-slot:append>
      <q-btn
        v-if="allAmount"
        flat
        color="primary"
        no-caps
        :label="allAmount.toFixed(2) + ' All '"
        style="margin-right: -13px"
        @click="setValue(props.allAmount)"
      />
    </template>
    <template v-slot:after>
      <q-btn
        padding="3px"
        v-if="copyValue"
        flat
        :color="isCopied ? 'positive' : 'primary'"
        :icon="isCopied ? 'done_all' : 'content_copy'"
        @click="onHandleCopyValue"
        class="q-mr-xs"
      />
    </template>
  </q-input>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'

import { watch, ref } from 'vue'

const props = defineProps({
  modelValue: {
    // type: Number,
    required: false,
  },
  currency: {
    type: String,
    required: true,
  },
  customRules: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  precision: {
    type: Number,
    default: 0,
    required: false,
  },
  precisionRange: {
    type: Object,
    default: () => ({
      min: 0,
      max: 6,
    }),
    required: false,
  },
  hint: {
    type: String,
    default: '',
    required: false,
  },
  disable: {
    type: Boolean,
    default: false,
    required: false,
  },
  prepend: {
    type: String,
    default: '',
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
    required: false,
  },
  debounce: {
    type: Number,
    default: 0,
    required: false,
  },
  hideBottomSpace: {
    type: Boolean,
    default: true,
    required: false,
  },
  allAmount: {
    type: Number,
    default: () => null,
    required: false,
  },
  clearable: {
    type: Boolean,
    default: true,
    required: false,
  },
  setValue: {
    type: Object,
    default: () => {
      return {
        func: null,
        params: null,
      }
    },
    required: false,
  },
  showOriginalValue: {
    type: Boolean,
    default: false,
    required: false,
  },
  copyValue: {
    type: Boolean,
    default: false,
    required: false,
  },
  usePrecision: {
    type: Boolean,
    default: () => false,
    required: false,
  },
})

const { inputRef, formattedValue, numberValue, setValue, setOptions } = useCurrencyInput({
  currency: props.currency,
  hideCurrencySymbolOnFocus: true,
  currencyDisplay: 'hidden',

  precision: props.usePrecision
    ? {
        min: 0,
        max: props.precision,
      }
    : {},
  hideGroupingSeparatorOnFocus: true,
  hideNegligibleDecimalDigitsOnFocus: true,
  autoDecimalDigits: false,
  useGrouping: true,
  accountingSign: false,
})

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  },
)

watch(
  () => props.currency,
  (currency) => {
    setOptions({ currency })
  },
)
watch(
  () => formattedValue.value,
  () => {
    if (props.showOriginalValue === true) {
      if (Number.isInteger(numberValue.value) && Number(numberValue.value) === 1) {
        formattedValue.value = numberValue.value
      }
    }
  },
)
const onChangeContent = (params) => {
  if (props.setValue.func !== null) {
    props.setValue.func({
      ...props.setValue.params,
      value: parseFloat(params),
    })
  }
}

const isCopied = ref(false)
const onHandleCopyValue = async () => {
  if (!numberValue.value) return
  await navigator.clipboard.writeText(numberValue.value).then(
    () => {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 1000)
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
    },
  )
}
</script>

<style lang="scss">
.q-field__bottom--stale {
  display: none;
}
</style>
