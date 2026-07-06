<template>
  <q-drawer
    v-model="sideBarDrawer"
    show-if-above
    :width="drawerWidth"
    :breakpoint="400"
    class="app-sidebar"
    :class="{
      'app-sidebar--collapsed': collapsed,
    }"
  >
    <div class="app-sidebar__header">
      <div class="app-sidebar__logo" @click="router.push({ name: 'index' })">
        <template v-if="collapsed">
          <div class="app-sidebar__logo-icon">
            <img src="/assets/logo.png" alt="Ridotto" class="app-sidebar__logo-img" />
          </div>
        </template>
        <img
          v-else
          src="/assets/logo.png"
          alt="Ridotto"
          class="app-sidebar__logo-full"
        />
      </div>
      <q-btn
        v-if="!isMobile"
        flat
        round
        dense
        size="sm"
        class="app-sidebar__toggle"
        :icon="collapsed ? 'chevron_right' : 'chevron_left'"
        @click="toggleCollapsed"
      />
    </div>

    <nav class="app-sidebar__nav">
      <template v-for="(menu, i) in menus" :key="i">
        <!-- Tekli menü -->
        <div
          v-if="menu.type === 'menu'"
          class="app-sidebar__menu-group"
          v-el-perms="menu.permission"
        >
          <div
            class="app-sidebar__link"
            :class="{ 'app-sidebar__link--active': isActive(menu.routeName) }"
            @click="navigate(menu)"
          >
            <q-icon :name="menu.icon" size="18px" class="app-sidebar__link-icon" />
            <span v-if="!collapsed" class="app-sidebar__link-label">{{ $t(menu.title) }}</span>
            <q-tooltip v-if="collapsed" anchor="center right" self="center left">
              {{ $t(menu.title) }}
            </q-tooltip>
          </div>
        </div>

        <!-- Açılır menü (dropdown) -->
        <div
          v-else-if="menu.type === 'dropdown'"
          class="app-sidebar__menu-group"
          v-el-perms="menu.permission"
        >
          <div
            class="app-sidebar__link app-sidebar__group-header"
            @click="toggleGroup(`g${i}`)"
          >
            <q-icon :name="menu.icon || 'folder'" size="18px" class="app-sidebar__link-icon" />
            <span v-if="!collapsed" class="app-sidebar__link-label">{{ $t(menu.title) }}</span>
            <q-icon
              v-if="!collapsed"
              name="keyboard_arrow_down"
              size="18px"
              class="app-sidebar__expand-icon"
              :class="{ 'app-sidebar__expand-icon--open': isOpen(`g${i}`) }"
            />
            <q-tooltip v-if="collapsed" anchor="center right" self="center left">
              {{ $t(menu.title) }}
            </q-tooltip>
          </div>

          <div
            class="app-sidebar__submenu-collapse"
            :class="{ 'app-sidebar__submenu-collapse--open': !collapsed && isOpen(`g${i}`) }"
          >
            <div class="app-sidebar__submenu">
            <template v-for="(item, j) in menu.subMenus" :key="j">
              <!-- İç içe açılır menü -->
              <div
                v-if="item.type === 'dropdown'"
                class="app-sidebar__menu-group"
                v-el-perms="item.permission"
              >
                <div
                  class="app-sidebar__sublink app-sidebar__group-header"
                  @click="toggleGroup(`g${i}-${j}`)"
                >
                  <span class="app-sidebar__link-label">{{ $t(item.title) }}</span>
                  <q-icon
                    name="keyboard_arrow_down"
                    size="16px"
                    class="app-sidebar__expand-icon"
                    :class="{ 'app-sidebar__expand-icon--open': isOpen(`g${i}-${j}`) }"
                  />
                </div>

                <div
                  class="app-sidebar__submenu-collapse app-sidebar__submenu-collapse--nested"
                  :class="{ 'app-sidebar__submenu-collapse--open': isOpen(`g${i}-${j}`) }"
                >
                  <div class="app-sidebar__submenu app-sidebar__submenu--nested">
                    <div
                      v-for="(sub, k) in item.subMenus"
                      :key="k"
                      class="app-sidebar__sublink"
                      :class="{ 'app-sidebar__sublink--active': isActive(sub.routeName) }"
                      @click="navigate(sub)"
                      v-el-perms="sub.permission"
                    >
                      <span class="app-sidebar__link-label">{{ $t(sub.title) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Yaprak (leaf) alt menü -->
              <div
                v-else
                class="app-sidebar__sublink"
                :class="{ 'app-sidebar__sublink--active': isActive(item.routeName) }"
                @click="navigate(item)"
                v-el-perms="item.permission"
              >
                <span class="app-sidebar__link-label">{{ $t(item.title) }}</span>
              </div>
            </template>
            </div>
          </div>
        </div>
      </template>
    </nav>

    <div v-if="!collapsed" class="app-sidebar__footer">
      <Timer class="app-sidebar__timer" />
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useMainStore } from 'src/stores/main-store'
import { useVisitedTabsStore, isTabActiveForRoute } from 'src/stores/visited-tabs-store'
import Timer from 'src/components/ui/Timer.vue'

const SIDEBAR_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 72

const props = defineProps({
  drawer: {
    type: Boolean,
    default: () => true,
    required: false,
  },
})

const emit = defineEmits(['update:drawer'])

const $q = useQuasar()
const mainStore = useMainStore()
const visitedTabsStore = useVisitedTabsStore()
const { menus } = storeToRefs(mainStore)
const router = useRouter()
const route = useRoute()

const currentRouteName = ref(route.name)
const currentRouteMeta = ref(route.meta.groupName)
const sideBarDrawer = ref(props.drawer)
const collapsed = ref(false)
const openGroups = ref(new Set())

const isMobile = computed(() => $q.screen.xs || $q.screen.sm)
const isTablet = computed(() => $q.screen.md)

const drawerWidth = computed(() => (collapsed.value ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH))

const isActive = (routeName) => routeName != null && routeName === currentRouteName.value

const isOpen = (key) => openGroups.value.has(key)

const toggleGroup = (key) => {
  // Daraltılmış durumda bir grup tıklanırsa önce kenar çubuğunu genişletip grubu aç
  if (collapsed.value) {
    collapsed.value = false
    openGroups.value.add(key)
    openGroups.value = new Set(openGroups.value)
    return
  }
  const next = new Set(openGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openGroups.value = next
}

// Aktif route'a karşılık gelen menü gruplarını bul (sayfa yenilemede açık gelmesi için)
const syncActiveGroups = () => {
  const next = new Set(openGroups.value)
  menus.value.forEach((menu, i) => {
    if (menu.type !== 'dropdown') return
    let topActive = !!menu.name && menu.name === currentRouteMeta.value
    menu.subMenus?.forEach((item, j) => {
      if (item.type === 'dropdown') {
        const childActive = item.subMenus?.some(
          (sub) => sub.routeName === currentRouteName.value,
        )
        if (childActive) {
          next.add(`g${i}-${j}`)
          topActive = true
        }
      } else if (item.routeName === currentRouteName.value) {
        topActive = true
      }
    })
    if (topActive) next.add(`g${i}`)
  })
  openGroups.value = next
}

watch(
  () => route.name,
  (to) => {
    currentRouteName.value = to
    currentRouteMeta.value = route.meta.groupName
    syncActiveGroups()
  },
)

watch(
  () => props.drawer,
  (to) => {
    sideBarDrawer.value = to
  },
)

watch(sideBarDrawer, (to) => {
  emit('update:drawer', to)
})

watch(isTablet, (tablet) => {
  if (tablet) {
    collapsed.value = true
  }
})

const findActiveTabIndex = () =>
  visitedTabsStore.orderedTabs.findIndex((tab) => isTabActiveForRoute(tab, route))

const navigate = (menu) => {
  if (!menu.routeName) return

  const fromIndex = findActiveTabIndex()
  const tab = visitedTabsStore.openTab({
    routeName: menu.routeName,
    params: menu.params,
    title: menu.title,
    icon: menu.icon,
  })
  const toIndex = visitedTabsStore.getTabIndex(tab.id)

  if (fromIndex !== -1 && toIndex !== fromIndex) {
    visitedTabsStore.setPageTransition(toIndex > fromIndex ? 'forward' : 'backward')
  } else {
    visitedTabsStore.setPageTransition('forward')
  }

  router.push(
    menu.params ? { name: menu.routeName, params: menu.params } : { name: menu.routeName },
  )
}

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

syncActiveGroups()
</script>

<style  lang="scss">
.app-sidebar {
  --sidebar-bg: #1e293b;
  --sidebar-text: #ffffff;
  --sidebar-text-muted: #94a3b8;
  --sidebar-border: rgba(148, 163, 184, 0.1);
  --sidebar-primary-solid: #3b82f6;
  --sidebar-hover: rgba(255, 255, 255, 0.04);
  --sidebar-active-bg: rgba(59, 130, 246, 0.1);
  --sidebar-accent-width: 3px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--sidebar-bg);
  color: var(--sidebar-text-muted);
  border-right: 1px solid var(--sidebar-border);
  transition: width 0.2s ease;
}

.app-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.875rem;
  border-bottom: 1px solid var(--sidebar-border);
  height: 54px;
  min-height: 54px;
  max-height: 54px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.app-sidebar--collapsed .app-sidebar__header {
  padding: 0 0.5rem;
  gap: 0.25rem;
}

.app-sidebar__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  cursor: pointer;
}

.app-sidebar--collapsed .app-sidebar__logo {
  justify-content: center;
}

.app-sidebar__logo-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: var(--sidebar-primary-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.app-sidebar__logo-img {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
}

.app-sidebar__logo-full {
  max-width: 180px;
  max-height: 36px;
  object-fit: contain;
}

.app-sidebar__toggle {
  color: var(--sidebar-text-muted);

  &:hover {
    background: var(--sidebar-hover);
    color: var(--sidebar-text);
  }
}

.app-sidebar__nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  // Scrollbar çıktığında içerik genişliğinin daralmaması için gutter'ı her zaman ayır
  scrollbar-gutter: stable;
  padding: 0.625rem 0.625rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.2) transparent;
  cursor: pointer;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.2);
    border-radius: 999px;

    &:hover {
      background: rgba(148, 163, 184, 0.35);
    }
  }
}

.app-sidebar__menu-group {
  margin-bottom: 1px;
}

.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.4375rem 0.75rem;
  margin-bottom: 1px;
  border-radius: 0 8px 8px 0;
  border-left: var(--sidebar-accent-width) solid transparent;
  color: var(--sidebar-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  min-height: 34px;

  &:hover {
    background: var(--sidebar-hover);
    border-left-color: var(--sidebar-primary-solid);
    color: var(--sidebar-text);

    .app-sidebar__link-icon,
    .app-sidebar__expand-icon {
      color: var(--sidebar-text) !important;
    }
  }

  &--active {
    background: var(--sidebar-active-bg);
    border-left-color: var(--sidebar-primary-solid);
    color: var(--sidebar-text);

    .app-sidebar__link-icon {
      color: var(--sidebar-text);
      opacity: 1;
    }
  }

  &--collapsed-dropdown {
    width: 100%;
    justify-content: center;
  }
}

.app-sidebar--collapsed .app-sidebar__link {
  justify-content: center;
  padding: 0.4375rem;
}

.app-sidebar__link-icon {
  flex-shrink: 0;
  color: var(--sidebar-text-muted);
  opacity: 1;
  transition: color 0.15s ease;
}

.app-sidebar__link-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar__group-header {
  cursor: pointer;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
}

.app-sidebar__expand-icon {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--sidebar-text-muted) !important;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &--open {
    transform: rotate(180deg);
  }
}

.app-sidebar__submenu-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &--open {
    grid-template-rows: 1fr;
  }

  > .app-sidebar__submenu {
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-4px);
    transition:
      opacity 0.22s ease,
      transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &--open > .app-sidebar__submenu {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.04s;
  }

  &--nested {
    transition-duration: 0.24s;

    > .app-sidebar__submenu {
      transition-duration: 0.24s;
    }
  }
}

.app-sidebar__expansion {
  margin-bottom: 2px;
  border-radius: 8px;
  overflow: hidden;

  :deep(.q-expansion-item__container) {
    border-radius: 8px;
  }

  :deep(.q-expansion-item__toggle) {
    width: 100%;
    min-height: 34px;
    padding: 0 0.5rem 0 0.75rem;
  }

  :deep(.q-item) {
    min-height: 34px;
    padding: 0;
    color: var(--sidebar-text-muted);
  }

  :deep(.q-item__section--main) {
    flex: 1 1 auto;
    min-width: 0;
    padding-right: 0;
  }

  :deep(.q-item__section--side) {
    flex: 0 0 auto;
    padding-left: 0.5rem;
    margin-left: auto;
  }

  :deep(.q-focus-helper) {
    display: none;
  }

  &--active-group {
    :deep(.app-sidebar__expansion-header) {
      color: var(--sidebar-text) !important;
    }

    :deep(.app-sidebar__expand-icon) {
      color: var(--sidebar-text) !important;
    }
  }
}

.app-sidebar__expansion-header-inner {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.app-sidebar__expansion-header {
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--sidebar-text-muted) !important;
  background: transparent !important;

  &:hover {
    background: var(--sidebar-hover) !important;
    color: var(--sidebar-text) !important;
  }
}

.app-sidebar__expansion-title {
  flex: 1;
  min-width: 0;
  padding: 0.4375rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &--nested {
    font-size: 0.8125rem;
    font-weight: 600;
  }
}

.app-sidebar__submenu {
  padding: 0 0 0.25rem 0;
}

.app-sidebar__submenu--nested {
  padding-left: 0.75rem;
}

.app-sidebar__sublink {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  // Üst menü etiketiyle hizala (ikon + boşluk kadar içeriden)
  padding-left: calc(0.75rem + 18px + 0.625rem);
  margin-bottom: 1px;
  border-radius: 0 8px 8px 0;
  border-left: var(--sidebar-accent-width) solid transparent;
  color: var(--sidebar-text-muted);
  text-decoration: none;
  font-size: 0.8125rem;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  min-height: 30px;

  &:hover {
    background: var(--sidebar-hover);
    border-left-color: var(--sidebar-primary-solid);
    color: var(--sidebar-text);

    .app-sidebar__expand-icon {
      color: var(--sidebar-text) !important;
    }
  }

  &--active {
    background: var(--sidebar-active-bg);
    border-left-color: var(--sidebar-primary-solid);
    color: var(--sidebar-text);
  }
}

.app-sidebar__submenu--nested .app-sidebar__sublink {
  padding-left: calc(0.75rem + 18px + 0.75rem + 0.75rem);
}

.app-sidebar__sublink-icon {
  flex-shrink: 0;
  color: var(--sidebar-text-muted);
  opacity: 1;
  transition: color 0.15s ease;
}

.app-sidebar__footer {
  flex-shrink: 0;
  border-top: 1px solid var(--sidebar-border);
  padding: 0.5rem 0;

  :deep(.q-card) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  :deep(.sideBarBg) {
    background: transparent !important;
  }

  :deep(.footer-text) {
    color: var(--sidebar-text-muted) !important;
  }

  :deep(.q-btn) {
    color: var(--sidebar-text-muted);

    &:hover {
      color: var(--sidebar-text);
    }
  }
}

.app-sidebar__flyout {
  min-width: 220px;
}

.app-sidebar__flyout-list {
  background: var(--sidebar-bg);
  color: var(--sidebar-text-muted);
}

.app-sidebar__flyout-active {
  background: var(--sidebar-active-bg) !important;
  border-left: var(--sidebar-accent-width) solid var(--sidebar-primary-solid) !important;
  color: var(--sidebar-text) !important;
}

.app-sidebar__flyout-expansion {
  color: var(--sidebar-text-muted) !important;
}

.app-sidebar__timer {
  background: var(--sidebar-bg) !important;
}
</style>
