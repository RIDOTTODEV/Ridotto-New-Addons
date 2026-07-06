<template>
  <router-view v-slot="{ Component, route: activeRoute }">
    <div class="app-page-transition">
      <transition :name="transitionName" @after-enter="onTransitionDone">
        <div
          v-if="Component"
          :key="activeRoute.fullPath"
          class="app-page-transition__view"
        >
          <component :is="Component" :key="pageComponentKey(activeRoute)" />
        </div>
      </transition>
    </div>
  </router-view>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useVisitedTabsStore } from 'src/stores/visited-tabs-store'

const router = useRouter()
const visitedTabsStore = useVisitedTabsStore()
const { pageTransitionDirection } = storeToRefs(visitedTabsStore)

const transitionName = computed(() =>
  pageTransitionDirection.value === 'backward' ? 'fade-in-left' : 'fade-in-out-right',
)

const pageComponentKey = (activeRoute) =>
  `${activeRoute.fullPath}-${visitedTabsStore.getRouteReloadKey(activeRoute.fullPath)}`

const onTransitionDone = () => {
  visitedTabsStore.clearPageTransition()
}

let removeGuard = null

onMounted(() => {
  removeGuard = router.beforeEach((to, from) => {
    if (to.fullPath === from.fullPath) return true
    if (!visitedTabsStore.pageTransitionDirection) {
      visitedTabsStore.setPageTransition('forward')
    }
    return true
  })
})

onUnmounted(() => {
  removeGuard?.()
})
</script>
