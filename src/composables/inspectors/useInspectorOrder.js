import { useInspectorStore } from 'src/stores/inspector-store'
import { useInspectorOrderStore } from 'src/stores/inspector-order-store'
import { useAuthStore } from 'src/stores/auth-store'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import { i18n } from 'boot/i18n'

export function useInspectorOrder() {
  const $q = useQuasar()
  const inspectorOrderStore = useInspectorOrderStore()
  const { posSettings, terminal, terminalMenu, portionSets, extraSets, showCancelOrderBtn } =
    storeToRefs(inspectorOrderStore)

  const inspectorStore = useInspectorStore()
  const { currentTable, currentPlayer } = storeToRefs(inspectorStore)

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  const playerOrderTab = ref('newOrder')
  const order = ref({
    products: [],
    tableId: currentTable.value?.id,
    tableName: currentTable.value?.name,
    terminalId: terminal.value?.id,
    isGift: false,
    isLovePoint: false,
    tenantId: 1,
    playerName: currentPlayer.value?.playerName,
    externalId: currentPlayer.value?.playerId,
    externalUserId: currentPlayer.value?.playerId,
    orderedByFullName: user.value?.details?.name || '',
    orderSource: 2,
    TerminalName: terminal.value?.name,
  })
  const playerOrders = ref([])
  const selectedOrderItem = ref({
    index: -1,
    product: null,
  })
  const categories = ref([])
  const categoryHistory = ref([])
  const products = ref([])
  const fetchFavoriteProduct = ref(false)

  const initializeMenu = () => {
    if (terminalMenu.value.length === 1) {
      categoryHistory.value.push(terminalMenu.value[0])
      if (terminalMenu.value[0].categories.length === 1) {
        categoryHistory.value.push(terminalMenu.value[0].categories[0])
        categories.value = terminalMenu.value[0].categories[0].subCategories || []
        products.value = terminalMenu.value[0].categories[0].products || []
      } else {
        categories.value = terminalMenu.value[0].categories || []
      }
    } else {
      categories.value = terminalMenu.value
      categoryHistory.value.push(terminalMenu.value[0])
    }
  }
  const onClickCategory = (category) => {
    categoryHistory.value.push(category)
    categories.value = category.categories || category.subCategories || []
    products.value = category.products || []
    fetchFavoriteProduct.value = false
  }
  const onClickBack = () => {
    if (categoryHistory.value.length > 0) {
      categoryHistory.value.pop()
      const category = categoryHistory.value[categoryHistory.value.length - 1]
      categories.value = category
        ? category.categories || category.subCategories || []
        : terminalMenu.value
      products.value = category ? category.products || [] : []
      if (categoryHistory.value.length === 0 && terminalMenu.value.length === 1) {
        categoryHistory.value.push(terminalMenu.value[0])
      }
    }
  }
  const onClickFavorite = async () => {
    fetchFavoriteProduct.value = !fetchFavoriteProduct.value
    if (fetchFavoriteProduct.value) {
      await filterProducts()
    } else {
      products.value =
        categoryHistory.value.length > 0
          ? categoryHistory.value[categoryHistory.value.length - 1]?.products
          : []
    }
  }
  const onClickProduct = (product) => {
    if (!productPortionAndExtra(product, 'add')) {
      order.value.products.push({
        ...product,
        quantity: 1,
        orderTag: product.tag,
        orderTagId: product.tagId,
        status: 'New',
        menuId: categoryHistory.value[0]?.menuId || null,
        ...getDefaultPortionAndExtras(product),
      })
    }
    playerOrderTab.value = 'newOrder'
  }
  const filterProducts = async () => {
    const menuId = categoryHistory.value[0]?.menuId || null // [0] is the root category
    const categoryId = categoryHistory.value[categoryHistory.value.length - 1]?.categoryId || null // [length - 1] is the current category
    const payload = {
      menuId: menuId,
      categoryId: categoryId,
      favorite: fetchFavoriteProduct.value,
    }
    if (menuId) {
      await inspectorOrderStore.searchProducts(payload).then((res) => {
        products.value = res.data || []
      })
    } else {
      products.value =
        categoryHistory.value.length > 0
          ? categoryHistory.value[categoryHistory.value.length - 1]?.products
          : []
    }
  }
  const getDefaultPortionAndExtras = (product) => {
    const portionSet = inspectorOrderStore.getPortionSet(product.portionSetId)
    const extraSet = inspectorOrderStore.getExtraSet(product.extraSetId)

    const portionSetDefault = portionSet?.portions.find(
      (portion) => portion.id === portionSet.defaultPortionId,
    )
    const extraSetDefault = extraSet?.extras
      .filter((extra) => extra.defaultExtra)
      .map((extra) => extra.id)
    return {
      portion: portionSetDefault?.name || null,
      extras: extraSetDefault?.name || null,
    }
  }
  const addProductToOrder = (product) => {
    const existingProduct = checkProductExist(product)
    if (existingProduct) {
      existingProduct.quantity++
    } else {
      order.value.products.push({
        ...product,
        quantity: 1,
        orderTag: product.tag,
        orderTagId: product.tagId,
        status: 'New',
        menuId: categoryHistory.value[0]?.menuId || null,
      })
    }
  }
  const checkProductExist = (product) => {
    return (
      order.value.products.find(
        (p) =>
          p.id === product.id &&
          p.productName === product.productName &&
          p.portionSetId === product.portionSetId &&
          p.extraSetId === product.extraSetId &&
          p?.portion === product?.portion &&
          p?.extra === product?.extra &&
          p?.note === product?.note,
      ) || null
    )
  }
  const increaseProduct = (productIndex) => {
    order.value.products[productIndex].quantity++
  }
  const decreaseProduct = (productIndex) => {
    if (order.value.products[productIndex].quantity > 1) {
      order.value.products[productIndex].quantity--
    } else {
      order.value.products.splice(productIndex, 1)
      if (selectedOrderItem.value.index === productIndex) {
        selectedOrderItem.value = {
          index: -1,
          product: null,
        }
      }
    }
  }
  const productPortionAndExtra = (product, action = 'add', showExist = false) => {
    const portionSet = inspectorOrderStore.getPortionSet(product?.portionSetId)
    const extraSet = inspectorOrderStore.getExtraSet(product?.extraSetId)

    if (showExist) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/ExtraPortionDialog.vue'),
        ),
        componentProps: {
          portions: portionSet?.portions || [],
          product: {
            ...product,
            extras: product?.extras ? product.extras.split(',') : [],
          },
          extras: extraSet ? extraSet.extras : [],
        },
      }).onOk((payload) => {
        if (action === 'add') {
          addProductToOrder(payload)
        } else if (action === 'update') {
          order.value.products[selectedOrderItem.value.index] = payload
          if (selectedOrderItem.value.index !== -1) {
            selectedOrderItem.value.product = payload
          }
        }
      })
      return
    }
    if (portionSet && !portionSet.defaultPortionId) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/ExtraPortionDialog.vue'),
        ),
        componentProps: {
          portions: portionSet.portions || [],
          product: {
            ...product,
            extras: product.extras ? product.extras.split(',') : [],
          },
          extras: extraSet ? extraSet.extras : [],
        },
      }).onOk((payload) => {
        if (action === 'add') {
          addProductToOrder(payload)
        } else if (action === 'update') {
          order.value.products[selectedOrderItem.value.index] = payload
          if (selectedOrderItem.value.index !== -1) {
            selectedOrderItem.value.product = payload
          }
        }
      })
    }

    return portionSet && !portionSet.defaultPortionId
  }

  const onSelectOrderItem = (product, index) => {
    selectedOrderItem.value = {
      index: index,
      product: { ...product },
    }
  }
  const completeOrder = async () => {
    $q.loading.show({
      message: i18n.global.t('base.loading'),
    })

    await inspectorOrderStore.createOrder({ ...order.value }).finally(() => $q.loading.hide())
    order.value.products = []
    await getPlayerOrders({ ...currentPlayer.value })
    playerOrderTab.value = 'oldOrders'
  }

  const onSelectedPlayer = async () => {
    order.value.playerName = currentPlayer.value.playerName
    order.value.externalId = currentPlayer.value.playerId
    order.value.externalUserId = currentPlayer.value.playerId
    order.value.products = []
    await getPlayerOrders(currentPlayer.value)
  }
  const getPlayerOrders = async (player) => {
    const startDateTime = date.formatDate(
      date.subtractFromDate(new Date(), { days: 2 }),
      'YYYY-MM-DDTHH:mm:ss',
    )
    let params = {
      externalId: player.playerId,
      orderTag: 'SIGARA',
      startDate: startDateTime,
      endDate: null,
      queryType: 'ByTime',
      take: 5,
      skip: 0,
    }
    await inspectorOrderStore.fetchPlayerOrders(params).then((res) => {
      playerOrders.value = res.data.data
    })
  }
  const onClickCancelOrder = async (orderItem) => {
    if (terminal.value.askPasswordRestoring.includes(orderItem?.orderTagId)) {
      if (
        posSettings.value?.inspectorOrderDeletePassword &&
        posSettings.value?.inspectorOrderDeletePassword.toString().length > 0
      ) {
        $q.dialog({
          component: defineAsyncComponent(
            () => import('../../pages/inspector/components/OrderCancelPasswordDialog.vue'),
          ),
          componentProps: {
            password: posSettings.value.inspectorOrderDeletePassword,
          },
          persistent: true,
          position: 'top',
        }).onOk(async (values) => {
          if (values.password === posSettings.value.inspectorOrderDeletePassword) {
            await inspectorOrderStore.cancelOrderDetail({
              orderDetailId: orderItem.id,
              status: 'Cancelled',
            })
            await getPlayerOrders(currentPlayer.value)
          } else {
            $q.notify({
              type: 'negative',
              message: i18n.global.t('wrongPassword'),
              position: 'top-right',
              timeout: 2000,
            })
          }
        })
      }
    } else {
      await inspectorOrderStore.cancelOrderDetail({
        orderDetailId: orderItem.id,
        status: 'Cancelled',
      })
      await getPlayerOrders(currentPlayer.value)
    }
  }

  onMounted(async () => {
    initializeMenu()
    onSelectedPlayer()
  })
  watch(
    () => terminalMenu.value,
    () => {
      initializeMenu()
    },
  )
  watch(
    () => terminal.value,
    () => {
      order.value.terminalId = terminal.value?.id
      order.value.TerminalName = terminal.value?.name
    },
  )

  watch(
    () => user.value,
    () => {
      order.value.orderedByFullName = user.value?.details?.name || ''
    },
  )

  const orderByAlphabeticProducts = computed(() => {
    return products?.value?.sort((a, b) => a.productName.localeCompare(b.productName))
  })
  const getNameOfObject = (obj) => {
    switch (true) {
      case Object.prototype.hasOwnProperty.call(obj, 'menuName'):
        return obj.menuName
      case Object.prototype.hasOwnProperty.call(obj, 'categoryName'):
        return obj.categoryName
      case Object.prototype.hasOwnProperty.call(obj, 'productName'):
        return obj.productName
    }
  }
  const textCapitalize = (text) => {
    if (!text) return text
    return text.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase()
    })
  }
  return {
    playerOrderTab,
    posSettings,
    terminal,
    terminalMenu,
    portionSets,
    extraSets,
    order,
    playerOrders,
    selectedOrderItem,
    categories,
    categoryHistory,
    products,
    fetchFavoriteProduct,
    orderByAlphabeticProducts,
    onClickCategory,
    onClickBack,
    onClickFavorite,
    onClickProduct,
    increaseProduct,
    decreaseProduct,
    onSelectOrderItem,
    completeOrder,
    onSelectedPlayer,
    onClickCancelOrder,
    initializeMenu,
    getPlayerOrders,
    getNameOfObject,
    textCapitalize,
    productPortionAndExtra,
    date,
    showCancelOrderBtn,
  }
}
