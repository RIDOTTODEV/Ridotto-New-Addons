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
        <q-img :src="playerPhoto" width="400px" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { computed } from 'vue'

const props = defineProps({
  photo: {
    type: String,
    required: false,
    default: () => '/assets/no-photo.png',
  },
})

defineEmits([...useDialogPluginComponent.emits])
const playerPhoto = computed(() => {
  return props.photo ? 'data:image/png;base64,' + props.photo : '/assets/no-photo.png'
})
const { dialogRef, onDialogHide, /* onDialogOK, */ onDialogCancel } = useDialogPluginComponent()

/*   function onOKClick() {
    onDialogOK();
  } */
</script>
