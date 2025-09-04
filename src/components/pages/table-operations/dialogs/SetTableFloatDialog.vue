<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    square
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
  >
    <q-card style="min-width: 800px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('edit') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-sm flex justify-center">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="blue-grey-8"
          animated
          style="width: 1100px"
          class="no-box-shadow"
          header-class="app-cart-grey q-pa-xs"
          header-nav
          bordered
        >
          <q-step
            dense
            v-for="(floatSet, index) in floatSets"
            :key="index"
            :name="index + 1"
            :title="floatSet.tableName"
            :icon="index + 1 !== step ? 'o_fiber_manual_record' : 'o_check_circle'"
          >
            <div class="row q-mt-md">
              <div class="col-6 text-center">
                <div class="row flex justify-center">
                  <q-markup-table
                    separator="cell"
                    class="row"
                    flat
                    square
                    bordered
                    dense
                    style="width: 400px"
                  >
                    <thead>
                      <tr>
                        <th class="grey-card text-center">Denom</th>
                        <th class="grey-card text-center">Desired</th>
                      </tr>
                    </thead>
                    <tbody class="denom-body">
                      <tr
                        v-for="(denom, denomIndex) in floatSet?.expectedTableFloatOutputs"
                        :key="denomIndex"
                      >
                        <td class="text-center text-center">
                          {{ denom.chipDenom }}
                        </td>
                        <td class="text-left">
                          <div class="flex flex-center">
                            <div class="flex justify-start content-center items-center">
                              <div
                                class="text-subtitle2 flex justify-center content-center items-center"
                              >
                                {{ denom?.currentQuantity }}
                                <q-icon
                                  name="east"
                                  size="20px"
                                  class="q-ml-md q-mr-md text-grey-6"
                                />
                                {{ denom?.actualQuantity }}
                              </div>

                              <div
                                class="text-subtitle2 q-ml-md flex justify-center content-center items-center"
                                :class="{
                                  'text-red-8': denom?.currentQuantity < denom?.actualQuantity,
                                  'text-green-8': denom?.currentQuantity > denom?.actualQuantity,

                                  'text-grey-6': denom?.currentQuantity === denom?.actualQuantity,
                                }"
                              >
                                <q-icon
                                  v-show="denom?.currentQuantity != denom?.actualQuantity"
                                  :name="
                                    denom?.currentQuantity > denom?.actualQuantity
                                      ? 'add'
                                      : 'remove'
                                  "
                                  size="20px"
                                />
                                <span>{{
                                  Math.abs(denom?.currentQuantity - denom?.actualQuantity)
                                }}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
              <div class="col-6 q-pb-md">
                <q-form @submit="onSubmit" ref="form" class="row">
                  <div class="col-12 q-pa-xs">
                    <q-select-box
                      v-model="values.transactionCodeId"
                      :options="getTransactionCodesByGroups([])"
                      :label="$t('transactionCode')"
                      hide-bottom-space
                      option-value="id"
                      option-label="name"
                    />
                  </div>
                  <div class="col-12 q-pa-xs">
                    <q-input
                      v-model="values.note"
                      type="textarea"
                      class=" "
                      dense
                      outlined
                      :rows="4"
                      :label="$t('note')"
                    />
                  </div>
                  <div class="col-12 q-mt-md text-right">
                    <q-btn
                      unelevated
                      icon="save"
                      color="blue-grey-8"
                      size="md"
                      :label="$t('save')"
                      class="col-12"
                      type="submit"
                    />
                  </div>
                </q-form>
              </div>
            </div>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useTableStore } from 'src/stores/table-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useDialogPluginComponent } from 'quasar'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
const props = defineProps({
  formValues: {
    type: Object,
    required: true,
  },
})
const tableStore = useTableStore()
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const values = ref({
  ...props.formValues,
})
const onSubmit = async () => {
  const tableId = floatSets.value[step.value - 1].tableId
  let payload = {
    tableIds: [tableId],
    transactionCodeId: values.value.transactionCodeId,
    note: values.value.note,
    cashdeskId: props.formValues.cashdeskId,
  }
  const result = await tableStore.setTableFloat(payload)
  if (result.status === 200) {
    values.value = {
      //transactionCodeId: null,
      note: '',
      cashdeskId: props.formValues.cashdeskId,
    }
    floatSets.value = floatSets.value.filter((floatSet) => floatSet.tableId !== tableId)
    Notify.create({
      message: 'Table float set successfully',
      type: 'positive',
      icon: 'o_check_circle',
      position: 'bottom-right',
    })
    if (floatSets.value.length > 0) {
      if (step.value === floatSets.value.length) {
        stepper.value.previous()
      } else {
        step.value = 1
      }
    } else {
      onDialogOK()
    }
  }
}

const step = ref(1)
const stepper = ref(null)

const floatSets = ref([])

const getExpectedTableFloat = async () => {
  const result = await tableStore.getExpectedTableFloat({
    tableIds: [...props.formValues.tableIds],
  })

  floatSets.value = result
}

onMounted(async () => {
  await getExpectedTableFloat()
  const response = await tableStore.getTableCountFormStableSettings()
  values.value.transactionCodeId = response.data?.value
    ? JSON.parse(response.data.value).transactionCodeId
    : null
})
</script>

<style lang="scss">
.q-stepper__step-inner {
  padding: 0px !important;
}

.border-left {
  border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-dashed {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.12) !important;
}

.t-card {
  height: 30px !important;
}

.q-stepper__header--contracted .q-stepper__tab {
  padding: 12px 0px !important;
}
.q-stepper__header--standard-labels .q-stepper__tab {
  min-height: 45px !important;
}
.q-stepper__header--contracted {
  min-height: 45px !important;
}

.q-stepper__header--border {
  border-bottom: none !important;
}

.myInput {
  .q-field__native {
    padding: 0 !important;
    height: 30px !important;
    font-size: 14px;
    text-align: right;
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  }
}
</style>
