<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-md-8 col-sm-12 col-xs-12">
            <div class="text-h6">
              {{ $t('playerGifts') }}
            </div>
          </div>
          <div class="col-md-4 col-sm-12 col-xs-12 text-right flex content-center justify-end">
            <q-btn
              :label="$t('create')"
              class="q-mr-sm"
              color="grey-2"
              text-color="dark"
              unelevated
              no-caps
              @click="openCreateModal()"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="no-box-shadow">
      <q-card-section class="q-pa-none">
        <SupaTable
          ref="playerGiftsTable"
          tableName="playerGifts"
          :getDataFn="operationsStore.getPlayerGifts"
          :filterParams="giftListFilterParams"
          :slotNames="['body-cell-actions']"
          :columns="columns"
        >
          <template v-slot:body-cell-actions="{ props }">
            <q-td key="actions" align="center">
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                no-caps
                size="12px"
                icon="fa-regular fa-pen-to-square"
                class="q-mr-md"
                @click="openCreateModal(props.row)"
              />
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="negative"
                size="12px"
                icon="fa-regular fa-trash-can"
                class="q-mr-sm"
                @click="remove(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:customFields="{ props }">
            <div class="col q-pl-sm q-mr-sm flex row justify-start">
              <div class="q-pa-xs flex items-end">
                <date-time-picker
                  @selected-date="
                    (val) =>
                      (giftListFilterParams = {
                        ...giftListFilterParams,
                        ...val,
                      })
                  "
                />
                <q-btn
                  type="button"
                  :label="$t('base.filter')"
                  icon="tune"
                  color="grey-2"
                  text-color="dark"
                  size="13px"
                  unelevated
                  no-caps
                  @click="props.reload"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useOperationsStore } from 'src/stores/operations-store'
const $q = useQuasar()

const operationsStore = useOperationsStore()

const playerGiftsTable = ref(null)
const giftListFilterParams = ref({})

const columns = ref([
  {
    field: 'playerId',
  },
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'giftName',
  },
  {
    field: 'isDeleted',
    fieldType: 'boolean',
  },
  {
    field: 'plannedDate',
    fieldType: 'date',
  },
  {
    field: 'givenDate',
    fieldType: 'date',
  },
  {
    field: 'actions',
  },
])

const onSubmitForm = async (payload) => {
  if (payload.id) {
    await operationsStore.updatePlayerGift(payload)
    playerGiftsTable.value.fetchData()
    return true
  }
  const res = await operationsStore.createPlayerGift(payload)
  playerGiftsTable.value.fetchData()
  return res
}
const onClickRemove = async (props) => {
  await operationsStore.deletePlayerGift(props.id)
  playerGiftsTable.value.fetchData()
}

const openCreateModal = (initialValues = {}) => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('../../components/pages/operations/PlayerGiftCreateModal.vue'),
    ),
    componentProps: {
      initialValues,
    },
  }).onOk(async (payload) => {
    const success = await onSubmitForm(payload)
    if (success) {
      playerGiftsTable.value.fetchData()
    }
  })
}

const remove = async (row) => {
  const success = await onClickRemove(row)
  if (success) {
    playerGiftsTable.value.fetchData()
  }
}

onMounted(() => {
  operationsStore.fetchGiftList()
})
</script>

<style scoped lang="scss">
/* Add any specific styles for this page here */
</style>
