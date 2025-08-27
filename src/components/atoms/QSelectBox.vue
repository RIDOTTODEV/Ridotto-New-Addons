<template>
  <q-select
    v-model="model"
    :options="tempOptions"
    :option-label="optionLabel"
    :option-value="optionValue"
    use-input
    behavior="menu"
    dense
    input-debounce="0"
    @filter="filter"
    outlined
    class="super-small"
    clearable
    emit-value
    map-options
    lazy-rules
    reactive-rules
  />
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  optionLabel: {
    type: String,
    required: true,
  },
  optionValue: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
    default: () => '',
  },
  fetchFn: {
    type: Function,
    required: false,
    default: () => null,
  },
})
const tempOptions = ref([])

const filter = async (val, update) => {
  if (val === '' && props.options.length === 0 && props.fetchFn) {
    await props.fetchFn()
  }
  if (val === '') {
    update(() => {
      tempOptions.value = [...props.options]
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    tempOptions.value = [...props.options].filter((option) => {
      return option[props.optionLabel].toLowerCase().includes(needle)
    })
  })
}
const model = defineModel()
onMounted(() => {
  tempOptions.value = [...props.options]
})
</script>
