<template>
  <nav
    v-if="items.length"
    class="app-breadcrumb"
    aria-label="Breadcrumb"
  >
    <div class="app-breadcrumb__list">
      <div class="app-breadcrumb__item app-breadcrumb__item--parent">
        <component
          :is="parentNavigable ? 'router-link' : 'span'"
          :to="parentNavigable ? { name: parentItem.name } : undefined"
          class="app-breadcrumb__link"
          :class="{ 'app-breadcrumb__link--current': childItems.length === 0 }"
        >
          {{ $t(parentItem.name) }}
        </component>
      </div>

      <TransitionGroup
        name="breadcrumb-child"
        tag="div"
        class="app-breadcrumb__children"
      >
        <div
          v-for="(item, index) in childItems"
          :key="item.name"
          class="app-breadcrumb__segment"
        >
          <span class="app-breadcrumb__separator" aria-hidden="true">
            <q-icon name="chevron_right" size="14px" />
          </span>
          <component
            :is="isNavigable(item, index) ? 'router-link' : 'span'"
            :to="isNavigable(item, index) ? { name: item.name } : undefined"
            class="app-breadcrumb__link"
            :class="{ 'app-breadcrumb__link--current': index === childItems.length - 1 }"
          >
            {{ $t(item.name) }}
          </component>
        </div>
      </TransitionGroup>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const items = computed(() => {
  const breadcrumb = route.meta?.breadcrumb
  if (!Array.isArray(breadcrumb) || !breadcrumb.length) return []
  return breadcrumb
})

const parentItem = computed(() => items.value[0] ?? null)
const childItems = computed(() => items.value.slice(1))

const parentNavigable = computed(() => {
  if (!parentItem.value || childItems.value.length === 0) return false
  return router.hasRoute(parentItem.value.name)
})

const isNavigable = (item, index) => {
  if (index === childItems.value.length - 1) return false
  return router.hasRoute(item.name)
}
</script>

<style scoped lang="scss">
.app-breadcrumb {
  border-top: 1px solid rgba(15, 34, 58, 0.06);
  background: #fafbfc;
  padding: 0 16px;
  min-height: 36px;
  display: flex;
  align-items: center;
}

:global(.body--dark) .app-breadcrumb {
  background: #2a3038;
  border-top-color: rgba(255, 255, 255, 0.06);
}

.app-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  min-height: 36px;
  width: 100%;
}

.app-breadcrumb__children {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.app-breadcrumb__segment {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.app-breadcrumb__item {
  display: inline-flex;
  align-items: center;
}

.app-breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  color: #9ca3af;
  margin: 0 2px;
}

.app-breadcrumb__link {
  font-size: 13px;
  line-height: 1.2;
  color: #6b7280;
  text-decoration: none;
  padding: 4px 6px;
  border-radius: 4px;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover:not(.app-breadcrumb__link--current) {
    color: #42627f;
    background-color: rgba(66, 98, 127, 0.08);
  }

  &--current {
    color: #1f2937;
    font-weight: 600;
    cursor: default;
  }
}

:global(.body--dark) .app-breadcrumb__link {
  color: #94a3b8;

  &:hover:not(.app-breadcrumb__link--current) {
    color: #cbd5e1;
    background-color: rgba(255, 255, 255, 0.06);
  }

  &--current {
    color: #f1f5f9;
  }
}

:global(.body--dark) .app-breadcrumb__separator {
  color: #64748b;
}

.breadcrumb-child-enter-active,
.breadcrumb-child-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.breadcrumb-child-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb-child-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.breadcrumb-child-move {
  transition: transform 0.22s ease;
}

@media (prefers-reduced-motion: reduce) {
  .breadcrumb-child-enter-active,
  .breadcrumb-child-leave-active,
  .breadcrumb-child-move {
    transition: none;
  }
}
</style>
