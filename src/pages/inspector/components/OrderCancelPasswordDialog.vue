<template>
  <q-dialog
    transition-duration="100"
    ref="dialogRef"
    @hide="onDialogHide"
    square
    style="z-index: 1 !important"
    persistent
    position="top"
    backdrop-filter="blur(4px) saturate(150%)"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card flat class="q-dialog-plugin" style="min-width: 700px; margin-top: 100px">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="text-subtitle1 flex items-center content-center text-negative text-bold">
            <q-icon name="o_info" size="sm" class="q-mr-sm" /> {{ $t('requiredPassword') }}
          </div>
          <div class="text-subtitle2">
            {{ $t('requirePasswordMessage') }}
          </div>
        </q-card-section>
        <q-card-section>
          <KioskBoardInput
            square
            @close-modal="onSubmit"
            :autofocus="true"
            :type="'text'"
            v-model="formValues.password"
            :label="$t('password')"
            :rules="[(val) => !val || $t('requiredField', { fieldName: $t('requiredPassword') })]"
          />
        </q-card-section>
        <q-card-actions class="q-pa-none">
          <q-btn
            no-caps
            icon="save"
            size="lg"
            square
            class="full-width"
            color="dark"
            unelevated
            :label="$t('ok')"
            @click="onSubmit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

defineProps({
  currentPassword: {
    type: String,
    default: () => '',
  },
})
const formValues = ref({
  password: '',
})
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const onSubmit = async () => {
  onDialogOK(formValues.value)
}
</script>
