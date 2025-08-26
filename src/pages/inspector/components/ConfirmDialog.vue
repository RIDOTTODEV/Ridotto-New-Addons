<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin" square>
      <q-card-section class="app-cart-grey q-pa-xs flex justify-between">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('confirm') }}
          <span class="text-negative">*</span>
        </div>

        <span
          class="bg-warning flex content-center items-center text-capitalize q-pl-xs q-pr-xs text-subtitle2 q-ml-sm q-mr-sm"
          >{{ actionTitle }}
        </span>
      </q-card-section>
      <q-card-section class="">
        <div class="row q-mt-md">
          <div class="text-subtitle1 col-12 text-bold flex content-end items-center">
            {{ playerName }}
          </div>
          <div class="text-subtitle2 col-12">
            {{ message }}
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          no-caps
          color="negative"
          unelevated
          :label="$t('cancel')"
          icon="far fa-times-circle"
          @click="onDialogCancel"
        />
        <q-btn
          no-caps
          color="positive"
          unelevated
          :label="$t('accept')"
          icon="far fa-check-circle"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'

defineProps({
  playerName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  actionTitle: {
    type: String,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function onOKClick() {
  onDialogOK()
}
</script>
