<template>
  <nav v-if="hasTabs" class="visited-tabs" aria-label="Visited pages">
    <div v-if="pinnedTabs.length" class="visited-tabs__pinned">
      <VisitedTabItem
        v-for="tab in pinnedTabs"
        :key="tab.id"
        :tab="tab"
        :active="isTabActive(tab)"
        pinned
        @activate="activateTab(tab)"
        @close="closeTab(tab)"
        @toggle-pin="togglePin(tab)"
        @reload="reloadTab(tab)"
        @open-in-new-window="openInNewWindow(tab)"
      />
    </div>

    <span
      v-if="pinnedTabs.length && unpinnedTabs.length"
      class="visited-tabs__divider"
      aria-hidden="true"
    />

    <div class="visited-tabs__scroll-area">
      <button
        v-if="hasScrollOverflow"
        type="button"
        class="visited-tabs__scroll-btn"
        :aria-label="$t('scrollTabsLeft')"
        :disabled="!canScrollLeft"
        @click="scrollTabs('left')"
      >
        <q-icon name="chevron_left" size="18px" />
      </button>

      <div ref="scrollRef" class="visited-tabs__scroll" @scroll="updateScrollState">
        <TransitionGroup name="visited-tab" tag="div" class="visited-tabs__track">
          <VisitedTabItem
            v-for="tab in unpinnedTabs"
            :key="tab.id"
            :tab="tab"
            :active="isTabActive(tab)"
            @activate="activateTab(tab)"
            @close="closeTab(tab)"
            @toggle-pin="togglePin(tab)"
            @reload="reloadTab(tab)"
            @open-in-new-window="openInNewWindow(tab)"
          />
        </TransitionGroup>
      </div>

      <button
        v-if="hasScrollOverflow"
        type="button"
        class="visited-tabs__scroll-btn"
        :aria-label="$t('scrollTabsRight')"
        :disabled="!canScrollRight"
        @click="scrollTabs('right')"
      >
        <q-icon name="chevron_right" size="18px" />
      </button>
    </div>

    <div class="visited-tabs__actions">
      <q-btn
        flat
        dense
        round
        size="sm"
        class="visited-tabs__action"
        :aria-label="$t('tabActions')"
      >
        <q-icon name="dashboard" size="18px" />

        <q-menu
          anchor="bottom right"
          self="top right"
          class="visited-tabs__actions-menu"
        >
          <q-list dense class="visited-tab-item__menu-list">
            <q-item
              v-close-popup
              clickable
              :disable="!canCloseLeftTabs"
              @click="closeLeftTabs"
            >
              <q-item-section avatar>
                <q-icon name="keyboard_arrow_left" size="18px" />
              </q-item-section>
              <q-item-section>{{ $t('closeLeftTabs') }}</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              :disable="!canCloseRightTabs"
              @click="closeRightTabs"
            >
              <q-item-section avatar>
                <q-icon name="keyboard_arrow_right" size="18px" />
              </q-item-section>
              <q-item-section>{{ $t('closeRightTabs') }}</q-item-section>
            </q-item>

            <q-item
              v-if="activeTab"
              v-close-popup
              clickable
              :disable="!canCloseOtherTabs"
              @click="closeOtherTabs"
            >
              <q-item-section avatar>
                <q-icon name="tab_unselected" size="18px" />
              </q-item-section>
              <q-item-section>{{ $t('closeOtherTabs') }}</q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="closeAllTabs">
              <q-item-section avatar>
                <q-icon name="layers_clear" size="18px" />
              </q-item-section>
              <q-item-section>{{ $t('closeAllTabs') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <button
        type="button"
        class="visited-tabs__action"
        :aria-label="$t('reloadActiveTab')"
        :disabled="!activeTab"
        @click="reloadActiveTab"
      >
        <q-icon name="refresh" size="18px" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { buildRouteLocation, isTabActiveForRoute, useVisitedTabsStore } from 'src/stores/visited-tabs-store'
import VisitedTabItem from 'src/components/layout/VisitedTabItem.vue'

const route = useRoute()
const router = useRouter()
const visitedTabsStore = useVisitedTabsStore()
const { pinnedTabs, unpinnedTabs, hasTabs } = storeToRefs(visitedTabsStore)

const scrollRef = ref(null)
const previousRoute = ref(null)
const hasScrollOverflow = ref(false)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

let scrollResizeObserver = null

const SCROLL_EDGE_THRESHOLD = 2

const updateScrollState = () => {
  const container = scrollRef.value
  if (!container) return

  const { scrollLeft, scrollWidth, clientWidth } = container
  hasScrollOverflow.value = scrollWidth > clientWidth + SCROLL_EDGE_THRESHOLD
  canScrollLeft.value = scrollLeft > SCROLL_EDGE_THRESHOLD
  canScrollRight.value = scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_THRESHOLD
}

const scrollTabs = (direction) => {
  const container = scrollRef.value
  if (!container) return

  const amount = Math.max(container.clientWidth * 0.75, 120)
  container.scrollBy({
    left: direction === 'left' ? -amount : amount,
    behavior: 'smooth',
  })
}

const isTabActive = (tab) => isTabActiveForRoute(tab, route)

const activeTab = computed(() => visitedTabsStore.tabs.find((tab) => isTabActive(tab)))

const activeTabIndex = computed(() => {
  if (!activeTab.value) return -1
  return visitedTabsStore.getTabIndex(activeTab.value.id)
})

const canCloseLeftTabs = computed(() => {
  if (activeTabIndex.value <= 0) return false
  return visitedTabsStore.orderedTabs
    .slice(0, activeTabIndex.value)
    .some((tab) => !tab.pinned)
})

const canCloseRightTabs = computed(() => {
  if (activeTabIndex.value === -1) return false
  const ordered = visitedTabsStore.orderedTabs
  return ordered.slice(activeTabIndex.value + 1).some((tab) => !tab.pinned)
})

const canCloseOtherTabs = computed(() => {
  if (!activeTab.value) return false
  return visitedTabsStore.tabs.some(
    (tab) => tab.id !== activeTab.value.id && !tab.pinned,
  )
})

const setTransitionByIndex = (fromIndex, toIndex) => {
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return
  visitedTabsStore.setPageTransition(toIndex > fromIndex ? 'forward' : 'backward')
}

const activateTab = (tab) => {
  if (isTabActive(tab)) return

  const fromIndex = activeTab.value ? visitedTabsStore.getTabIndex(activeTab.value.id) : -1
  const toIndex = visitedTabsStore.getTabIndex(tab.id)
  setTransitionByIndex(fromIndex, toIndex)

  router.push(buildRouteLocation(tab))
}

const closeTab = (tab) => {
  const wasActive = isTabActive(tab)
  const result = visitedTabsStore.removeTab(tab.id)
  if (!wasActive || !result) return

  const remaining = visitedTabsStore.tabs
  if (!remaining.length) {
    router.push({ name: 'index' })
    return
  }

  const nextIndex = Math.min(result.index, remaining.length - 1)
  const removedIndex = result.index
  const targetOriginalIndex = nextIndex >= removedIndex ? nextIndex + 1 : nextIndex
  setTransitionByIndex(removedIndex, targetOriginalIndex)

  router.push(buildRouteLocation(remaining[nextIndex]))
}

const togglePin = (tab) => {
  visitedTabsStore.togglePin(tab.id)
}

const reloadTab = async (tab) => {
  const location = buildRouteLocation(tab)
  const { fullPath } = router.resolve(location)

  if (!isTabActive(tab)) {
    await router.push(location)
    return
  }

  visitedTabsStore.reloadRoute(fullPath)
}

const reloadActiveTab = () => {
  if (!activeTab.value) return
  reloadTab(activeTab.value)
}

const removeTabsByIds = (ids, { includePinned = false } = {}) => {
  const idsToRemove = visitedTabsStore.tabs
    .filter((tab) => ids.includes(tab.id) && (includePinned || !tab.pinned))
    .map((tab) => tab.id)

  if (!idsToRemove.length) return

  visitedTabsStore.removeTabs(idsToRemove)
}

const closeLeftTabs = () => {
  if (!activeTab.value || !canCloseLeftTabs.value) return

  const ids = visitedTabsStore.orderedTabs
    .slice(0, activeTabIndex.value)
    .filter((tab) => !tab.pinned)
    .map((tab) => tab.id)

  removeTabsByIds(ids)
}

const closeRightTabs = () => {
  if (!activeTab.value || !canCloseRightTabs.value) return

  const ids = visitedTabsStore.orderedTabs
    .slice(activeTabIndex.value + 1)
    .filter((tab) => !tab.pinned)
    .map((tab) => tab.id)

  removeTabsByIds(ids)
}

const closeOtherTabs = () => {
  if (!activeTab.value || !canCloseOtherTabs.value) return

  const ids = visitedTabsStore.tabs
    .filter((tab) => tab.id !== activeTab.value.id && !tab.pinned)
    .map((tab) => tab.id)

  removeTabsByIds(ids)
}

const closeAllTabs = () => {
  if (!visitedTabsStore.tabs.length) return

  visitedTabsStore.removeTabs(visitedTabsStore.tabs.map((tab) => tab.id))
  router.push({ name: 'index' })
}

const openInNewWindow = (tab) => {
  const resolved = router.resolve(buildRouteLocation(tab))
  window.open(resolved.href, '_blank', 'noopener,noreferrer')
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    const container = scrollRef.value
    if (!container) return
    const activeEl = container.querySelector('.visited-tab-item--active')
    activeEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    updateScrollState()
  })
}

onMounted(() => {
  nextTick(() => {
    updateScrollState()

    scrollResizeObserver = new ResizeObserver(() => updateScrollState())
    if (scrollRef.value) {
      scrollResizeObserver.observe(scrollRef.value)
      const track = scrollRef.value.firstElementChild
      if (track) scrollResizeObserver.observe(track)
    }
  })
})

onUnmounted(() => {
  scrollResizeObserver?.disconnect()
  scrollResizeObserver = null
})

watch(
  () => route.fullPath,
  () => {
    visitedTabsStore.syncTabFromRoute(route, previousRoute.value)
    previousRoute.value = {
      name: route.name,
      params: route.params,
      meta: route.meta,
    }
    scrollActiveIntoView()
  },
  { immediate: true },
)

watch(activeTab, () => scrollActiveIntoView())

watch(unpinnedTabs, () => {
  nextTick(updateScrollState)
}, { deep: true })
</script>

<style scoped lang="scss">
.visited-tabs {
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(15, 34, 58, 0.06);
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  height: 40px;
  padding: 0 8px;
  overflow: visible;
}

:global(.body--dark) .visited-tabs {
  background: #2a3038;
  border-top-color: rgba(255, 255, 255, 0.06);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.visited-tabs__pinned {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
}

.visited-tabs__divider {
  width: 1px;
  align-self: stretch;
  margin: 8px 4px;
  background: #e5e7eb;
  flex-shrink: 0;
}

:global(.body--dark) .visited-tabs__divider {
  background: rgba(255, 255, 255, 0.14);
}

.visited-tabs__scroll-area {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 2px;
}

.visited-tabs__scroll-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
    color: #42627f;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

:global(.body--dark) .visited-tabs__scroll-btn {
  color: #94a3b8;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.06);
    color: #b8d4e8;
  }
}

.visited-tabs__scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.visited-tabs__track {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 40px;
  position: relative;
}

.visited-tabs__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
  margin-left: 4px;
  padding-left: 4px;
  border-left: 1px solid #e5e7eb;
}

:global(.body--dark) .visited-tabs__actions {
  border-left-color: rgba(255, 255, 255, 0.14);
}

.visited-tabs__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
    color: #42627f;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  :deep(.q-btn__content) {
    padding: 0;
  }
}

:global(.body--dark) .visited-tabs__action {
  color: #94a3b8;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.06);
    color: #b8d4e8;
  }
}

.visited-tab-enter-active {
  transition:
    opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.visited-tab-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  position: absolute;
}

.visited-tab-enter-from {
  opacity: 0;
  transform: translateX(16px) scale(0.96);
}

.visited-tab-leave-to {
  opacity: 0;
  transform: translateX(-8px) scale(0.96);
}

.visited-tab-move {
  transition: transform 0.22s ease;
}

@media (prefers-reduced-motion: reduce) {
  .visited-tab-enter-active,
  .visited-tab-leave-active,
  .visited-tab-move {
    transition: none;
  }
}
</style>
