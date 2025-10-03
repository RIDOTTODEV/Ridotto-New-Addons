<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    square
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 800px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          <q-icon name="o_group_codes" class="q-mr-sm" />
          {{ $t('edit') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-sm">
        <q-table
          :rows="groupCodes"
          :columns="columns"
          row-key="id"
          class="no-box-shadow col-12 q-pa-xs"
          :rows-per-page-options="[100]"
          hide-bottom
          dense
          separator="cell"
          bordered
          square
        >
          <template v-slot:top>
            <div class="full-width row">
              <div class="col-6">
                <div class="text-subtitle2">
                  {{ $t('groupCodes') }}
                </div>
              </div>
              <div class="col-6">
                <q-input
                  v-model="formValues.code"
                  :label="$t('code')"
                  dense
                  outlined
                  autofocus
                  hide-bottom-space
                  clearable
                  :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                  @clear="formValues.id = 0"
                >
                  <template v-slot:append>
                    <q-btn
                      unelevated
                      dense
                      color="deep-purple"
                      icon="save"
                      :label="formValues.id ? $t('update') : $t('save')"
                      no-wrap
                      no-caps
                      @click="onSaveGroupCode"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td key="Action" align="center">
              <q-btn
                unelevated
                dense
                color="deep-purple"
                size="10px"
                icon="edit"
                class="q-mr-md"
                @click="editGroupCode(props.row)"
              />
              <q-btn
                unelevated
                dense
                color="negative"
                size="10px"
                icon="delete_forever"
                class="q-mr-sm"
                @click="removeGroupCode(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-isClosed="props">
            <q-td key="isClosed" align="center">
              <q-toggle
                v-model="props.row.isClosed"
                @update:model-value="onCloseGroupCode(props.row)"
                color="positive"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useOperationsStore } from 'src/stores/operations-store'
import { i18n } from 'src/boot/i18n'

const groupCodes = ref([])
const operationsStore = useOperationsStore()
const $q = useQuasar()
const formValues = ref({
  id: 0,
  code: null,
})

const columns = ref([
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'center',
  },
  {
    name: 'code',
    label: 'Code',
    field: 'code',
    align: 'center',
  },
  {
    name: 'isClosed',
    label: 'Closed',
    field: 'isClosed',
    align: 'center',
  },

  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
])

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

onMounted(async () => {
  await fetchGroupCodes()
  formValues.value.code = await operationsStore.getNewGroupCodeString()
})
const fetchGroupCodes = async () => {
  groupCodes.value = await operationsStore.fetchGroupCodes()
}
const editGroupCode = (props) => {
  console.log(props)
  formValues.value = {
    id: props.id,
    code: props.code,
  }
}

const removeGroupCode = async (props) => {
  $q.dialog({
    title: i18n.global.t('removeGroupCode'),
    message: i18n.global.t('areYouSureYouWantToRemoveThisGroupCode'),
    color: 'negative',
    ok: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('remove'),
      class: 'text-capitalize',
      dataCy: 'remove',
    },
    cancel: {
      flat: true,
      color: 'primary',
      label: i18n.global.t('cancel'),
      class: 'text-capitalize',
    },
  }).onOk(async () => {
    await operationsStore.deleteGroupCode({ groupCodeId: props.id })
    await fetchGroupCodes()
  })
}

const onSaveGroupCode = async () => {
  if (formValues.value.id === 0) {
    const response = await operationsStore.createGroupCode(formValues.value)
    if (response.status === 200) {
      $q.notify({
        type: 'positive',
        message: i18n.global.t('groupCodeCreated'),
      })
    } else {
      $q.notify({
        type: 'negative',
        message: i18n.global.t('groupCodeCreationFailed'),
      })
    }
  } else {
    const response = await operationsStore.updateGroupCode(formValues.value)
    if (response.status === 200) {
      $q.notify({
        type: 'positive',
        message: i18n.global.t('groupCodeUpdated'),
      })
    } else {
      $q.notify({
        type: 'negative',
        message: i18n.global.t('groupCodeUpdateFailed'),
      })
    }
  }
  await fetchGroupCodes()
  formValues.value = {
    id: 0,
    code: null,
  }
}

const onCloseGroupCode = async (props) => {
  $q.dialog({
    title: i18n.global.t('closeGroupCode'),
    message: i18n.global.t('areYouSureYouWantToCloseThisGroupCode'),
    color: 'positive',
    ok: {
      flat: true,
      color: 'positive',
      label: i18n.global.t('ok'),
      class: 'text-capitalize',
      dataCy: 'ok',
    },
    cancel: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('cancel'),
      class: 'text-capitalize',
    },
  })
    .onOk(async () => {
      await operationsStore.closeGroupCode({ id: props.id, isClosed: props.isClosed })
      await fetchGroupCodes()
    })
    .onCancel(async () => {
      props.isClosed = !props.isClosed
    })
}
</script>

<style scoped lang="scss">
// Add any additional styling if needed
</style>
