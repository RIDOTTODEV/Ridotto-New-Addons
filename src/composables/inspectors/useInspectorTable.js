import { useInspectorStore } from 'stores/inspector-store'
import { storeToRefs } from 'pinia'
import { ref, inject } from 'vue'

import { useAuthStore } from 'src/stores/auth-store'
import { LocalStorage } from 'quasar'

export function useInspectorTable() {
  const inspectorHubConnection = inject('inspectorHubConnection')
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
      await inspectorHubConnection.invoke('InspectTable', table.id)
      table.showNotify = true
      setTimeout(() => {
        delete table.showNotify
      }, 2000)
    } else {
      await inspectorHubConnection.invoke('UninspectTable', table.id)
    }
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
