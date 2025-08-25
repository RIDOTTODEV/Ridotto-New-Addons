<template>
  <div>
    <DataTable
      v-model:filters="filters"
      :value="tableData"
      paginator
      :reorderableColumns="true"
      @columnReorder="onColReorder"
      tableStyle="min-width: 50rem"
      size="small"
      showGridlines
      stripedRows
      :rows="tablePagination.rows"
      :totalRecords="tablePagination.totalCount"
      :first="tablePagination.page"
      :rowsPerPageOptions="[10, 20, 50, 100]"
      resizableColumns
      columnResizeMode="fit"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      filterDisplay="menu"
      :globalFilterFields="globalFilterFields"
      filterLocale="TR"
      :loading="loading"
      :dataKey="dataKey"
      scrollable
    >
      <template #header>
        <div class="row full-width">
          <div class="col-6">
            <p>Manage Products</p>
          </div>
          <div class="col-6 flex flex-wrap gap-2 items-center">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
            <MultiSelect
              :modelValue="selectedColumns"
              :options="tableColumns"
              optionLabel="header"
              @update:modelValue="onToggle"
              display="chip"
              filter
              placeholder="Columns"
              :maxSelectedLabels="0"
              selectedItemsLabel
            >
              <!-- <template #value="slotProps">
                <div class="flex flex-wrap gap-2">
                  <div v-for="col of slotProps.value" :key="col.field">
                    <p class="text-sm">{{ col.header }}</p>
                  </div>
                </div>
              </template> -->
              <template #filtericon>
                <q-icon name="search" />
              </template>
            </MultiSelect>
          </div>
        </div>
      </template>
      <Column
        v-for="col of tableColumns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
        :sortable="col.sortable"
        :sortField="col.sortField"
        :filterField="col.filterField"
        :frozen="col.frozen"
        :alignFrozen="col.alignFrozen"
      >
        <template #body="slotProps">
          {{ col.format(slotProps.data[col.field], col.fieldType) }}
        </template>
        <template #filter="{ filterModel }" v-if="col.filterField">
          <InputText v-model="filterModel.value" type="text" :placeholder="col.placeholder" />
        </template>
      </Column>
      <template #empty> No data found. </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { generateColumns } from '../../helpers/table'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

const props = defineProps({
  columns: {
    type: Array,
    required: false,
    default: () => [],
  },
  getData: {
    type: Function,
    required: true,
  },
  params: {
    type: Object,
    required: false,
    default: () => {},
  },
  responseDataKey: {
    type: String,
    required: false,
    default: () => 'data',
  },
  globalFilterFields: {
    type: Array,
    required: false,
    default: () => ['name', 'id'],
  },
  dataKey: {
    type: String,
    required: false,
    default: () => 'id',
  },
})
const loading = ref(false)
onMounted(async () => {
  await initializeColumns()
  await initializeData()
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
})

const tableColumns = ref([])
const tableData = ref([])
const tablePagination = ref({
  rows: 10,
  totalCount: 0,
  page: 0,
})
const onColReorder = () => {
  //toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 })
}

const initializeColumns = async () => {
  tableColumns.value = generateColumns(props.columns)
}

const initializeData = async () => {
  loading.value = true
  const { [props.responseDataKey]: data, ...rest } = await props.getData(props.params)
  tableData.value = data
  setPagination(rest)
  loading.value = false
}
const setPagination = (pagination) => {
  tablePagination.value.totalCount = pagination.totalCount
}

const selectedColumns = ref()
const onToggle = (val) => {
  selectedColumns.value = tableColumns.value.filter((col) => val.includes(col))
}
</script>

<style scoped>
.frozen-column-bg {
  background-color: #717171 !important;
}
</style>
