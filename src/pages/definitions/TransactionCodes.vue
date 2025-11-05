<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('transactionCodes') }}
        </div>
        <q-btn
          unelevated
          dense
          color="blue-grey-8"
          text-color="white"
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
      :getDataFn="transactionCodeStore.fetchTransactionCodes"
      :rowsPerPage="10"
      tableName="definitionTransactionCodes"
      :slotNames="['body-cell-actions']"
      ref="transactionCodeRefTable"
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
            v-el-perms="'Addon.Definitions.TransactionCode.Update'"
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
            v-el-perms="'Addon.Definitions.TransactionCode.Delete'"
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
          <q-form @submit="onSubmitForm" ref="form" class="row">
            <div class="col-12">
              <q-input
                :label="$t('transactionCode')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="formValues.name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="formValues.name || $t('transactionCode') + '...'"
                clearable
                data-cy="name"
              />
            </div>
            <div class="col-6 q-mt-md">
              <q-select
                :label="$t('transactionGroupType')"
                v-model="formValues.transactionCodeGroupTypes"
                :options="transactionCodeGroupTypes"
                option-value="value"
                option-label="label"
                dense
                outlined
                multiple
                use-chips
                map-options
                emit-value
                class="super-small q-pa-xs"
                data-cy="groupTypes"
                behavior="menu"
              />
            </div>
            <div class="col-6 q-mt-md">
              <q-select
                :label="$t('transType')"
                v-model="formValues.transType"
                :options="transTypes"
                option-value="value"
                option-label="label"
                dense
                outlined
                map-options
                emit-value
                class="super-small q-pa-xs"
                data-cy="transType"
                behavior="menu"
              />
            </div>
            <div class="col-4 q-mt-md">
              <q-checkbox
                v-model="formValues.isDaily"
                color="primary"
                :label="$t('Daily')"
                data-cy="isDaily"
              />
            </div>
            <div class="col-4 q-mt-md">
              <q-checkbox
                v-model="formValues.gamingExpenses"
                color="primary"
                :label="$t('gamingExpenses')"
                data-cy="isDaily"
              />
            </div>
            <div class="col-4 q-mt-md">
              <q-checkbox
                v-model="formValues.toBeCollected"
                color="primary"
                :label="$t('toBeCollected')"
                data-cy="isDaily"
              />
            </div>
            <div class="col-4 q-mt-md">
              <q-checkbox
                v-model="formValues.authorizeByRequired"
                color="primary"
                :label="$t('authorizeByRequired')"
                data-cy="authorizeByRequired"
              />
            </div>
            <div class="col-4 q-mt-md">
              <q-checkbox
                v-model="formValues.dueDateRequired"
                color="primary"
                :label="$t('dueDateRequired')"
                data-cy="dueDateRequired"
              />
            </div>
            <div class="col-4 q-mt-md">
              <q-checkbox
                v-model="formValues.defaultIsInOut"
                color="primary"
                :label="$t('playerDefaultIsInOut')"
                data-cy="defaultIsInOut"
              />
            </div>
            <div class="col-6 q-mt-md">
              <q-checkbox
                v-model="formValues.defaultIncludeInBalance"
                color="primary"
                :label="$t('defaultIncludeInBalance')"
                data-cy="defaultIsInOut"
                @update:model-value="(val) => (formValues.defaultIncludeInBalance = val)"
              />
            </div>
            <div class="col-6 q-mt-md" v-if="formValues.defaultIncludeInBalance">
              <q-checkbox
                v-model="formValues.includeCashlessAndChipScope"
                color="primary"
                :label="$t('includeCashlessAndChipScope')"
                data-cy="defaultIsInOut"
              />
            </div>
            <div class="col-12 q-mt-md">
              <div class="text-subtitle2">
                {{ $t('transactionCodeType') }}
              </div>
              <q-option-group
                v-model="formValues.transactionCodeType"
                :options="transactionCodeTypes"
                color="primary"
                inline
                data-cy="transactionCodeType"
              />
            </div>
            <div class="col-12 q-mt-md text-right">
              <q-btn
                unelevated
                icon="save"
                color="blue-grey-8"
                text-color="white"
                size="13px"
                :label="formValues.id ? $t('update') : $t('save')"
                class="col-12"
                type="submit"
                data-cy="submit"
                no-caps
                no-wrap
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import SupaTable from 'src/components/atoms/SupaTable.vue'
import { useTransactionCode } from 'src/composables/definitions/useTransactionCode'
const {
  columns,
  transactionCodeStore,
  dialog,
  formValues,
  openDialog,
  onSubmitForm,
  editForm,
  deleteForm,
  transactionCodeTypes,
  transTypes,
  transactionCodeGroupTypes,
  transactionCodeRefTable,
} = useTransactionCode()
</script>
