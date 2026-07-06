<!-- FloatLabelInput.vue -->
<template>
    <div class="float-label-wrapper" :class="{ 'is-floating': isFloating }">
      <q-input
        v-model="model"
        :dense="dense"
        :outlined="outlined"
        @focus="focused = true"
        @blur="focused = false"
        class="super-small fixed-field-width"
      />
      <label class="float-label">{{ label }}</label>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  
  const props = defineProps({
    modelValue: [String, Number],
    label: String,
    outlined: Boolean,
    dense: Boolean,
  })
  const emit = defineEmits(['update:modelValue'])
  
  const focused = ref(false)
  const model = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
  })
  
  const isFloating = computed(
    () => focused.value || (model.value !== null && model.value !== '' && model.value !== undefined)
  )
  </script>
  
  <style scoped lang="scss">
  .float-label-wrapper {
    position: relative;
  
    .float-label {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      background: white;
      padding: 0 4px;
      pointer-events: none;
      transition: all 0.2s ease;
      font-size: 14px;
    }
  
    &.is-floating .float-label {
      top: 0;
      transform: translateY(-50%) scale(0.85);
      color: var(--q-primary);
    }
  }
  </style>