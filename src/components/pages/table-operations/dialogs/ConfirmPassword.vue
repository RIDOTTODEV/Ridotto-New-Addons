<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    square
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 400px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('confirmPassword') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-sm flex justify-center">
        <q-form @submit="onSubmit" class="row" v-if="!isSuccess">
          <div class="col-12">
            <q-input
              outlined
              dense
              class="super-input"
              v-model="values.cashierPassword"
              :label="$t('cashierPassword')"
              :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'o_visibility' : 'o_visibility_off'"
                  @click="isPwd = !isPwd"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              outlined
              dense
              class="super-input"
              v-model="values.pitbossPassword"
              :label="$t('pitbossPassword')"
              :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
              :type="isPitbossPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPitbossPwd ? 'o_visibility' : 'o_visibility_off'"
                  @click="isPitbossPwd = !isPitbossPwd"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>

          <q-btn
            type="submit"
            :label="$t('submit')"
            class="col-12"
            color="blue-grey-8"
            icon="save"
            no-caps
            unelevated
            dense
            size="16px"
          />
        </q-form>
        <div class="flex justify-center" v-if="isSuccess">
          <SuccessNotify />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useTableStore } from 'src/stores/table-store'
import SuccessNotify from 'src/components/ui/SuccessNotify.vue'
import { useDialogPluginComponent, Notify } from 'quasar'
import { ref } from 'vue'

const tableStore = useTableStore()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const values = ref({
  cashierPassword: '12345',
  pitbossPassword: '54321',
})
const isPwd = ref(true)
const isPitbossPwd = ref(true)

const isSuccess = ref(false)
const onSubmit = async () => {
  const result = await tableStore.tableCountEditCheck(values.value)
  if (result.data === true) {
    isSuccess.value = true
    setTimeout(() => {
      isSuccess.value = false
      onDialogOK(true)
    }, 2000)
  } else {
    Notify.create({
      message: 'Password is incorrect',
      color: 'negative',
      position: 'top-right',
    })
  }
}
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
