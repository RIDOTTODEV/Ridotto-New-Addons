<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-3">
            <fieldset class="fieldset">
              <legend class="text-subtitle2">{{ $t('Filters') }}</legend>
              <div class="row flex flex-column q-gutter-y-md">
                <div class="col-12">
                  <q-select-box
                    :options="groupeCodes"
                    option-value="id"
                    option-label="code"
                    v-model="filterFields.groupCodeId"
                    :label="$t('Groupe Code')"
                    :slotNames="['after']"
                    bg-color="white"
                  >
                    <template v-slot:after="props">
                      <q-btn
                        icon="fas fa-edit"
                        v-bind="{ props }"
                        @click="manageGroupCode()"
                        dense
                        flat
                        size="12px"
                        color="primary"
                      />
                    </template>
                  </q-select-box>
                </div>
                <div class="col-12">
                  <q-select-box
                    :options="visitorCategories"
                    option-value="id"
                    option-label="name"
                    v-model="filterFields.playerCategoryId"
                    :label="$t('Player Category')"
                    bg-color="white"
                  >
                  </q-select-box>
                </div>
                <div class="col-12">
                  <q-btn
                    type="button"
                    :label="$t('filter')"
                    icon="tune"
                    color="grey-1"
                    text-color="dark"
                    size="13px"
                    unelevated
                    no-caps
                    @click="junketOperationRefTable.fetchData()"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div class="col-4">
            <fieldset class="fieldset row">
              <legend class="text-subtitle2">
                {{ $t('Player Photo') }}
              </legend>
              <div class="masonry-grid">
                <q-img
                  :src="$playerPhotoUrl + selectedRow.playerId"
                  class="player-photo"
                  fit="cover"
                  error-src="/assets/no-photo.png"
                  v-if="selectedRow"
                />
              </div>
            </fieldset>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <SupaTable
          :columns="columns"
          :getDataFn="operationsStore.fetchJunketOperation"
          :filterParams="filterFields"
          :slotNames="['body-cell-actions']"
          ref="junketOperationRefTable"
          tableName="junketOperationColumns"
        >
          <template v-slot:body-cell-action="{ props }">
            <q-td key="Action" align="center">
              <q-btn
                icon="o_info"
                size="12px"
                color="grey-2"
                text-color="dark"
                no-caps
                unelevated
                flat
              >
                <q-tooltip class="q-card bg-white">
                  <q-markup-table spellcheck="cell" dense square bordered>
                    <thead>
                      <tr>
                        <th class="text-center bg-grey-2">Expense</th>
                        <th class="text-center bg-grey-2">Amount</th>
                        <th class="text-center bg-grey-2">Is Deleted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="expense in props.row.expenses" :key="expense.id">
                        <td class="text-center">{{ expense.expenseTypeName }}</td>
                        <td class="text-center">
                          {{ formatPrice(expense.amountInCasinoCurrency) }}
                        </td>
                        <td class="text-center">{{ expense.isDeleted ? 'Yes' : 'No' }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useOperationsStore } from 'src/stores/operations-store'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
const operationsStore = useOperationsStore()
const guestManagementStore = useGuestManagementStore()
const { visitorCategories } = storeToRefs(guestManagementStore)
const $q = useQuasar()
const groupeCodes = ref([])

const filterFields = ref({
  groupCodeId: null,
  playerCategoryId: null,
})

const manageGroupCode = () => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('components/pages/guest-operations/JunketGroupCodesDialog.vue'),
    ),
    componentProps: {
      actionFn: manageGroupCode,
    },
  })
    .onOk(async () => {
      await fetchGroupCodes()
    })
    .onCancel(async () => {
      await fetchGroupCodes()
    })
}

onMounted(async () => {
  await fetchGroupCodes()
  await guestManagementStore.fetchVisitorCategories()
})
const fetchGroupCodes = async () => {
  groupeCodes.value = await operationsStore.fetchGroupCodes()
}
const junketOperationRefTable = ref(null)

const columns = ref([
  {
    label: 'Calculation Time',
    field: 'calculationTime',
    fieldType: 'date',
  },
  {
    label: 'Status',
    field: 'status',
  },

  {
    label: 'Player Full Name',
    field: 'playerFullName',
  },

  {
    label: 'Currency Name',
    field: 'currencyName',
  },
  {
    label: 'Total Result',
    field: 'totalResult',
    fieldType: 'price',
  },
  {
    label: 'Comp',
    field: 'comp',
    fieldType: 'price',
  },
  {
    label: 'Discount',
    field: 'discount',
    fieldType: 'price',
  },
  {
    label: 'Expense',
    field: 'expense',
    fieldType: 'price',
  },
  {
    label: 'CC Fee',
    field: 'ccFee',
    fieldType: 'price',
  },
  {
    label: 'Net Result',
    field: 'netResult',
    fieldType: 'price',
  },
  {
    label: 'Commission Percent',
    field: 'commissionPercent',
    fieldType: 'price',
  },
  {
    label: 'Commission Amount',
    field: 'commissionAmount',
  },
  {
    label: 'Actions',
    field: 'actions',
  },
])

const selectedRow = ref(null)
watch(
  () => junketOperationRefTable.value?.selectedRow,
  (value) => {
    selectedRow.value = value
  },
  { deep: true, immediate: true },
)
</script>

<style scoped lang="scss">
fieldset {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px !important;
  margin-bottom: 10px !important;
}

.fieldset {
  border: 1px solid #4b4f52 !important;
  border-radius: 5px;
  height: 190px;
}
</style>
