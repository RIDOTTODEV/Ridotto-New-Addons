<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card square style="min-width: 1000px">
      <q-card-section class="app-cart-grey q-pa-xs row flex justify-between">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('actions') }} <span class="text-negative">*</span>
        </div>
        <q-separator />
        <q-btn
          no-caps
          color="negative"
          unelevated
          :label="$t('cancel')"
          icon="far fa-times-circle"
          @click="onDialogCancel"
        />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="row">
          <q-tabs
            v-model="currentTab"
            align="left"
            active-color="grey-10"
            active-bg-color="grey-2"
            inline-label
            outside-arrows
            no-caps
            narrow-indicator
            data-cy="cashDeskTabs"
          >
            <q-tab v-for="(tab, index) in tabs" :key="index" no-caps :name="tab.name">
              <template v-slot:default>
                <div class="row flex content-center items-center">
                  <q-img :src="tab.icon" width="25px" class="q-mr-xs" />
                  <div class="text-subtitle2 text-bold">{{ $t(tab.label) }}</div>
                </div>
              </template>
            </q-tab>
          </q-tabs>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const currentTab = ref('chipIn')
const tabs = ref([
  {
    name: 'chipIn',
    label: 'chipIn',
    icon: 'inspectors/icons8-plus-48.png',
  },
  {
    name: 'chipOut',
    label: 'chipOut',
    icon: 'inspectors/icons8-remove-40.png',
  },
  {
    name: 'cashIn',
    label: 'cashIn',
    icon: 'inspectors/icons8-cash-64.png',
  },
])
</script>
