<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('cashdesks') }}
        </div>
        <q-btn
          unelevated
          dense
          color="grey-2"
          text-color="dark"
          no-caps
          size="13px"
          icon="add"
          :label="$t('create')"
          @click="openDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="columns"
      :getDataFn="cashdeskStore.fetchCashdesks"
      :rowsPerPage="10"
      tableName="definitionCashdesks"
      :slotNames="['body-cell-actions']"
    >
      <template v-slot:body-cell-actions="{ props }">
        <q-td key="Action" align="center">
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="12px"
            icon="fa-regular fa-pen-to-square"
            class="q-mr-md"
            @click="editForm(props.row)"
            v-el-perms="'Addon.Definitions.Cashdesk.Update'"
            data-cy="editData"
          />
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="negative"
            size="12px"
            icon="fa-regular fa-trash-can"
            class="q-mr-sm"
            @click="deleteForm(props.row)"
            v-el-perms="'Addon.Definitions.Cashdesk.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>
    <q-dialog v-model="dialog" backdrop-filter="brightness(40%)">
      <q-card class="minWithDialog">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('edit') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form @submit="onSubmitForm" ref="form">
            <div class="col-12">
              <q-input
                :label="$t('cashdeskName')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="formValues.name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('base.requiredField')]"
                clearable
                data-cy="cashdeskName"
              />
            </div>

            <div class="col-12 q-pa-sm q-mt-sm text-left">
              <q-toggle
                v-model="formValues.isChipAccepted"
                :label="
                  formValues.isChipAccepted
                    ? $t('isChipAccepted') + '-' + $t('yes')
                    : $t('isChipAccepted') + '-' + $t('no')
                "
                color="positive"
                dense
                class="q-mt-sm"
                data-cy="infinite"
              />
            </div>
            <div class="col-12 q-mt-md text-right">
              <q-btn
                no-wrap
                no-caps
                unelevated
                icon="save"
                color="deep-purple"
                size="13px"
                :label="formValues.id ? $t('update') : $t('save')"
                class="col-12"
                type="submit"
                data-cy="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useCashdesk } from 'src/composables/definitions/useCashdesk'
const {
  columns,
  cashdeskStore,
  dialog,
  formValues,
  openDialog,
  onSubmitForm,
  editForm,
  deleteForm,
} = useCashdesk()
</script>
