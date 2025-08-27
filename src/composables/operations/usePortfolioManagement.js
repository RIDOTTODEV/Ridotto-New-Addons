import { useOperationsStore } from 'src/stores/operations-store'
import { ref, inject, defineAsyncComponent } from 'vue'
import { date, useQuasar } from 'quasar'
import { i18n } from 'boot/i18n'
import { api } from 'boot/axios'
export const usePortfolioManagement = () => {
  const bus = inject('bus')
  const operationStore = useOperationsStore()
  const currentPortfolioManagementTab = ref('portfolio')
  const $q = useQuasar()

  const portfolioManagementTableRef = ref(null)
  const playerPortfoliosTableRef = ref(null)
  const portfolioManagementFilter = ref({
    player: null,
    playerId: null,
    rating: null,
    withResult: false,
    birthDay: false,
    spouseBirthDay: false,
    weddingAnniversary: false,
    date: new Date().toISOString(),
    findBySpecialDay: false,
  })

  const selectedPortfolioManagementRow = ref(null)

  const handleGetPortfolioManagement = () => {
    currentPortfolioManagementTab.value = 'portfolio'
    playerPortfoliosTableRef.value.fetchData()
  }

  const handlePortfolioManagementExportExcel = async () => {
    await api
      .get('/api/Export/GetPlayerPortfolio', {
        params: {
          ...portfolioManagementFilter.value,
          exportFileType: 'Excel',
        },
        responseType: 'blob',
      })
      .then((res) => {
        let extension = portfolioManagementFilter.value.exportFileType === 'Excel' ? 'xlsx' : 'pdf'
        let fileName = `portfolio-management-${portfolioManagementFilter.value.date}.${extension}`
        let blob = res.data
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        return true
      })
  }
  const onHandleDateChange = (val) => {
    portfolioManagementFilter.value.date = date.formatDate(val, 'YYYY-MM-DD')
  }

  const onClickCreateGift = (initialValues = {}) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import('src/components/pages/operations/PlayerGiftCreateModal.vue'),
      ),
      componentProps: {
        initialValues,
      },
    }).onOk(async (payload) => {
      if (payload.id) {
        await operationStore.updateGift(payload)
      } else {
        await operationStore.createGift(payload)
      }
      bus.emit('playerPortfolios', {
        ...portfolioManagementFilter.value,
      })
    })
  }

  const onClickRemoveGift = async (row) => {
    $q.dialog({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteConfirmation', {
        name: row.name,
      }),
      cancel: {
        label: i18n.global.t('cancel'),
        color: 'negative',
        noCaps: true,
        flat: true,
        icon: 'close',
      },
      ok: {
        label: i18n.global.t('delete'),
        color: 'primary',
        noCaps: true,
        flat: false,
        icon: 'check',
        unelevated: true,
      },
      persistent: true,
    }).onOk(async () => {
      await operationStore.deleteGift(row.id)
      portfolioManagementTableRef.value.fetchData()
    })
  }
  const handlePortfolioManagementImportExcel = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import('src/components/pages/operations/ImportExcelModal.vue'),
      ),
      componentProps: {},
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      bus.emit('playerPortfolios', {
        ...portfolioManagementFilter.value,
      })
    })
  }

  const portfolioColumns = ref([
    {
      field: 'playerFullName',
      label: 'Player Name',
    },
    {
      field: 'birthDate',
      fieldType: 'date',
    },
    {
      field: 'email',
    },
    {
      field: 'phoneNumber1',
    },
    {
      field: 'phoneNumber2',
    },
    {
      field: 'spouseBirthDate',
      fieldType: 'date',
    },
    {
      field: 'weddingDate',
      fieldType: 'date',
    },
    {
      field: 'gift',
    },
    {
      field: 'isDelivered',
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
      field: 'nation',
    },
    {
      field: 'rating',
    },
    {
      field: 'slotDrop',
      fieldType: 'price',
    },
    {
      field: 'lgDrop',
      fieldType: 'price',
    },
    {
      field: 'slotTurnover',
      fieldType: 'price',
    },
    {
      field: 'lgTurnover',
      fieldType: 'price',
    },
    {
      field: 'result',
      fieldType: 'price',
    },
  ])

  const giftColumns = ref([
    {
      field: 'id',
      label: 'Id',
    },
    {
      field: 'playerFullName',
      label: 'Player Name',
    },
    {
      field: 'playerId',
      label: 'Player Id',
    },
    {
      field: 'giftId',
      label: 'Gift Id',
    },
    {
      field: 'giftName',
      label: 'Gift Name',
    },
    {
      field: 'plannedDate',
      fieldType: 'date',
    },
    {
      field: 'isDeleted',
      fieldType: 'boolean',
    },
    {
      field: 'actions',
    },
  ])

  const giftListFilterParams = ref({
    playerId: null,
    rating: null,
  })

  return {
    currentPortfolioManagementTab,
    operationStore,
    portfolioManagementFilter,
    portfolioManagementTableRef,
    playerPortfoliosTableRef,
    selectedPortfolioManagementRow,
    handleGetPortfolioManagement,
    handlePortfolioManagementExportExcel,
    onHandleDateChange,
    onClickCreateGift,
    onClickRemoveGift,
    handlePortfolioManagementImportExcel,

    portfolioColumns,
    giftColumns,
    giftListFilterParams,
  }
}
