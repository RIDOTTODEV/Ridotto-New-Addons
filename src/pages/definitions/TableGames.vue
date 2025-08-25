<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('tableGames') }}
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
      :columns="tableGameColumns"
      :getDataFn="tableStore.fetchTableGames"
      :rowsPerPage="10"
      tableName="definitionTableGames"
      :slotNames="['body-cell-actions']"
      ref="refTable"
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
            @click="editTableGame(props.row)"
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
            @click="deleteTableGame(props.row)"
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
          <q-form @submit="onSubmitTableGameForm" ref="form" class="row">
            <div class="col-12">
              <q-input
                :label="$t('name')"
                autofocus
                outlined
                dense
                v-model="gameFormValues.name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                clearable
              />
            </div>

            <div class="col-12">
              <q-input
                :label="$t('timePerHand')"
                v-model="gameFormValues.timePerHand"
                class="col-12 super-small"
                outlined
                dense
                :rules="[(val) => (val && val.toString().length > 0) || $t('base.requiredField')]"
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                :label="$t('houseEdge')"
                v-model="gameFormValues.houseEdge"
                class="col-12 super-small"
                outlined
                dense
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                clearable
              />
            </div>
            <div class="col-12 text-right">
              <q-btn
                no-wrap
                no-caps
                unelevated
                icon="save"
                color="deep-purple"
                size="13px"
                :label="gameFormValues.id ? $t('update') : $t('save')"
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
import { useTables } from 'src/composables/definitions/useTable'
const {
  tableStore,
  tableGameColumns,
  dialog,
  gameFormValues,
  openDialog,
  onSubmitTableGameForm,
  editTableGame,
  deleteTableGame,
  refTable,
} = useTables()
</script>
