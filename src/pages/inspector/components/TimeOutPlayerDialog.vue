<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin" square>
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('confirm') }} <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="">
        <div class="row q-mt-md">
          <div class="text-subtitle2">
            {{ $t('timeOutPlayerMessage', { avgBet: avgBet }) }}
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
  avgBet: {
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function onOKClick() {
  onDialogOK(true)
}
</script>
