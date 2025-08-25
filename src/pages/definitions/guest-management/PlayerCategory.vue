<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('visitorCategories') }}
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
          @click="openPlayerCategoryDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="playerCategoryColumns"
      :getDataFn="guestManagementStore.fetchPlayerCategories"
      :rowsPerPage="10"
      tableName="definitionVisitorCategories"
      :slotNames="['body-cell-actions']"
      ref="playerCategoryRefTable"
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
            @click="onEditPlayerCategory(props.row.id)"
            v-el-perms="'Addon.Definitions.PlayerCategory.Update'"
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
            @click="onDeletePlayerCategory(props.row)"
            v-el-perms="'Addon.Definitions.PlayerCategory.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog v-model="playerCategoryDialog" backdrop-filter="brightness(40%)">
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
          <q-form @submit="onSubmitPlayerCategoryForm" ref="form">
            <div class="col-12">
              <q-input
                :label="$t('visitorCategory')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="playerCategoryFormValues.name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="playerCategoryFormValues.name || $t('name') + '...'"
                clearable
                data-cy="playerCategoryName"
              />
            </div>
            <div class="col-12 q-pa-sm q-mt-sm text-left">
              <q-toggle
                v-model="playerCategoryFormValues.isActive"
                :label="
                  playerCategoryFormValues.isActive
                    ? $t('isActive') + '-' + $t('yes')
                    : $t('isActive') + '-' + $t('no')
                "
                color="positive"
                dense
                class="q-mt-sm"
                data-cy="isActive"
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
                :label="playerCategoryFormValues.id ? $t('update') : $t('save')"
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
  playerCategoryFormValues,
  playerCategoryDialog,
  playerCategoryColumns,
  playerCategoryRefTable,
  openPlayerCategoryDialog,
  onSubmitPlayerCategoryForm,
  onEditPlayerCategory,
  onDeletePlayerCategory,
  guestManagementStore,
} = useGuestManagement()
</script>
