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
          {{ $t('expenseSettings') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md">
        <div class="text-subtitle1 q-mb-md text-grey-8">
          <q-icon name="o_info" size="sm" class="q-mr-sm" />
          {{ $t('expenseTypeMappings') }}
        </div>

        <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
          <!-- Hotel Expense Type -->
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              <q-icon name="o_hotel" size="xs" class="q-mr-xs" />
              {{ $t('hotelExpenseType') }}
            </div>
            <q-select
              v-model="localSettings.HotelExpenseTypeId"
              :options="expenseParameters"
              outlined
              dense
              option-label="name"
              option-value="id"
              emit-value
              map-options
              clearable
              :rules="[(val) => !!val || $t('requiredField')]"
            />
          </div>

          <!-- Flight Expense Type -->
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              <q-icon name="o_flight" size="xs" class="q-mr-xs" />
              {{ $t('flightExpenseType') }}
            </div>
            <q-select
              v-model="localSettings.FlightExpenseTypeId"
              :options="expenseParameters"
              outlined
              dense
              option-label="name"
              option-value="id"
              emit-value
              map-options
              clearable
              :rules="[(val) => !!val || $t('requiredField')]"
            />
          </div>

          <!-- Flight Return Ticket Expense Type -->
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              <q-icon name="o_flight_takeoff" size="xs" class="q-mr-xs" />
              {{ $t('flightReturnTicketExpenseType') }}
            </div>
            <q-select
              v-model="localSettings.FlightReturnTicketExpenseTypeId"
              :options="expenseParameters"
              outlined
              dense
              option-label="name"
              option-value="id"
              emit-value
              map-options
              clearable
              :rules="[(val) => !!val || $t('requiredField')]"
            />
          </div>

          <!-- Action Buttons -->
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
import { useDialogPluginComponent } from 'quasar'
import { ref, watch } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  expenseParameters: {
    type: Array,
    default: () => [],
  },
  actionFn: {
    type: Function,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// Create local reactive copy of settings
const localSettings = ref({ ...props.settings })

// Watch for changes in props and update local values
watch(
  () => props.settings,
  (newVal) => {
    localSettings.value = { ...newVal }
  },
  { deep: true },
)

function onOKClick() {
  onDialogOK()
}

const onSubmit = async () => {
  // Update the original settings before submitting

  const response = await props.actionFn({ ...localSettings.value })
  if (response) {
    onOKClick()
  }
}
</script>

<style scoped lang="scss">
// Add any additional styling if needed
</style>
