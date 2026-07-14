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
                  class="app-sidebar__sublink app-sidebar__group-header app-sidebar__tree-item app-sidebar__tree-item--level-1"
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
                      class="app-sidebar__sublink app-sidebar__tree-item app-sidebar__tree-item--level-2"
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
                class="app-sidebar__sublink app-sidebar__tree-item app-sidebar__tree-item--level-1"
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

<style lang="scss">
@import 'src/css/assets/_sidebar.scss';
</style>
