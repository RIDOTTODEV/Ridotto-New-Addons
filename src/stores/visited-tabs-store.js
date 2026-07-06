import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalStorage } from 'quasar'

const STORAGE_KEY = 'visitedTabs'

export function buildTabId(routeName, params = {}) {
  if (!params || !Object.keys(params).length) return routeName
  const parts = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
  return `${routeName}|${parts.join('|')}`
}

export function buildRouteLocation(tab) {
  if (tab.params && Object.keys(tab.params).length) {
    return { name: tab.routeName, params: tab.params }
  }
  return { name: tab.routeName }
}

export function normalizeRouteParams(params) {
  if (!params || !Object.keys(params).length) return null
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  )
}

export function getBreadcrumbRoot(route) {
  const breadcrumb = route?.meta?.breadcrumb
  if (Array.isArray(breadcrumb) && breadcrumb.length) {
    return breadcrumb[0].name
  }
  return route?.name ?? null
}

export function isTabActiveForRoute(tab, route) {
  if (route.name !== tab.routeName) return false
  if (!tab.params) return true
  return Object.entries(tab.params).every(
    ([key, value]) => String(route.params[key]) === String(value),
  )
}

function snapshotRoute(route) {
  if (!route?.name) return null
  return {
    name: route.name,
    params: normalizeRouteParams(route.params),
    meta: route.meta,
  }
}

function loadTabs() {
  try {
    const saved = LocalStorage.getItem(STORAGE_KEY)
    if (Array.isArray(saved)) return saved
  } catch {
    /* ignore */
  }
  return []
}

export const useVisitedTabsStore = defineStore('visitedTabs', {
  state: () => ({
    tabs: loadTabs(),
    pageTransitionDirection: null,
    routeReloadKeys: {},
  }),

  getters: {
    pinnedTabs: (state) => state.tabs.filter((tab) => tab.pinned),
    unpinnedTabs: (state) => state.tabs.filter((tab) => !tab.pinned),
    hasTabs: (state) => state.tabs.length > 0,
    orderedTabs: (state) => {
      const pinned = state.tabs.filter((tab) => tab.pinned)
      const unpinned = state.tabs.filter((tab) => !tab.pinned)
      return [...pinned, ...unpinned]
    },
    getRouteReloadKey: (state) => (fullPath) => state.routeReloadKeys[fullPath] || 0,
  },

  actions: {
    getTabIndex(id) {
      return this.orderedTabs.findIndex((tab) => tab.id === id)
    },

    setPageTransition(direction) {
      this.pageTransitionDirection = direction
    },

    clearPageTransition() {
      this.pageTransitionDirection = null
    },

    reloadRoute(fullPath) {
      this.routeReloadKeys[fullPath] = (this.routeReloadKeys[fullPath] || 0) + 1
    },

    persist() {
      LocalStorage.set(STORAGE_KEY, this.tabs)
    },

    updateTabRoute(tabId, { routeName, params }) {
      const index = this.tabs.findIndex((tab) => tab.id === tabId)
      if (index === -1) return null

      const normalizedParams = normalizeRouteParams(params)
      const nextId = buildTabId(routeName, normalizedParams)
      const duplicateIndex = this.tabs.findIndex(
        (tab) => tab.id === nextId && tab.id !== tabId,
      )

      if (duplicateIndex !== -1) {
        const duplicate = this.tabs[duplicateIndex]
        this.tabs.splice(index, 1)
        this.persist()
        return duplicate
      }

      const tab = this.tabs[index]
      tab.id = nextId
      tab.routeName = routeName
      tab.params = normalizedParams
      this.persist()
      return tab
    },

    syncTabFromRoute(route, previousRoute = null) {
      if (!route?.name || route.name === 'index') return null

      const routeName = route.name
      const params = normalizeRouteParams(route.params)
      const tabId = buildTabId(routeName, params)
      const exactTab = this.tabs.find((tab) => tab.id === tabId)

      if (exactTab) {
        return exactTab
      }

      const breadcrumb = route.meta?.breadcrumb
      const breadcrumbRoot = getBreadcrumbRoot(route)
      const previousSnapshot = snapshotRoute(previousRoute)
      const sameSection =
        previousSnapshot &&
        getBreadcrumbRoot(previousSnapshot) === breadcrumbRoot

      let tabToUpdate = null

      if (sameSection) {
        tabToUpdate = this.tabs.find((tab) => tab.routeName === previousSnapshot.name)
        if (!tabToUpdate && breadcrumbRoot) {
          tabToUpdate = this.tabs.find((tab) => tab.routeName === breadcrumbRoot)
        }
      } else if (breadcrumbRoot) {
        tabToUpdate = this.tabs.find((tab) => tab.routeName === breadcrumbRoot)
      }

      if (tabToUpdate) {
        return this.updateTabRoute(tabToUpdate.id, { routeName, params })
      }

      if (!Array.isArray(breadcrumb) || !breadcrumb.length) return null

      return this.openTab({
        routeName,
        params,
        title: breadcrumbRoot || routeName,
        icon: null,
      })
    },

    openTab({ routeName, params, title, icon }) {
      const normalizedParams = normalizeRouteParams(params)
      const id = buildTabId(routeName, normalizedParams)
      const existingIndex = this.tabs.findIndex((tab) => tab.id === id)

      if (existingIndex !== -1) {
        return this.tabs[existingIndex]
      }

      const tab = {
        id,
        routeName,
        params: normalizedParams,
        title,
        icon: icon || null,
        pinned: false,
        createdAt: Date.now(),
      }

      const pinned = this.tabs.filter((t) => t.pinned)
      const unpinned = this.tabs.filter((t) => !t.pinned)
      this.tabs = [...pinned, ...unpinned, tab]
      this.persist()
      return tab
    },

    removeTab(id) {
      const index = this.tabs.findIndex((tab) => tab.id === id)
      if (index === -1) return null

      const removed = this.tabs[index]
      this.tabs.splice(index, 1)
      this.persist()
      return { removed, index }
    },

    removeTabs(ids) {
      if (!ids?.length) return { removedCount: 0 }

      const idSet = new Set(ids)
      const beforeCount = this.tabs.length
      this.tabs = this.tabs.filter((tab) => !idSet.has(tab.id))
      const removedCount = beforeCount - this.tabs.length

      if (removedCount > 0) {
        this.persist()
      }

      return { removedCount }
    },

    togglePin(id) {
      const tab = this.tabs.find((t) => t.id === id)
      if (!tab) return

      tab.pinned = !tab.pinned

      const pinned = this.tabs.filter((t) => t.pinned)
      const unpinned = this.tabs.filter((t) => !t.pinned)
      this.tabs = [...pinned, ...unpinned]
      this.persist()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVisitedTabsStore, import.meta.hot))
}
