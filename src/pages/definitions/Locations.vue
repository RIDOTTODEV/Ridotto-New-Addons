<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('locations') }}
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
          @click="openLocationDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="locationsColumns"
      :getDataFn="definitionStore.fetchLocations"
      :rowsPerPage="10"
      tableName="definitionLocations"
      :slotNames="['body-cell-actions']"
      ref="locationRefTable"
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
            @click="onEditLocation(props.row.id)"
            v-el-perms="'Addon.Definitions.Location.Update'"
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
            @click="onDeleteLocation(props.row)"
            v-el-perms="'Addon.Definitions.Location.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog v-model="locationDialog" backdrop-filter="brightness(40%)">
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
          <q-form @submit="onSubmitLocationForm" ref="form" class="row">
            <div class="col-6 q-pa-sm">
              <q-input
                :label="$t('location')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="locationFormValues.name"
                class="super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="locationFormValues.name || $t('name') + '...'"
                clearable
                data-cy="playerCategoryName"
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                :label="$t('phoneNumber')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="locationFormValues.phoneNumber"
                class="super-small"
                clearable
                type="number"
              />
            </div>

            <div class="col-12 text-right">
              <q-btn
                no-wrap
                no-caps
                unelevated
                icon="save"
                color="blue-grey-8"
                text-color="white"
                size="13px"
                :label="locationFormValues.id ? $t('update') : $t('save')"
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
import { useDefinition } from 'src/composables/definitions/useDefinition'
const {
  locationsColumns,
  locationDialog,
  locationFormValues,
  locationRefTable,
  openLocationDialog,
  onSubmitLocationForm,
  onEditLocation,
  onDeleteLocation,
  definitionStore,
} = useDefinition()
</script>
