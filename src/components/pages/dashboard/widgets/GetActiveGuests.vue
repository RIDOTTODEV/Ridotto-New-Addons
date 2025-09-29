<template>
  <q-card class="no-box-shadow">
    <div class="row bg-orange-2 flex justify-between">
      <div class="text-subtitle2">
        <q-icon
          name="o_hotel"
          size="18px"
          class="cursor-pointer q-ml-sm my-icon"
          color="blue-grey-8"
        />
        | {{ $t('activeGuests') }}
      </div>
      <div class="">
        <q-icon
          name="cached"
          size="18px"
          class="cursor-pointer q-mr-sm my-icon"
          color="blue-grey-8"
          @click="fetchActiveGuests"
        />
      </div>
    </div>
    <q-card-section class="q-pa-xs">
      <q-list data-cy="playerNotesList" v-if="activeGuests.length > 0">
        <q-item v-for="(guest, index) in activeGuests" :key="index" class="q-pa-none">
          <q-item-section avatar>
            <q-img
              :src="$playerPhotoUrl + guest.playerId"
              style="width: 30px; height: 30px"
              :img-style="{ borderRadius: '3px' }"
              error-src="/assets/no-photo.png"
            />
          </q-item-section>

          <q-item-section class="flex justify-start">
            <q-item-label class="text-caption wrap text-capitalize">
              <span class="text-bold q-mr-sm">{{ guest.playerFullName }}:</span>
              <span>
                {{ date.formatDate(guest.checkIn, 'DD.MM.YYYY HH:mm') }}
              </span>
              <span class="q-mx-sm">-</span>
              <span class="">
                {{ date.formatDate(guest.checkOut, 'DD.MM.YYYY HH:mm') }}
              </span>
            </q-item-label>
            <q-item-label caption class="flex justify-start comment-caption">
              {{ guest.createdByName }} |
              {{ date.formatDate(guest.createdAt, 'DD.MM.YYYY HH:mm') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else>
        <div class="bg-grey-1 q-pa-xs q-radius-sm">
          <div class="text-grey text-center">
            <q-icon name="o_hotel" size="24px" />
            <div>No active guests found</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
const guestManagementStore = useGuestManagementStore()
const emits = defineEmits(['guestsLength'])
const activeGuests = ref([])

const fetchActiveGuests = async () => {
  const data = await guestManagementStore.fetchActiveGuests({
    maxResultCount: 10,
  })
  activeGuests.value = data || []
  emits('guestsLength', activeGuests.value.length)
}

onMounted(() => {
  fetchActiveGuests()
})
</script>

<style scoped></style>
