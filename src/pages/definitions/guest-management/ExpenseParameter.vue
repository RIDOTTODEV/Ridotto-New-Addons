<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('expenseParameters') }}
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
          @click="openExpenseParameterDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="expenseParameterColumns"
      :getDataFn="guestManagementStore.fetchExpenseParameters"
      :rowsPerPage="10"
      tableName="definitionExpenseParameters"
      :slotNames="['body-cell-actions']"
      ref="expenseParameterRefTable"
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
            @click="onEditExpenseParameter(props.row.id)"
            v-el-perms="'Addon.Definitions.ExpenseParameter.Update'"
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
            @click="onDeleteExpenseParameter(props.row)"
            v-el-perms="'Addon.Definitions.ExpenseParameter.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog v-model="expenseParameterDialog" backdrop-filter="brightness(40%)">
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
          <q-form @submit="onSubmitExpenseParameterForm" ref="form">
            <div class="col-12">
              <q-input
                :label="$t('expenseParameter')"
                autofocus
                outlined
                dense
                v-model="expenseParameterFormValues.name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="expenseParameterFormValues.name || $t('name') + '...'"
                clearable
                data-cy="expenseParameterName"
              />
            </div>

            <div class="col-12 q-mt-md">
              <q-input
                v-model="expenseParameterFormValues.amount"
                :label="$t('price')"
                :rules="[(val) => !!val || $t('requiredField')]"
                outlined
                dense
                class="super-small"
              />
            </div>

            <div class="col-12 q-mt-md">
              <q-toggle
                v-model="expenseParameterFormValues.dailyBasedQuantity"
                :label="
                  expenseParameterFormValues.dailyBasedQuantity
                    ? $t('isActive') + '-' + $t('yes')
                    : $t('isActive') + '-' + $t('no')
                "
                color="positive"
                dense
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
                :label="expenseParameterFormValues.id ? $t('update') : $t('save')"
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
import { useGuestManagement } from 'src/composables/definitions/useGuestManagement'

const {
  expenseParameterFormValues,
  expenseParameterDialog,
  expenseParameterColumns,
  expenseParameterRefTable,
  openExpenseParameterDialog,
  onSubmitExpenseParameterForm,
  onEditExpenseParameter,
  onDeleteExpenseParameter,
  guestManagementStore,
} = useGuestManagement()
</script>
