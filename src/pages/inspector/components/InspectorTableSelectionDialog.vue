<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
    class="historyModal"
    backdrop-filter="brightness(40%)"
  >
    <q-card class="" square :style="{ height: $getWindowHeight + 'px' }">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('confirm') }} <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-card square flat class="bg-transparent">
          <q-card-section>
            <q-table
              grid
              flat
              :rows="tables"
              :columns="tablesColumn"
              row-key="name"
              :filter="filterTable"
              hide-header
              :rows-per-page-options="[0]"
              hide-bottom
              class="customTable"
            >
              <template v-slot:top>
                <div class="row full-width">
                  <div class="col-6 flex content-center items-center">
                    <div class="text-h6 text-bold">
                      {{ $t('tables') }}
                    </div>
                  </div>
                  <div class="col-6 flex justify-end">
                    <q-input
                      outlined
                      bg-color="app-cart-grey"
                      square
                      dense
                      debounce="300"
                      v-model="filterTable"
                      :placeholder="$t('search')"
                      style="min-width: 300px"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <q-btn outline text-color="grey-8" class="bg-white q-ml-md" no-caps>
                      <template v-slot:default>
                        <div class="row flex justify-center content-center items-center">
                          <q-icon name="fas fa-sync-alt" color="positive" />
                          <div class="text-bold text-h6 q-ml-md">
                            {{ $t('refresh') }}
                          </div>
                        </div>
                      </template>
                    </q-btn>
                  </div>
                </div>
              </template>
              <template v-slot:item="props">
                <div class=" ">
                  <q-btn
                    text-color="grey-5"
                    class="app-cart full-height q-ma-sm"
                    @click="onClickTable(props.row)"
                    style="width: 170px !important; height: 140px !important"
                    push
                  >
                    <template v-slot:default>
                      <div class="row text-blue-grey-8">
                        <div
                          class="row"
                          v-if="props.row?.showNotify && props.row.showNotify === true"
                        >
                          <success-notify />
                        </div>
                        <div class="row col-12" v-else>
                          <div class="col-12">
                            <q-icon
                              :name="checkTableIsSelected(props.row.id) ? 'task_alt' : 'o_lens'"
                              size="2em"
                              :color="checkTableIsSelected(props.row.id) ? 'positive' : 'grey'"
                            />
                          </div>
                          <div class="col-12 flex justify-center">
                            <div class="text-subtitle2 text-bold">
                              {{ props.row.name }}
                            </div>
                            <!--  <div class="text-subtitle2 text-bold q-ml-sm">
                              {{ defaultCurrency?.name }}
                            </div> -->
                          </div>
                          <div class="col-12 flex justify-center">
                            <div class="text-subtitle2 text-bold q-ml-sm text-negative">
                              {{ props.row.gameName }}
                            </div>
                          </div>
                          <div class="col-12">
                            <div class="text-subtitle2 text-bold">
                              {{ props.row?.floatSetName }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </q-btn>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
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
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useInspectorTable } from 'src/composables/inspectors/useInspectorTable'
import SuccessNotify from 'src/components/ui/SuccessNotify.vue'
import { i18n } from 'boot/i18n'

const {
  tables,
  tablesColumn,
  filterTable,
  /*  defaultCurrency, */
  inspectorTables,
  onClickTable,
  checkTableIsSelected,
} = useInspectorTable()

const $q = useQuasar()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function onOKClick() {
  if (inspectorTables.value.length === 0) {
    $q.notify({
      message: i18n.global.t('inspectorTableRequired'),
      type: 'warning',
      position: 'bottom-right',
      icon: 'fas fa-exclamation-triangle',
      timeout: 2000,
    })
    return false
  } else {
    onDialogOK(true)
  }
}
</script>
