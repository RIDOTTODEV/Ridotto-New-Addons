<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    square
    transition-show="slide-left"
    transition-hide="slide-right"
    maximized
    position="right"
  >
    <q-card style="width: 600px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          <q-icon name="o_report" class="q-mr-sm" />
          {{ $t('roomCountByDay') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md">
        <SupaTable
          tableName="hotelReservations"
          :getDataFn="guestManagementStore.fetchRoomCountByDays"
          :filterParams="filterParams"
          :columns="columns"
          ref="hotelGuestListTableRef"
        >
          <template v-slot:headerFilterSlots="{ props }">
            <div class="col-6 flex row justify-start">
              {{ props.date }}
              <date-time-picker
                class="q-ml-sm"
                @selected-date="
                  (val) => {
                    filterParams = { ...filterParams, ...val }
                  }
                "
                :setDate="computedDate"
              />
              <q-btn
                type="button"
                :label="$t('filter')"
                icon="tune"
                color="grey-2"
                text-color="dark"
                size="13px"
                unelevated
                no-caps
                class="q-ml-sm"
                @click="props.reload()"
              />
            </div>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
const guestManagementStore = useGuestManagementStore()

defineEmits([...useDialogPluginComponent.emits])
const props = defineProps({
  date: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const { dialogRef, onDialogHide } = useDialogPluginComponent()
const computedDate = ref({ ...props.date })
const filterParams = ref({ ...props.date })
const columns = ref([
  {
    field: 'date',
    fieldType: 'date',
  },
  {
    field: 'roomCount',
  },
])
</script>

<style scoped lang="scss"></style>
