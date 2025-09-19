<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    square
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 1200px">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          <q-icon name="content_copy" class="q-mr-sm" />
          {{ $t('copyHotelReservation') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md">
        <div class="row">
          <div class="col-6 flex justify-start">
            <div class="text-subtitle2">
              {{
                $t(
                  `Room: ${detail.roomNo} - ${detail?.players.find((p) => p.roomOwner)?.playerFullName} kaydından kopyalanıyor.`,
                )
              }}
            </div>
          </div>
          <div class="col-6 text-right q-mb-sm">
            <q-btn
              color="primary"
              no-caps
              :label="$t('addReservation')"
              icon="add"
              unelevated
              dense
              @click="onClickAddReservation"
            />
          </div>
        </div>
        <div class="col-12">
          <q-markup-table square separator="cell" class="no-box-shadow" style="height: 300px">
            <thead>
              <tr>
                <th class="bg-grey-2">No</th>
                <th class="bg-grey-2">Room No</th>
                <th class="bg-grey-2">Guest</th>
                <th class="bg-grey-2">Room Mates</th>
                <th class="bg-grey-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reservation, rIndex) in formValues.reservations" :key="rIndex">
                <td class="text-center">{{ rIndex + 1 }}.Reservation</td>
                <td>
                  <q-input
                    v-model="reservation.roomNo"
                    dense
                    outlined
                    class="super-small"
                    :rules="[(val) => !!val || $t('requiredField')]"
                    hide-bottom-space
                  />
                </td>
                <td>
                  <SearchPlayerInput
                    v-model="reservation.players[0].playerId"
                    :displayedValue="reservation.players[0].playerFullName"
                    :rules="[(val) => !!val || $t('requiredField')]"
                    @onSelectPlayer="(val) => onSelectGuest(val, rIndex)"
                    @onClear="onClearGuest(rIndex)"
                    optionLabel="value"
                    style="min-width: 100% !important"
                  />
                </td>
                <td>
                  <SearchPlayerInput
                    v-model="roomMateRef.playerId"
                    :displayedValue="roomMateRef?.playerFullName"
                    @onSelectPlayer="(val) => onSelectRoomMate(val, rIndex)"
                    @onClear="
                      () => {
                        roomMateRef.playerId = null
                        roomMateRef.playerFullName = null
                      }
                    "
                    optionLabel="value"
                    style="min-width: 100% !important"
                    :disable="formValues.reservations[0].players[0].playerId === null"
                  />
                  <q-list
                    bordered
                    separator
                    v-if="
                      formValues.reservations[rIndex].players.filter(
                        (p) => !p.roomOwner && p.playerId,
                      ).length > 0
                    "
                    class="q-mt-sm"
                  >
                    <q-item
                      v-for="(player, playerIndex) in formValues.reservations[
                        rIndex
                      ].players.filter((p) => !p.roomOwner)"
                      :key="player.playerId"
                      class="q-py-none q-px-sm bg-white"
                      dense
                    >
                      <q-item-section v-if="player.playerId">
                        <span class="text-capitalize"
                          ><span class="text-bold">{{ playerIndex + 1 }}.</span
                          >{{ player.playerFullName }}</span
                        >
                      </q-item-section>
                      <q-item-section side v-if="player.playerId">
                        <q-btn
                          flat
                          dense
                          round
                          color="negative"
                          icon="o_delete_forever"
                          @click="deleteRoomMate(player, rIndex, playerIndex)"
                        >
                          <q-tooltip class="text-subtitle2 bg-grey-3 text-dark">{{
                            $t('deleteRoomMate')
                          }}</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </td>
                <td class="text-center">
                  <q-btn
                    unelevated
                    dense
                    color="grey-2"
                    text-color="negative"
                    size="12px"
                    icon="fa-regular fa-trash-can"
                    class="q-mr-sm"
                    @click="onClickDeleteReservation(props.row)"
                  >
                    <q-tooltip class="text-subtitle2 bg-grey-3 text-dark">{{
                      $t('deleteReservation')
                    }}</q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12 text-right">
          <q-btn
            flat
            color="negative"
            :label="$t('cancel')"
            class="q-mr-sm"
            type="button"
            no-caps
            icon="close"
            @click="onDialogCancel"
          />
          <q-btn
            type="button"
            color="positive"
            :label="$t('save')"
            unelevated
            icon="save"
            no-caps
            @click="onSubmit"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { ref } from 'vue'
const $q = useQuasar()
const props = defineProps({
  hotelReservationId: {
    type: Number,
    required: true,
    default: () => null,
  },
  actionFn: {
    type: Function,
    required: true,
    default: () => null,
  },
  detail: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const formValues = ref({
  hotelReservationId: props.hotelReservationId,
  reservations: [
    {
      roomNo: null,
      players: [
        {
          playerId: null,
          playerFullName: null,
          roomOwner: false,
        },
      ],
    },
  ],
})

function onOKClick() {
  onDialogOK()
}

const onSubmit = async () => {
  const response = await props.actionFn({ ...formValues.value })
  if (response.status === 200) {
    onOKClick()
  } else {
    $q.notify({
      message: 'Reservasyonlar kopyalanırken bir hata oluştu',
      color: 'negative',
      position: 'bottom-right',
    })
  }
}

const onSelectGuest = (player, reservationIndex) => {
  if (player) {
    formValues.value.reservations[reservationIndex].players[0].playerId = player.id
    formValues.value.reservations[reservationIndex].players[0].playerFullName = player.value
    formValues.value.reservations[reservationIndex].players[0].roomOwner = true
  }
}

const roomMateRef = ref({
  playerId: null,
  playerFullName: null,
})
const onClearGuest = (reservationIndex) => {
  formValues.value.reservations[reservationIndex].players[0] = {
    playerId: null,
    playerFullName: null,
    roomOwner: false,
  }
}
const onSelectRoomMate = async (player, reservationIndex) => {
  const isGuestPlayer = formValues.value.reservations[reservationIndex].players.find(
    (item) => item.playerId === player.id,
  )
  if (isGuestPlayer) {
    $q.notify({
      message: 'Zaten misafir seçildi',
      color: 'negative',
    })
    return
  }

  roomMateRef.value.playerId = player.id
  roomMateRef.value.playerFullName = player.value
  formValues.value.reservations[reservationIndex].players.push({
    playerId: roomMateRef.value.playerId,
    playerFullName: roomMateRef.value.playerFullName,
    roomOwner: false,
  })
  roomMateRef.value.playerId = null
  roomMateRef.value.playerFullName = null
}

const onClickAddReservation = () => {
  formValues.value.reservations.unshift({
    roomNo: null,
    players: [{}],
  })
}

const onClickDeleteReservation = (reservationIndex) => {
  formValues.value.reservations.splice(reservationIndex, 1)
}
const deleteRoomMate = (player, reservationIndex, playerIndex) => {
  formValues.value.reservations[reservationIndex].players.splice(playerIndex, 1)
}
</script>

<style scoped lang="scss">
// Add any additional styling if needed
</style>
