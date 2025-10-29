<script setup>
import { i18n } from 'src/boot/i18n'
import { ref, watchEffect, onMounted } from 'vue'
import { searchService } from 'src/api'
const emits = defineEmits(['update:modelValue', 'onSelectMachine', 'onClear'])
const props = defineProps({
  modelValue: {
    default: () => '',
  },
  optionLabel: {
    type: String,
    default: () => 'fullName',
    required: false,
  },
  displayedValue: {
    type: String,
    default: () => '',
    required: false,
  },
  placeholder: {
    type: String,
    default: () => i18n.global.t('search'),
    required: false,
  },
  setValueById: {
    type: Boolean,
    default: false,
    required: false,
  },
  machineId: {
    type: Number,
    default: () => null,
    required: false,
  },
})
const initialDisplayedValue = ref('')
const input = ref(props.modelValue)
const searchLoading = ref(false)
const options = ref([])
const onFilterMachine = async (val, update) => {
  if (val === '') {
    update(() => {
      options.value = []
    })
    searchLoading.value = false
    return
  }

  const needle = val.toLowerCase()
  searchLoading.value = true
  const { data: machines } = await searchService.raw({ input: needle })
  update(() => {
    options.value = machines
    searchLoading.value = false
  })
  return
}
const onSelected = (value) => {
  let machine = options.value.find((item) => item.id === value)
  emits('onSelectMachine', machine)
}
const onClear = () => {
  emits('onClear')
}

watchEffect(() => {
  initialDisplayedValue.value = props.displayedValue
})

const isInputFocused = ref(false)
const handleInputFocus = () => {
  isInputFocused.value = true
}
const handleInputFocusOut = () => {
  if (input.value?.length === 0 || input.value === null) {
    isInputFocused.value = false
  }
}

const onEnter = () => {
  if (options.value.length === 1) {
    onSelected(options.value[0].id)
  }
}

onMounted(() => {
  if (props.setValueById && props.machineId) {
    setValueById()
  }
})

const setValueById = async () => {
  const machine = await searchService.raw({ input: props.machineId })
  options.value = machine
  onSelected(props.machineId)
}
</script>

<template>
  <q-select
    dense
    :placeholder="placeholder"
    outlined
    :use-input="!displayedValue"
    clearable
    v-model="input"
    :model-value="initialDisplayedValue"
    :options="options"
    emit-value
    map-options
    :option-label="optionLabel"
    option-value="id"
    :loading="searchLoading"
    input-debounce="1000"
    debounce="1000"
    @filter="onFilterMachine"
    :popup-content-class="options.length > 0 ? 'user-exist-popup-content' : ''"
    behavior="menu"
    hide-bottom-space
    @update:model-value="onSelected"
    @clear="onClear"
    :hide-dropdown-icon="true"
    :class="{ 'search-input--focused': isInputFocused }"
    @focus="handleInputFocus"
    @focusout="handleInputFocusOut"
    class="super-small"
    @keydown.enter="onEnter"
  >
    <template v-slot:no-option>
      <q-item v-if="searchLoading">
        <q-item-section class="text-grey">
          {{ $t('notFound') }}
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt[optionLabel] }}</q-item-label>
          <q-item-label caption>{{ $t('machineId') }}: {{ scope.opt.id }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-select>
</template>

<style scoped lang="scss"></style>
