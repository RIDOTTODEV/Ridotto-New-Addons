<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    square
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 600px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          <q-icon name="o_settings" class="q-mr-sm" />
          <span v-if="type === 'status'"> {{ $t('updateReservationsStatus') }} </span>
          <span v-if="type === 'groupCode'"> {{ $t('updateReservationsGroupCode') }} </span>
          <span v-if="type === 'groupMarketer'"> {{ $t('updateReservationsMarketer') }} </span>
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md">
        <div class="text-subtitle2 q-mb-md text-grey-8 text-capitalize" v-if="type === 'status'">
          {{ $t('status') }}
        </div>

        <div class="text-subtitle2 q-mb-md text-grey-8 text-capitalize" v-if="type === 'groupCode'">
          {{ $t('grop code') }}
        </div>
        <div
          class="text-subtitle2 q-mb-md text-grey-8 text-capitalize"
          v-if="type === 'groupMarketer'"
        >
          {{ $t('group marketer') }}
        </div>

        <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
          <div class="row">
            <q-select-box
              v-model="statusFormValues.status"
              :options="statusesOptions"
              hide-bottom-space
              v-if="type === 'status'"
              option-label="label"
              option-value="value"
              class="col-12"
            />
            <q-select-box
              v-model="groupCodeFormValues.groupCodeId"
              :options="groupCodeOptions"
              hide-bottom-space
              v-if="type === 'groupCode'"
              option-label="code"
              option-value="id"
              class="col-12"
            />
            <q-select-box
              v-model="groupMarketerFormValues.marketerId"
              :options="junketsOptions"
              hide-bottom-space
              v-if="type === 'groupMarketer'"
              option-label="name"
              option-value="id"
              class="col-12"
            />
          </div>
          <div class="row q-mt-lg">
            <q-space />
            <q-btn
              flat
              color="grey"
              :label="$t('cancel')"
              class="q-mr-sm"
              type="button"
              no-caps
              @click="onDialogCancel"
            />
            <q-btn
              type="submit"
              color="primary"
              :label="$t('save')"
              unelevated
              icon="save"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  groupCodes: {
    type: Array,
    required: true,
  },
  junkets: {
    type: Array,
    required: true,
  },
  statuses: {
    type: Array,
    required: true,
  },
  hotelReservationIds: {
    type: Array,
    required: true,
  },
  actionFn: {
    type: Function,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const statusesOptions = ref(props.statuses)
const junketsOptions = ref(props.junkets)
const groupCodeOptions = ref(props.groupCodes)

const statusFormValues = ref({
  status: null,
  hotelReservationIds: props.hotelReservationIds,
})
const groupCodeFormValues = ref({
  groupCodeId: null,
  hotelReservationIds: props.hotelReservationIds,
})
const groupMarketerFormValues = ref({
  marketerId: null,
  hotelReservationIds: props.hotelReservationIds,
})
const onSubmit = async () => {
  let data = {}
  if (props.type === 'status') {
    data = { ...statusFormValues.value }
  } else if (props.type === 'groupCode') {
    data = { ...groupCodeFormValues.value }
  } else if (props.type === 'groupMarketer') {
    data = { ...groupMarketerFormValues.value }
  }
  const response = await props.actionFn({ ...data })
  if (response.status === 200) {
    $q.notify({
      message: `Reservation ${props.type} updated successfully`,
      color: 'positive',
    })
    onDialogHide()
  } else {
    $q.notify({
      message: 'Failed to update reservation',
      color: 'negative',
    })
  }
}
</script>

<style scoped lang="scss">
// Add any additional styling if needed
</style>
