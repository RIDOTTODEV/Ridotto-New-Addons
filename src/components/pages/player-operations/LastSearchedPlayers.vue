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
        class="text-subtitle2 col-12 cursor-pointer flex justify-between border-bottom player-search-item"
      >
        <q-img
          width="40px"
          height="40px"
          fit="contain"
          class="latest-player-photo"
          :src="$playerPhotoUrl + player.id"
          :error-src="'/assets/no-photo.png'"
          :img-style="{
            borderRadius: '4px',
            objectFit: 'cover',
          }"
        />

        <div class="flex content-center items-center flex-col">
          <div
            class="text-subtitle2 text-capitalize text-grey-9"
            @click="redirectToPlayerDetail(player)"
          >
            {{ player.value }}
          </div>
          <div
            class="text-caption text-grey-7 flex content-center items-center"
            style="margin-top: -5px"
          >
            Player Id: {{ player.id }}
            <q-icon
              name="o_content_copy"
              class="q-ml-sm cursor-pointer my-icon"
              color="blue-grey-8"
              @click="copyPlayerId(player.id)"
            />
          </div>
        </div>
        <div class="flex content-center items-center" @click="redirectToPlayerDetail(player)">
          <q-icon class="q-ml-lg" size="xs" name="east" color="grey-6" />
        </div>
      </div>
    </q-intersection>
  </div>
</template>
<script setup>
import { useQuasar } from 'quasar'
const $q = useQuasar()
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
const copyPlayerId = (id) => {
  try {
    navigator.clipboard.writeText(id)
    $q.notify({
      message: 'Player ID copied to clipboard',
      color: 'positive',
      position: 'bottom-right',
      icon: 'fa fa-check',
      timeout: 500,
    })
  } catch {
    $q.notify({
      message: 'Player ID could not be copied to clipboard',
      color: 'negative',
    })
  }
}
</script>
<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.latest-player-photo {
  transition: transform 0.3s ease;
  cursor: pointer;
  width: 100%;
  height: 100%;

  border-radius: 4px;
  overflow: hidden;
}

.latest-player-photo:hover {
  transform: scale(4) translate(15px, 15px);
  z-index: 9999;
  position: relative;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
</style>
