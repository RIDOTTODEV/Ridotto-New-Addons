<template>
  <div
    class="visited-tab-item"
    :class="{
      'visited-tab-item--active': active,
      'visited-tab-item--pinned': pinned || tab.pinned,
    }"
    role="tab"
    :aria-selected="active"
    @click="$emit('activate')"
    @contextmenu.prevent="contextMenu = true"
  >
    <div class="visited-tab-item__inner">
      <q-icon
        v-if="tab.icon"
        :name="tab.icon"
        size="14px"
        class="visited-tab-item__icon"
      />

      <span class="visited-tab-item__label">{{ $t(tab.title) }}</span>

      <button
        type="button"
        class="visited-tab-item__close"
        :aria-label="$t('closeTab')"
        @click.stop="$emit('close')"
      >
        <q-icon name="close" size="14px" />
      </button>
    </div>

    <q-menu
      v-model="contextMenu"
      context-menu
      anchor="bottom middle"
      self="top middle"
      class="visited-tab-item__menu"
    >
      <q-list dense class="visited-tab-item__menu-list">
        <q-item v-close-popup clickable @click="$emit('close')">
          <q-item-section avatar>
            <q-icon name="close" size="18px" />
          </q-item-section>
          <q-item-section>{{ $t('closeTab') }}</q-item-section>
        </q-item>

        <q-item v-close-popup clickable @click="$emit('toggle-pin')">
          <q-item-section avatar>
            <q-icon
              :name="tab.pinned ? 'push_pin' : 'o_push_pin'"
              size="18px"
            />
          </q-item-section>
          <q-item-section>{{ tab.pinned ? $t('unpinTab') : $t('pinTab') }}</q-item-section>
        </q-item>

        <q-item v-close-popup clickable @click="$emit('reload')">
          <q-item-section avatar>
            <q-icon name="refresh" size="18px" />
          </q-item-section>
          <q-item-section>{{ $t('reloadTab') }}</q-item-section>
        </q-item>

        <q-item v-close-popup clickable @click="$emit('open-in-new-window')">
          <q-item-section avatar>
            <q-icon name="open_in_new" size="18px" />
          </q-item-section>
          <q-item-section>{{ $t('openInNewWindow') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tab: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['activate', 'close', 'toggle-pin', 'reload', 'open-in-new-window'])

const contextMenu = ref(false)
</script>

<style scoped lang="scss">
.visited-tab-item {
  --tab-active-bg: #e8f0f6;
  --tab-active-color: #42627f;

  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  height: 32px;
  padding: 0 8px 0 12px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  border-radius: 6px;
  transition: background-color 0.15s ease;

  &:hover:not(.visited-tab-item--active) {
    background-color: #f3f4f6;
  }

  &--active {
    color: var(--tab-active-color);
    background: var(--tab-active-bg);
  }
}

.visited-tab-item__inner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

:global(.body--dark) .visited-tab-item {
  --tab-active-bg: rgba(66, 98, 127, 0.42);
  --tab-active-color: #b8d4e8;

  color: #cbd5e1;

  &:hover:not(.visited-tab-item--active) {
    background-color: rgba(255, 255, 255, 0.06);
  }
}

.visited-tab-item__icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.visited-tab-item--active .visited-tab-item__icon {
  color: var(--tab-active-color);
}

.visited-tab-item__label {
  font-size: 13px;
  line-height: 1;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.visited-tab-item__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 4px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  opacity: 0.55;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    opacity: 1;
    background-color: rgba(15, 34, 58, 0.08);
  }
}

.visited-tab-item--active .visited-tab-item__close {
  opacity: 0.75;
  color: var(--tab-active-color);

  &:hover {
    opacity: 1;
    background-color: rgba(66, 98, 127, 0.12);
  }
}

:global(.body--dark) .visited-tab-item__close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:global(.body--dark) .visited-tab-item--active .visited-tab-item__close:hover {
  background-color: rgba(66, 98, 127, 0.3);
}
</style>

<style lang="scss">
.visited-tab-item__menu-list {
  min-width: 180px;

  .q-item {
    min-height: 36px;
    font-size: 13px;
  }

  .q-item__section--avatar {
    min-width: 32px;
    padding-right: 4px;
    color: #6b7280;
  }
}

.body--dark .visited-tab-item__menu-list .q-item__section--avatar {
  color: #94a3b8;
}
</style>
