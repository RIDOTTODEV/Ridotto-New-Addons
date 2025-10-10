<script setup>
import { i18n } from 'src/boot/i18n'
import { ref, watchEffect, onMounted } from 'vue'
import { usePlayerStore } from 'src/stores/player-store'
const playerStore = usePlayerStore()
const emits = defineEmits(['update:modelValue', 'onSelectPlayer', 'onClear'])
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
  playerId: {
    type: Number,
    default: () => null,
    required: false,
  },
})
const initialDisplayedValue = ref('')
const input = ref(props.modelValue)
const searchLoading = ref(false)
const options = ref([])
const onFilterPlayer = async (val, update) => {
  if (val === '') {
    update(() => {
      options.value = []
    })
    searchLoading.value = false
    return
  }

  const needle = val.toLowerCase()
  searchLoading.value = true
  const players = await playerStore.searchPlayer(needle)
  update(() => {
    options.value = players
    searchLoading.value = false
  })
  return
}
const onSelected = (value) => {
  let player = options.value.find((item) => item.id === value)
  emits('onSelectPlayer', player)
}
const onClear = () => {
  emits('onClear')
}

watchEffect(() => {
  initialDisplayedValue.value = props.displayedValue
})

const handleImageError = (event) => {
  event.target.src = '/assets/no-image.png'
}

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
  if (props.setValueById && props.playerId) {
    setValueById()
  }
})

const setValueById = async () => {
  const player = await playerStore.searchPlayer(props.playerId)
  options.value = player
  onSelected(props.playerId)
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
    @filter="onFilterPlayer"
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
        <q-item-section avatar>
          <q-avatar size="32px">
            <img
              :src="$playerPhotoUrl + scope.opt.id"
              :alt="scope.opt.value"
              :error-src="'/assets/no-image.png'"
              @error="handleImageError"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt[optionLabel] }}</q-item-label>
          <q-item-label caption>{{ $t('playerId') }}: {{ scope.opt.id }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-select>
</template>

<style scoped lang="scss"></style>
