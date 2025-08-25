<template>
  <div class="row">
    <div class="col-12 q-pb-sm">
      <div class="text-caption">{{ $t('lastSearches') }}...</div>
    </div>
    <q-intersection
      v-for="(player, index) in lastSearchedPlayers"
      :key="index"
      transition="scale"
      class="col-12"
      once
    >
      <div
        :class="{
          'border-top': index === 0,
        }"
        class="text-subtitle2 q-pa-xs col-12 cursor-pointer flex justify-between border-bottom player-search-item"
        @click="redirectToPlayerDetail(player)"
      >
        {{ player.value }} -
        {{ player.id }}
        <q-icon class="q-ml-lg" size="xs" name="east" color="blue-grey-8" />
      </div>
    </q-intersection>
  </div>
</template>
<script setup>
defineProps({
  lastSearchedPlayers: {
    type: Array,
    required: true,
  },
  redirectToPlayerDetail: {
    type: Function,
    required: true,
  },
})
</script>
<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
