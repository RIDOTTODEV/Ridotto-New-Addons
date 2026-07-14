<script setup>
// temporary preview harness for DateTimePicker (delete after visual check)
import { ref } from 'vue'

const model = ref(null)
const lastEmit = ref(null)
const onSelected = (params) => {
  lastEmit.value = params
}
</script>

<template>
  <div class="q-pa-xl" style="max-width: 900px; margin: 0 auto">
    <h6 class="q-mb-md">DateTimePicker Preview</h6>
    <div class="row q-gutter-md items-start">
      <date-time-picker v-model="model" @selectedDate="onSelected" />
      <date-time-picker label="Oyun Tarihi" disabled />
    </div>
    <pre id="emit-output" style="margin-top: 24px; font-size: 12px">{{
      JSON.stringify({ lastEmit, model }, null, 2)
    }}</pre>
  </div>
</template>
