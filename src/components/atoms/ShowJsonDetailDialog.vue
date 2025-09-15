<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 1000px !important">
      <q-card-section>
        <vue-json-pretty
          :data="jsonDetail"
          virtual
          :height="700"
          showLine
          showKeyValueSpace
          collapsedOnClickBrackets
          showIcon
          showDoubleQuotes
          :theme="$q.dark.isActive ? 'dark' : 'light'"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="negative" flat unelevated no-caps label="Kapat" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const jsonDetail = ref(props.data)
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
</script>
