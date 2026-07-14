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

<style lang="scss">
@import 'src/css/assets/_visitedtabitem.scss';
</style>
