<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('gifts') }}
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
          @click="openGiftDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="giftColumns"
      :getDataFn="guestManagementStore.fetchGifts"
      :rowsPerPage="10"
      tableName="definitionGifts"
      :slotNames="['body-cell-actions']"
      ref="giftRefTable"
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
            @click="onEditGift(props.row.id)"
            v-el-perms="'Addon.Definitions.Gift.Update'"
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
            @click="onDeleteGift(props.row)"
            v-el-perms="'Addon.Definitions.Gift.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog v-model="giftDialog" backdrop-filter="brightness(40%)">
      <q-card class="sm:minWithDialog w-full">
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
          <q-form @submit="onSubmitGiftForm" ref="form">
            <div class="col-md-12 col-xs-12">
              <q-input
                :label="$t('gift.name')"
                autofocus
                hide-bottom-space
                outlined
                dense
                v-model="giftFormValues.name"
                class="col-12 super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="giftFormValues.name || $t('name') + '...'"
                clearable
                data-cy="giftName"
              />
            </div>
            <div class="col-md-12 col-xs-12 q-mt-md text-right">
              <q-btn
                no-wrap
                no-caps
                unelevated
                icon="save"
                color="blue-grey-8"
                text-color="white"
                size="13px"
                :label="giftFormValues.id ? $t('update') : $t('save')"
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
  giftFormValues,
  giftDialog,
  openGiftDialog,
  onSubmitGiftForm,
  onEditGift,
  onDeleteGift,
  giftColumns,
  guestManagementStore,
  giftRefTable,
} = useGuestManagement()
</script>
