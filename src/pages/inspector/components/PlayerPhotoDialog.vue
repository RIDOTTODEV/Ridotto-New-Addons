<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card square>
      <q-card-section class="app-cart-grey q-pa-xs row flex justify-between">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('Player Photo') }} <span class="text-negative">*</span>
        </div>
        <q-separator />
        <q-btn no-caps flat unelevated icon="far fa-times-circle" @click="onDialogCancel" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-img :src="$playerPhotoUrl + playerId" width="400px" error-src="/assets/no-photo.png" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'

defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, /* onDialogOK, */ onDialogCancel } = useDialogPluginComponent()

/*   function onOKClick() {
    onDialogOK();
  } */
</script>
