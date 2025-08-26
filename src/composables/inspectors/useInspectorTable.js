import { useInspectorStore } from 'stores/inspector-store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useAuthStore } from 'src/stores/auth-store'
import { LocalStorage } from 'quasar'

export function useInspectorTable() {
  const tablesColumn = ref([
    {
      name: 'id',
      align: 'center',
      label: 'id',
      field: 'id',
      sortable: true,
      visible: true,
    },
    {
      name: 'name',
      align: 'center',
      label: 'name',
      field: 'name',
      sortable: true,
      visible: true,
    },
  ])

  const inspectorStore = useInspectorStore()

  const { inspectorTables, tables } = storeToRefs(inspectorStore)

  const authStore = useAuthStore()
  const { defaultCurrency } = storeToRefs(authStore)

  const filterTable = ref('')

  const onClickTable = async (table) => {
    const tableExist = inspectorTables.value.find((t) => t.id === table.id)
    if (!tableExist) {
      table.showNotify = true
      const result = await inspectorStore.inspectorFollowTable(table.id)
      if (result) {
        inspectorTables.value.push(table)
        setTimeout(() => {
          delete table.showNotify
        }, 2000)
      }
    } else {
      const result = await inspectorStore.inspectorUnfollowTable(table.id)
      if (result) {
        const index = inspectorTables.value.findIndex((t) => t.id === table.id)
        inspectorTables.value.splice(index, 1)
      }
    }
    LocalStorage.set('inspectorTables', [...inspectorTables.value])
    LocalStorage.set('currentTable', table)
  }

  const checkTableIsSelected = (tableId) => {
    return inspectorTables.value.find((t) => t.id === tableId)
  }

  return {
    tablesColumn,
    tables,
    filterTable,
    inspectorTables,
    defaultCurrency,
    onClickTable,
    checkTableIsSelected,
  }
}
