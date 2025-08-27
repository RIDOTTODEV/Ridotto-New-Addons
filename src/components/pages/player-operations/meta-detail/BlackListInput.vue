<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width: 500px !important">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('areYouSure') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">
          {{ formFields.IsBlackListed ? $t('confirmBlacklist') : $t('confirmRemoveBlackList') }}
        </div>
        <q-form @submit="onSubmit" class="q-mt-md">
          <div class="col-12">
            <div class="text-subtitle1 text-bold">
              {{ $t('requestBy') }} <span class="text-negative">*</span>
            </div>
            <q-input
              v-model="formFields.RequestBy"
              lazy-rules
              :rules="[(val) => !!val || $t('requiredField')]"
              type="text"
              outlined
              autofocus
              dense
              data-cy="requestBy"
            />
          </div>
          <div class="col-12">
            <div class="text-subtitle1 text-bold">
              {{ formFields.IsBlackListed ? $t('blackListNote') : $t('blackListRemoveNote') }}
              <span class="text-negative">*</span>
            </div>
            <q-input
              v-model="formFields.Reason"
              lazy-rules
              :rules="[(val) => !!val || $t('blackListNote')]"
              type="textarea"
              outlined
              rows="2"
              dense
              data-cy="reason"
            />
          </div>
          <div class="col-12 text-right">
            <q-btn
              color="primary"
              autofocus
              type="button"
              class="q-mr-sm"
              flat
              :label="$t('cancel')"
              @click="onDialogCancel"
            />
            <q-btn
              data-cy="submit"
              color="negative"
              type="submit"
              flat
              :label="formFields.IsBlackListed ? $t('blacklist') : $t('removeBlacklist')"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
const formFields = ref({
  RequestBy: '',
  Reason: '',
  PlayerId: props.data.playerId,
  IsBlackListed: props.data.isBlackListed,
  id: props.data?.id ? props.data.id : null,
  CreatorUserId: props.data?.creatorUserId ? props.data.creatorUserId : 0,
  CasinoId: 1,
})
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const onSubmit = () => {
  onDialogOK({ ...formFields.value })
}
</script>
