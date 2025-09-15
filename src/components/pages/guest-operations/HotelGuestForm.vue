<template>
  <div class="col-12">
    <q-form @submit="onSubmit" class="row">
      <div class="col-3 q-pa-sm">
        <fieldset name="Player" class="full-width">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_person" size="xs" color="grey-9" class="q-mr-sm" />
            {{ $t('guestName') }}
          </legend>
          <div class="col-12 q-pa-sm">
            <SearchPlayerInput
              v-model="hotelGuestFormValues.players[0].playerId"
              :displayedValue="hotelGuestFormValues.players[0].playerFullName"
              :rules="[(val) => !!val || $t('requiredField')]"
              @onSelectPlayer="onSelectGuest"
              @onClear="onClearGuest"
              optionLabel="value"
              style="min-width: 100% !important"
            />
          </div>
        </fieldset>

        <fieldset name="VisitorCategory" class="q-mt-sm">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_category" size="xs" color="grey-9" class="q-mr-sm" />
            {{ $t('visitorCategory') }}
          </legend>
          <div class="row">
            <div class="col-12 q-pa-sm">
              <q-select
                v-model="hotelGuestFormValues.players[0].playerCategoryId"
                outlined
                dense
                class="super-small"
                :options="visitorCategories"
                map-options
                emit-value
                option-label="name"
                option-value="id"
                @update:model-value="onSelectVisitorCategory"
              />
            </div>
          </div>
        </fieldset>

        <fieldset name="RoomMate" class="q-mt-sm">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_person" size="xs" color="grey-9" class="q-mr-sm" />
            {{ $t('roomMate') }}
          </legend>
          <div class="row">
            <div class="col-12 q-pa-sm">
              <SearchPlayerInput
                v-model="roomMateRef.playerId"
                :displayedValue="roomMateRef?.playerFullName"
                @onSelectPlayer="onSelectRoomMate"
                @onClear="
                  () => {
                    roomMateRef.playerId = null
                    roomMateRef.playerFullName = null
                  }
                "
                optionLabel="value"
                style="min-width: 100% !important"
                :disable="hotelGuestFormValues.players[0].playerId === null"
              />
            </div>
            <div
              class="col-12 q-mt-sm"
              v-if="hotelGuestFormValues.players.filter((p) => !p.roomOwner)?.length >= 1"
            >
              <q-list bordered separator>
                <div
                  v-for="player in hotelGuestFormValues.players.filter((p) => !p.roomOwner)"
                  :key="player.playerId"
                >
                  <q-item v-if="player.playerId" class="q-py-sm q-px-sm bg-white">
                    <q-item-section>
                      {{ player.playerFullName }}
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        dense
                        round
                        color="negative"
                        icon="o_delete_forever"
                        @click="deleteRoomMate(player)"
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </q-list>
            </div>
          </div>
        </fieldset>
        <!--         <fieldset name="Others" class="q-mt-sm">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_settings" size="xs" color="grey-9" class="q-mr-sm" />
            {{ $t('otherOptions') }}
          </legend>

          <div class="row">
            <q-checkbox v-model="hotelGuestFormValues.phone" :label="$t('phone')" class="col-6" />
            <q-checkbox
              v-model="hotelGuestFormValues.minibar"
              :label="$t('minibar')"
              class="col-6"
            />
            <q-checkbox v-model="hotelGuestFormValues.spa" :label="$t('spa')" class="col-6" />
            <q-checkbox v-model="hotelGuestFormValues.fb" :label="$t('fb')" class="col-6" />
            <q-checkbox
              v-model="hotelGuestFormValues.hotelFlightInfo.expenseUse"
              :label="$t('expenseUse')"
              class="col-12"
            />
          </div>
        </fieldset> -->
        <fieldset name="Status" class="q-mt-sm">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_done" size="xs" color="grey-9" class="q-mr-sm" />
            {{ $t('status') }}
          </legend>
          <div class="row">
            <div class="col-12 q-pa-sm">
              <q-select
                v-model="hotelGuestFormValues.status"
                :options="statuses"
                :rules="[(val) => !!val]"
                map-options
                emit-value
                option-label="label"
                option-value="value"
                outlined
                dense
                bg-color="white"
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div class="col-5 q-pa-sm">
        <fieldset name="ReservationDetails" class="reservation-details-fieldset">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_hotel" size="sm" color="grey-9" class="q-mr-sm" />
            {{ $t('reservationDetails') }}
            <q-btn
              v-if="hotelGuestFormValues.id"
              flat
              dense
              round
              :color="isEditingReservationDetails ? 'negative' : 'primary'"
              icon="o_edit"
              @click="toggleEditMode"
              size="sm"
              class="q-ml-sm"
            >
              <q-tooltip class="bg-blue-grey-8 text-subtitle2"
                >{{ isEditingReservationDetails ? $t('lock') : $t('edit') }}
              </q-tooltip>
            </q-btn>
          </legend>
          <div
            class="row"
            :class="{
              'disabled-fieldset': !isEditingReservationDetails && hotelGuestFormValues.id,
            }"
          >
            <div class="col-6 q-pa-sm q-gutter-sm">
              <div class="">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  <q-icon name="o_calendar_month" size="xs" color="grey-9" />
                  {{ $t('checkIn') }}
                </div>
                <el-date-picker
                  v-model="hotelGuestFormValues.hotelFlightInfo.checkIn"
                  type="datetime"
                  size="default"
                  format="DD.MM.YYYY HH:mm"
                  date-format="MMM DD, YYYY"
                  time-format="HH:mm"
                  :disabled="hotelGuestFormValues.id && !isEditingReservationDetails"
                  style="width: 100%"
                  @update:model-value="onSelectCheckInAndCheckOut"
                />
              </div>

              <div class="">
                <div class="text-subtitle2 q-mb-xs text-grey-8 flex content-center items-center">
                  <q-icon name="o_calendar_month" size="xs" color="grey-9" />
                  {{ $t('checkOut') }}
                </div>
                <el-date-picker
                  v-model="hotelGuestFormValues.hotelFlightInfo.checkOut"
                  type="datetime"
                  size="default"
                  format="DD.MM.YYYY HH:mm"
                  date-format="MMM DD, YYYY"
                  time-format="HH:mm"
                  :disabled="hotelGuestFormValues.id && !isEditingReservationDetails"
                  style="width: 100%"
                  @update:model-value="onSelectCheckInAndCheckOut"
                />
              </div>

              <div class="">
                <div class="text-subtitle2 text-grey-8">
                  {{ $t('roomType') }}
                </div>
                <q-select
                  v-model="hotelGuestFormValues.hotelFlightInfo.roomTypeId"
                  :options="roomTypes"
                  outlined
                  dense
                  class="super-small"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                  @update:model-value="onChangeRoomType"
                  map-options
                  emit-value
                  option-label="name"
                  option-value="id"
                  hide-bottom-space
                  bg-color="white"
                  :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                />
              </div>

              <div class="">
                <div class="text-subtitle2 text-grey-8">
                  {{ $t('roomNo') }}
                </div>
                <q-input
                  v-model="hotelGuestFormValues.hotelFlightInfo.roomNo"
                  dense
                  outlined
                  class="super-small"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                  hide-bottom-space
                  bg-color="white"
                  :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                />
              </div>

              <!--               <div class="">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('boardType') }}
                </div>
                <q-select
                  v-model="hotelGuestFormValues.hotelFlightInfo.boardType"
                  :options="boardTypes"
                  outlined
                  dense
                  class="super-small"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                  map-options
                  emit-value
                  option-label="label"
                  option-value="value"
                  bg-color="white"
                  clearable
                  :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                />
              </div> -->
              <div class="">
                <div class="row">
                  <div class="col-12 q-pa-xs flex justify-start content-center items-center">
                    <div class="text-subtitle2 text-secondary">
                      {{ hotelGuestFormValues.hotelFlightInfo.dayCount || 1 }}
                      {{ $t('days') }}
                    </div>
                  </div>
                  <div class="col-12 q-pa-xs">
                    <div class="text-subtitle2 text-grey-8">
                      {{ $t('roomPrice') }}
                    </div>
                    <q-currency-input
                      currency="USD"
                      v-model="hotelGuestFormValues.hotelFlightInfo.roomPrice"
                      dense
                      outlined
                      class="super-small"
                      :debounce="1000"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      bg-color="white"
                      :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                    />
                  </div>
                  <div class="col-12 q-pa-xs">
                    <div class="text-subtitle2 text-grey-8">
                      {{ $t('total') }}
                    </div>
                    <q-currency-input
                      currency="USD"
                      v-model="hotelGuestFormValues.hotelFlightInfo.roomTotalPrice"
                      dense
                      outlined
                      class="super-small"
                      :debounce="1000"
                      bg-color="white"
                      :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 q-pa-sm q-gutter-sm q-mt-md">
              <div class="flex items-center content-center justify-between">
                <div class="row items-center content-center">
                  <q-checkbox
                    v-model="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                    dense
                    outlined
                    class="super-small"
                    :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                    hide-bottom-space
                    bg-color="white"
                    :true-value="true"
                    :false-value="false"
                    @update:model-value="onChangeIsWalkIn"
                  />
                  <div class="text-subtitle2 text-grey-8 q-ml-sm">
                    {{ $t('isWalkIn') }}
                  </div>
                </div>
                <div class="row items-center content-center">
                  <q-checkbox
                    v-model="hotelGuestFormValues.hotelFlightInfo.isTransfer"
                    dense
                    outlined
                    class="super-small"
                    :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                    hide-bottom-space
                    bg-color="white"
                    :true-value="true"
                    :false-value="false"
                    @update:model-value="onChangeIsWalkIn"
                  />
                  <div class="text-subtitle2 text-grey-8 q-ml-sm">
                    {{ $t('isTransfer') }}
                  </div>
                </div>
              </div>
              <div class="">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('ticketType') }}
                </div>
                <q-select
                  v-model="hotelGuestFormValues.hotelFlightInfo.ticketType"
                  :options="flightTicketTypes"
                  outlined
                  dense
                  class="super-small"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                  map-options
                  emit-value
                  option-label="label"
                  option-value="value"
                  bg-color="white"
                  :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                />
              </div>
              <div class=" ">
                <div class="row q-gutter-x-sm">
                  <div class="col">
                    <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                      {{ $t('from') }}
                    </div>
                    <q-input
                      v-model="hotelGuestFormValues.hotelFlightInfo.from"
                      dense
                      outlined
                      class="super-small"
                      :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                      hide-bottom-space
                      bg-color="white"
                      :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                    />
                  </div>
                  <div class="col">
                    <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                      {{ $t('to') }}
                    </div>
                    <q-input
                      v-model="hotelGuestFormValues.hotelFlightInfo.to"
                      dense
                      outlined
                      class="super-small"
                      :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                      hide-bottom-space
                      bg-color="white"
                      :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                    />
                  </div>
                </div>
              </div>

              <div class="">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('flightTicketPrice') }}
                </div>
                <q-input
                  v-model.number="hotelGuestFormValues.hotelFlightInfo.flightTicketPrice"
                  type="number"
                  dense
                  outlined
                  class="super-small"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                  hide-bottom-space
                  bg-color="white"
                  :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                />
              </div>
              <div class="flex items-center content-center">
                <div class="row items-center content-center q-mt-sm">
                  <q-rating
                    v-model="hotelGuestFormValues.hotelFlightInfo.isBusiness"
                    :max="1"
                    icon="star_border"
                    color="deep-purple"
                    class="super-small q-mr-sm"
                    icon-selected="star"
                    size="24px"
                    :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                    hide-bottom-space
                    bg-color="white"
                  />
                  <div class="text-subtitle2 text-grey-8">
                    {{ $t('isBusiness') }}
                  </div>
                </div>
              </div>
              <div class="q-mb-sm" v-if="isEditingReservationDetails && hotelGuestFormValues.id">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('flightTicketReturnPrice') }}
                </div>
                <q-input
                  v-model.number="hotelGuestFormValues.flightTicketReturnPrice"
                  type="text"
                  dense
                  outlined
                  bg-color="white"
                  class="super-small no-spinner"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                  :readonly="hotelGuestFormValues.hotelFlightInfo.isWalkIn"
                  @input="
                    (val) => {
                      const numVal = parseFloat(val.replace(',', '.'))
                      if (!isNaN(numVal)) {
                        hotelGuestFormValues.flightTicketReturnPrice = numVal
                      }
                    }
                  "
                />
              </div>
            </div>

            <div class="col-12 row">
              <div class="col-6 q-pa-sm">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('note') }}
                </div>
                <q-input
                  v-model="hotelGuestFormValues.note"
                  outlined
                  class="custom-textarea"
                  type="textarea"
                  rows="6"
                  autogrow
                  bg-color="white"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                />
              </div>
              <div class="col-6 q-pa-sm">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('remark') }}
                </div>
                <q-input
                  v-model="hotelGuestFormValues.remark"
                  outlined
                  class="custom-textarea"
                  type="textarea"
                  rows="6"
                  autogrow
                  bg-color="white"
                  :disable="hotelGuestFormValues.id && !isEditingReservationDetails"
                />
              </div>
            </div>
          </div>

          <div v-if="hotelGuestFormValues.id && isEditingReservationDetails" class="row q-mt-md">
            <div class="col-12 text-right q-gutter-sm">
              <q-btn
                unelevated
                icon="close"
                color="grey"
                size="md"
                :label="$t('cancel')"
                @click="toggleEditMode"
                no-caps
                flat
              />
              <q-btn
                unelevated
                icon="check"
                color="positive"
                size="md"
                :label="$t('update')"
                @click="updateReservationDetails"
                no-caps
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div class="col-4 q-pa-sm">
        <fieldset name="ExpenseParameters" class="expense-parameters-fieldset">
          <legend class="flex content-center items-center text-subtitle2 text-grey-9">
            <q-icon name="o_receipt" size="sm" color="grey-9" />
            {{ $t('expenseParameters') }}
          </legend>

          <div class="q-pa-sm">
            <div class="row">
              <div class="col-8">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('expenseParameter') }}
                </div>
                <q-select
                  v-model="selectedExpenseParameter"
                  :options="expenseParameters"
                  outlined
                  dense
                  class="super-small"
                  option-label="name"
                  clearable
                  @update:model-value="onSelectExpenseParameter"
                />
              </div>
              <div class="col-4 flex content-end items-end">
                <q-btn
                  dense
                  icon="add"
                  color="blue-grey-8"
                  size="14px"
                  :label="$t('addExpense')"
                  outline
                  @click="addExpenseToList"
                  unelevated
                  no-caps
                  no-wrap
                  class="q-ml-sm"
                >
                </q-btn>
              </div>
            </div>
            <div class="row q-gutter-x-sm">
              <div class="col">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('quantity') }}
                </div>
                <q-input
                  v-model.number="newExpenseEntry.quantity"
                  type="number"
                  dense
                  outlined
                  class="super-small"
                  min="1"
                />
              </div>
              <div class="col">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('unitPrice') }}
                </div>
                <q-currency-input
                  v-model="newExpenseEntry.value"
                  currency="USD"
                  :debounce="1000"
                  dense
                  outlined
                  class="super-small"
                />
              </div>
              <div class="col">
                <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                  {{ $t('total') }}
                </div>
                <q-currency-input
                  v-model="newExpenseEntry.amount"
                  currency="USD"
                  dense
                  outlined
                  class="super-small"
                  :debounce="1000"
                  @update:model-value="
                    (val) => {
                      if (newExpenseEntry.quantity > 0) {
                        newExpenseEntry.value = val / newExpenseEntry.quantity
                      }
                    }
                  "
                />
              </div>
            </div>
          </div>
          <q-scroll-area style="height: 500px; width: 100%">
            <div class="row" v-for="(expense, index) in hotelGuestFormValues.expenses" :key="index">
              <div class="row q-pa-sm">
                <div class="bg-grey-1 q-card--bordered q-pa-xs">
                  <div class="row">
                    <div class="col-6 text-subtitle2 text-negative" v-if="expense.expenseTypeName">
                      {{ expense.expenseTypeName }} <span>*</span>
                    </div>
                    <div
                      class="col-6 text-right text-subtitle2 text-grey-8 flex content-center items-center justify-end"
                      v-if="expense.playerName"
                    >
                      <q-icon name="o_person" size="16px" color="grey-8" />
                      {{ expense.playerName }}
                    </div>
                  </div>
                  <div class="row q-gutter-x-sm">
                    <div class="col">
                      <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                        {{ $t('quantity') }}
                      </div>
                      <q-currency-input
                        v-model="expense.quantity"
                        currency="USD"
                        :debounce="1000"
                        dense
                        outlined
                        class="text-center super-small"
                        disable
                        bg-color="white"
                      />
                    </div>
                    <div class="col">
                      <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                        {{ $t('unitPrice') }}
                      </div>
                      <q-currency-input
                        v-model="expense.value"
                        currency="USD"
                        :debounce="1000"
                        dense
                        outlined
                        class="text-center super-small"
                        disable
                        bg-color="white"
                      />
                    </div>
                    <div class="col">
                      <div class="text-subtitle2 text-grey-8 flex content-center items-center">
                        {{ $t('total') }}
                      </div>
                      <q-currency-input
                        v-model="expense.amount"
                        currency="USD"
                        :debounce="1000"
                        dense
                        outlined
                        class="text-weight-bold text-center super-small"
                        disable
                        bg-color="white"
                      />
                    </div>
                    <div class="col-1 flex content-end items-end">
                      <q-btn
                        dense
                        color="negative"
                        icon="delete_forever"
                        size="14px"
                        outline
                        unelevated
                        bg-color="white"
                        @click="onDeleteExpense(expense, index)"
                      >
                        <q-tooltip class="bg-blue-grey-8 text-subtitle2">{{
                          $t('delete')
                        }}</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-scroll-area>
          <div v-if="hotelGuestFormValues.expenses?.length">
            <div class="q-mt-sm q-pa-sm rounded-borders">
              <div class="text-right">
                <div
                  class="text-subtitle1 text-weight-bold text-green-8 flex content-center items-center justify-end"
                >
                  {{ $t('totalAmount') }}:
                  <span class="q-ml-sm">{{ formatPrice(calculateGrandTotal()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="col-12 q-mt-md text-right">
        <q-btn
          unelevated
          icon="close"
          color="negative"
          size="md"
          :label="$t('cancel')"
          class="col-12 q-mr-md"
          type="button"
          flat
          no-caps
          @click="emits('close')"
        />
        <q-btn
          unelevated
          icon="save"
          color="deep-purple"
          size="md"
          :label="$t('save')"
          class="col-12"
          type="submit"
          no-caps
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import { date, useQuasar } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
const emits = defineEmits(['close'])
const props = defineProps({
  formValues: {
    type: Object,
    required: false,
    default: () => null,
  },
})

const guestManagementStore = useGuestManagementStore()
const {
  flightTicketTypes,
  // boardTypes,
  roomTypes,
  visitorCategories,
  expenseParameters,
} = storeToRefs(guestManagementStore)
const $q = useQuasar()
const statuses = ref([])
onMounted(async () => {
  await guestManagementStore.getHotelReservationStatuses().then((res) => {
    statuses.value = res
  })
})
const hotelGuestFormValues = ref({
  players: [
    {
      hotelReservationId: 0,
      playerId: null,
      playerFullName: '',
      playerCategoryId: null,
      playerCategoryName: null,
      roomOwner: false,
    },
  ],
  status: 'Pending',
  hotelFlightInfo: {
    checkIn: '',
    checkOut: '',
    dayCount: 1,
    roomTypeId: null,
    roomType: '',
    roomNo: null,
    boardType: 'BB',
    roomPrice: 0,
    roomTotalPrice: 0,
    ticketType: 'Casino',
    from: '',
    to: '',

    flightTicketPrice: 0,
    isBusiness: 0,
    isWalkIn: false,
    isTransfer: false,
  },
  note: '',
  remark: '',
  phone: true,

  expenses: [],
})
const roomMateRef = ref({
  playerId: null,
  playerFullName: null,
})
const isEditingReservationDetails = ref(false)
const onSubmit = async () => {
  let data = { ...hotelGuestFormValues.value }
  data.hotelFlightInfo.isBusiness = data.hotelFlightInfo.isBusiness === 1 ? true : false
  if (!data.id) {
    const response = await guestManagementStore.createHotelReservation(data)
    if (response) {
      $q.notify({
        message: 'Rezervasyon başarıyla oluşturuldu',
        color: 'positive',
      })
      emits('close')
    }
  } else {
    const updateData = {
      hotelReservationId: data.id,
      status: data.status || 'Pending',
      note: data.note || '',
      remark: data.remark || '',
      phone: data.phone || false,
      minibar: data.minibar || false,
      spa: data.spa || false,
      fb: data.fb || false,
    }
    const response = await guestManagementStore.updateHotelReservation(updateData)
    if (response) {
      $q.notify({
        message: 'Rezervasyon başarıyla güncellendi',
        color: 'positive',
      })
    }
    emits('close')
  }
}

const onSelectGuest = async (player) => {
  if (hotelGuestFormValues.value.id && player) {
    if (
      !hotelGuestFormValues.value.players[0]?.playerCategoryId ||
      !hotelGuestFormValues.value.players[0]?.playerCategoryName
    ) {
      $q.notify({
        message: 'Müşteri kategorisi seçilmedi',
        type: 'negative',
        position: 'bottom-right',
      })
      return
    }
    const addGuestPlayerResponse = await guestManagementStore.addHotelReservationPlayer({
      hotelReservationId: hotelGuestFormValues.value.id,
      playerId: player.id,
      playerFullName: player.value,
      playerCategoryId: hotelGuestFormValues.value.players[0].playerCategoryId,
      playerCategoryName: hotelGuestFormValues.value.players[0].playerCategoryName,
      roomOwner: true,
    })
    if (addGuestPlayerResponse.status === 200) {
      $q.notify({
        message: 'Müşteri başarıyla eklendi',
        type: 'positive',
        position: 'bottom-right',
      })
    } else {
      $q.notify({
        message: 'Müşteri eklenirken bir hata oluştu',
        type: 'negative',
        position: 'bottom-right',
      })
    }
  }
  if (player) {
    hotelGuestFormValues.value.players[0].playerId = player.id
    hotelGuestFormValues.value.players[0].playerFullName = player.value
    hotelGuestFormValues.value.players[0].roomOwner = true
  }
  /*   else {
    hotelGuestFormValues.value.players[0].playerId = null
    hotelGuestFormValues.value.players[0].playerFullName = ''
    hotelGuestFormValues.value.players[0].roomOwner = false
  } */
}

const onClearGuest = async () => {
  if (hotelGuestFormValues.value.id) {
    $q.dialog({
      title: 'Misafir değiştirme',
      message: 'Misafiri değiştirmek istediğinize emin misiniz?',
      color: 'negative',
      ok: {
        flat: true,
        color: 'negative',
        label: 'Evet',
        noCaps: true,
      },
    }).onOk(async () => {
      const response = await guestManagementStore.deleteHotelReservationPlayer({
        hotelReservationId: hotelGuestFormValues.value.id,
        playerId: hotelGuestFormValues.value.players[0].playerId,
      })
      if (response.status === 200) {
        $q.notify({
          message: 'Misafir başarıyla değiştirildi',
          type: 'positive',
          position: 'bottom-right',
        })
      }
      hotelGuestFormValues.value.players[0].playerId = null
      hotelGuestFormValues.value.players[0].playerFullName = ''
    })
    return
  }
  hotelGuestFormValues.value.players[0].playerId = null
  hotelGuestFormValues.value.players[0].playerFullName = ''
}

const onSelectVisitorCategory = (args) => {
  const category = visitorCategories.value.find((item) => +item.id === +args)
  if (hotelGuestFormValues.value.players && hotelGuestFormValues.value.players.length) {
    hotelGuestFormValues.value.players.forEach((player) => {
      player.playerCategoryName = category.name || ''
      player.playerCategoryId = category.id || null
    })
  }
}

const onSelectRoomMate = async (player) => {
  const isGuestPlayer = hotelGuestFormValues.value.players.find(
    (item) => item.playerId === player.id,
  )
  if (isGuestPlayer) {
    $q.notify({
      message: 'Zaten misafir seçildi',
      color: 'negative',
    })
    return
  }
  if (hotelGuestFormValues.value.id) {
    $q.loading.show({
      message: 'Oda arkadaşı ekleniyor...',
    })
    const response = await guestManagementStore.addHotelReservationPlayer({
      hotelReservationId: hotelGuestFormValues.value.id,
      playerId: player.id,
      playerFullName: player.value,
      playerCategoryId: hotelGuestFormValues.value.players[0].playerCategoryId,
      playerCategoryName: hotelGuestFormValues.value.players[0].playerCategoryName,
      roomOwner: false,
    })

    if (response.status === 200) {
      $q.loading.hide()
      hotelGuestFormValues.value.players.push({
        playerId: player.id,
        playerFullName: player.value,
        playerCategoryId: hotelGuestFormValues.value.players[0].playerCategoryId,
        playerCategoryName: hotelGuestFormValues.value.players[0].playerCategoryName,
        roomOwner: false,
      })
      $q.notify({
        message: 'Oda arkadaşı başarıyla eklendi',
        type: 'positive',
        position: 'bottom-right',
      })
    } else {
      $q.loading.hide()
      $q.notify({
        message: 'Oda arkadaşı eklenirken bir hata oluştu',
        type: 'negative',
        position: 'bottom-right',
      })
    }
    return
  }
  roomMateRef.value.playerId = player.id
  roomMateRef.value.playerFullName = player.value
  hotelGuestFormValues.value.players.push({
    playerId: roomMateRef.value.playerId,
    playerFullName: roomMateRef.value.playerFullName,
    playerCategoryId: hotelGuestFormValues.value.players[0].playerCategoryId,
    playerCategoryName: hotelGuestFormValues.value.players[0].playerCategoryName,
    roomOwner: false,
  })
  roomMateRef.value.playerId = null
  roomMateRef.value.playerFullName = null
}

const deleteRoomMate = async (player) => {
  if (hotelGuestFormValues.value.id) {
    $q.dialog({
      title: 'Oda arkadaşı silme',
      message: 'Oda arkadaşı silmek istediğinize emin misiniz?',
      color: 'negative',
      ok: {
        flat: true,
        color: 'negative',
        label: 'Evet',
        noCaps: true,
      },
      cancel: {
        flat: true,
        color: 'primary',
        label: 'Hayır',
        noCaps: true,
        focus: true,
      },
      persistent: true,
    }).onOk(async () => {
      $q.loading.show({
        message: 'Oda arkadaşı siliniyor...',
      })
      const response = await guestManagementStore.deleteHotelReservationPlayer({
        hotelReservationId: hotelGuestFormValues.value.id,
        playerId: player.playerId,
      })
      if (response.status === 200) {
        $q.loading.hide()
        $q.notify({
          message: 'Oda arkadaşı başarıyla silindi',
          type: 'positive',
          position: 'bottom-right',
        })
        hotelGuestFormValues.value.players = hotelGuestFormValues.value.players.filter(
          (item) => item.playerId !== player.playerId,
        )
      } else {
        $q.loading.hide()
        $q.notify({
          message: 'Oda arkadaşı silinirken bir hata oluştu',
          type: 'negative',
          position: 'bottom-right',
        })
      }
    })
  } else {
    hotelGuestFormValues.value.players = hotelGuestFormValues.value.players.filter(
      (item) => item.playerId !== player.playerId,
    )
  }
}

const toggleEditMode = () => {
  isEditingReservationDetails.value = !isEditingReservationDetails.value
}

const updateReservationDetails = async () => {
  $q.loading.show({
    message: 'Rezervasyon güncelleniyor...',
  })
  isEditingReservationDetails.value = false
  let formData = {
    hotelReservationId: hotelGuestFormValues.value.id,
    hotelFlightInfo: {
      checkIn: hotelGuestFormValues.value.hotelFlightInfo.checkIn,
      checkOut: hotelGuestFormValues.value.hotelFlightInfo.checkOut,
      dayCount: hotelGuestFormValues.value.hotelFlightInfo.dayCount,
      roomTypeId: hotelGuestFormValues.value.hotelFlightInfo.roomTypeId,
      roomType: hotelGuestFormValues.value.hotelFlightInfo.roomType,
      roomNo: hotelGuestFormValues.value.hotelFlightInfo.roomNo,
      boardType: hotelGuestFormValues.value.hotelFlightInfo.boardType,
      roomPrice: hotelGuestFormValues.value.hotelFlightInfo.roomPrice,
      roomTotalPrice: hotelGuestFormValues.value.hotelFlightInfo.roomTotalPrice,
      ticketType: hotelGuestFormValues.value.hotelFlightInfo.ticketType,
      from: hotelGuestFormValues.value.hotelFlightInfo.from,
      to: hotelGuestFormValues.value.hotelFlightInfo.to,

      flightTicketPrice: hotelGuestFormValues.value.hotelFlightInfo.flightTicketPrice,
      isBusiness: hotelGuestFormValues.value.hotelFlightInfo.isBusiness === 1 ? true : false,
      isWalkIn: hotelGuestFormValues.value.hotelFlightInfo.isWalkIn,
      expenseUse: hotelGuestFormValues.value.hotelFlightInfo.expenseUse,
      isTransfer: hotelGuestFormValues.value.hotelFlightInfo.isTransfer,
    },
  }
  const response = await guestManagementStore.updateHotelFlightInfoNew(formData)
  if (response) {
    fetchReservationExpenses(hotelGuestFormValues.value.id)
    $q.loading.hide()
    $q.notify({
      message: 'Rezervasyon başarıyla güncellendi',
      type: 'positive',
      position: 'bottom-right',
    })
  } else {
    $q.loading.hide()
    $q.notify({
      message: 'Rezervasyon güncellenirken bir hata oluştu',
      type: 'negative',
      position: 'bottom-right',
    })
  }
  //emits('close')
}

const selectedExpenseParameter = ref(null)

const newExpenseEntry = ref({
  quantity: 1,
  value: 0,
  amount: 0,
})

const addExpenseToList = async () => {
  if (!selectedExpenseParameter.value) return

  if (hotelGuestFormValues.value.id) {
    $q.loading.show({
      message: 'Gider ekleniyor...',
    })
    const apiData = {
      hotelReservationId: hotelGuestFormValues.value.id,
      expense: {
        playerId: hotelGuestFormValues.value.players?.[0]?.playerId || 0,
        playerName: hotelGuestFormValues.value.players?.[0]?.playerFullName || '',
        hotelReservationId: hotelGuestFormValues.value.id,
        expenseTypeId: selectedExpenseParameter.value.id,
        expenseTypeName: selectedExpenseParameter.value.name,
        quantity: newExpenseEntry.value.quantity,
        value: newExpenseEntry.value.value,
        amount: newExpenseEntry.value.amount,
      },
    }

    const success = await guestManagementStore.addHotelReservationExpense(apiData)
    if (success) {
      $q.notify({
        message: 'Gider başarıyla eklendi',
        type: 'positive',
        position: 'bottom-right',
      })
      await fetchReservationExpenses(hotelGuestFormValues.value.id)
      $q.loading.hide()
    } else {
      $q.loading.hide()
      $q.notify({
        message: 'Gider eklenirken bir hata oluştu',
        type: 'negative',
        position: 'bottom-right',
      })
    }
  } else {
    if (!hotelGuestFormValues.value.expenses) {
      hotelGuestFormValues.value.expenses = []
    }

    hotelGuestFormValues.value.expenses.push({
      playerId: hotelGuestFormValues.value.players?.[0]?.playerId || 0,
      playerName: hotelGuestFormValues.value.players?.[0]?.playerFullName || '',
      expenseTypeId: selectedExpenseParameter.value.id,
      expenseTypeName: selectedExpenseParameter.value.name,
      quantity: newExpenseEntry.value.quantity,
      value: newExpenseEntry.value.value,
      amount: newExpenseEntry.value.amount,
    })
    newExpenseEntry.value.quantity = 1
    newExpenseEntry.value.value = 0
    newExpenseEntry.value.amount = 0
    selectedExpenseParameter.value = null
  }
}

const fetchReservationExpenses = async (hotelReservationId) => {
  const expenses = await guestManagementStore.fetchExpenses({
    hotelReservationId: hotelReservationId,
  })

  if (expenses && expenses.data) {
    hotelGuestFormValues.value.expenses = expenses.data.map((expense) => ({
      ...expense,
      playerName:
        expense.playerName ||
        hotelGuestFormValues.value.players?.find((p) => p.playerId === expense.playerId)
          ?.playerFullName ||
        '',
    }))
  }
}

const onDeleteExpense = async (expense, index) => {
  if (hotelGuestFormValues.value.id) {
    if (expense.id) {
      const success = await guestManagementStore.removeHotelReservationExpense({
        expenseId: expense.id,
      })
      if (success) {
        await fetchReservationExpenses(hotelGuestFormValues.value.id)
      }
    }
  } else {
    hotelGuestFormValues.value.expenses.splice(index, 1)
  }
}

const calculateGrandTotal = () => {
  if (!hotelGuestFormValues.value.expenses?.length) return '0.00'

  const total = hotelGuestFormValues.value.expenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount || 0)
  }, 0)

  return total.toFixed(2)
}

watch(
  () => props.formValues,
  async () => {
    setFormValues()
  },
)

const setFormValues = async () => {
  if (!props.formValues || !props.formValues.id) {
    hotelGuestFormValues.value = {
      players: [
        {
          hotelReservationId: 0,
          playerId: null,
          playerFullName: '',
          playerCategoryId: null,
          playerCategoryName: null,
          roomOwner: false,
        },
      ],
      status: 'Pending',
      hotelFlightInfo: {
        checkIn: '',
        checkOut: '',
        dayCount: 1,
        roomTypeId: null,
        roomType: '',
        roomNo: null,
        boardType: 'BB',
        roomPrice: 0,
        roomTotalPrice: 0,

        ticketType: 'Casino',
        from: '',
        to: '',

        flightTicketPrice: 0,
        isBusiness: 0,
        isWalkIn: false,
        isTransfer: false,
      },
      note: '',
      remark: '',
      phone: true,

      expenses: [],
    }
    setCheckInAndCheckOutDates()
    isEditingReservationDetails.value = false
    return
  }
  if (props.formValues.isCopy) {
    hotelGuestFormValues.value = {
      ...props.formValues,
    }
    return
  }

  let category = null
  const ownerPlayer = props.formValues.players.find((item) => item.roomOwner === true)
  if (!ownerPlayer) {
    const somePlayerCategoryId = props.formValues.players.find(
      (item) => item.roomOwner === false,
    )?.playerCategoryId
    category = { ...visitorCategories.value.find((item) => item.id === somePlayerCategoryId) }
  }
  const players = ownerPlayer
    ? [...props.formValues.players].sort((a) => {
        return a.roomOwner ? -1 : 1
      })
    : [
        {
          playerId: null,
          playerFullName: '',
          roomOwner: false,
          playerCategoryId: category?.id || null,
          playerCategoryName: category?.name || null,
        },
        ...props.formValues.players,
      ]
  hotelGuestFormValues.value = {
    ...hotelGuestFormValues.value,
    ...props.formValues,
    players: players,
    hotelFlightInfo: {
      ...props.formValues,
      isBusiness: props.formValues.isBusiness === true ? 1 : 0,
    },
  }
  await fetchReservationExpenses(props.formValues.id)
}

const setCheckInAndCheckOutDates = () => {
  let checkInDate = new Date()
  checkInDate.setHours(14, 0, 0, 0)
  hotelGuestFormValues.value.hotelFlightInfo.checkIn = checkInDate

  let checkOutDate = new Date()
  checkOutDate.setHours(12, 0, 0, 0)
  hotelGuestFormValues.value.hotelFlightInfo.checkOut = checkOutDate
}

const onSelectCheckInAndCheckOut = () => {
  const dateDiff = date.getDateDiff(
    hotelGuestFormValues.value.hotelFlightInfo.checkOut,
    hotelGuestFormValues.value.hotelFlightInfo.checkIn,
  )
  hotelGuestFormValues.value.hotelFlightInfo.dayCount = dateDiff

  onChangeRoomType()
}

const onChangeRoomType = () => {
  if (!hotelGuestFormValues.value.hotelFlightInfo.roomTypeId) return
  const roomType = roomTypes.value.find(
    (item) => +item.id === +hotelGuestFormValues.value.hotelFlightInfo.roomTypeId,
  )
  hotelGuestFormValues.value.hotelFlightInfo.roomType = roomType?.name || ''
  hotelGuestFormValues.value.hotelFlightInfo.roomPrice = roomType?.price || 0
  hotelGuestFormValues.value.hotelFlightInfo.roomTotalPrice =
    (roomType?.price || 0) * hotelGuestFormValues.value.hotelFlightInfo.dayCount
}

const onChangeRoomTotalPrice = () => {
  const price = hotelGuestFormValues.value.hotelFlightInfo.roomTotalPrice
  const dayCount = hotelGuestFormValues.value.hotelFlightInfo.dayCount || 1
  hotelGuestFormValues.value.hotelFlightInfo.roomPrice = price / dayCount
}

const onChangeRoomPrice = () => {
  const price = hotelGuestFormValues.value.hotelFlightInfo.roomPrice
  const dayCount = hotelGuestFormValues.value.hotelFlightInfo.dayCount || 1
  hotelGuestFormValues.value.hotelFlightInfo.roomTotalPrice = price * dayCount
}

watch(
  () => hotelGuestFormValues.value.hotelFlightInfo.roomPrice,
  () => {
    onChangeRoomPrice()
  },
)

watch(
  () => hotelGuestFormValues.value.hotelFlightInfo.roomTotalPrice,
  () => {
    onChangeRoomTotalPrice()
  },
)

const onSelectExpenseParameter = () => {
  if (selectedExpenseParameter.value) {
    newExpenseEntry.value.quantity = 1
    newExpenseEntry.value.value = selectedExpenseParameter.value.amount
    newExpenseEntry.value.amount = selectedExpenseParameter.value.amount
  }
}

watch(
  () => [newExpenseEntry.value.quantity, newExpenseEntry.value.value],
  () => {
    newExpenseEntry.value.amount = newExpenseEntry.value.quantity * newExpenseEntry.value.value
  },
)

watch(
  () => hotelGuestFormValues.value.hotelFlightInfo.checkIn,
  () => {
    // compare the dates if checkIn is greater than checkOut, set checkOut to checkIn
    const dateDiff = date.getDateDiff(
      hotelGuestFormValues.value.hotelFlightInfo.checkOut,
      hotelGuestFormValues.value.hotelFlightInfo.checkIn,
    )
    if (dateDiff < 0) {
      $q.notify({
        message: 'Check-in tarihi check-out tarihinden büyük olamaz',
        color: 'negative',
      })
      hotelGuestFormValues.value.hotelFlightInfo.checkIn =
        hotelGuestFormValues.value.hotelFlightInfo.checkOut
      hotelGuestFormValues.value.hotelFlightInfo.dayCount = 1
    }
  },
)

const onChangeIsWalkIn = () => {
  if (hotelGuestFormValues.value.hotelFlightInfo.isWalkIn) {
    hotelGuestFormValues.value.hotelFlightInfo.flight = ''
    hotelGuestFormValues.value.hotelFlightInfo.ticketType = ''
    hotelGuestFormValues.value.hotelFlightInfo.from = ''
    hotelGuestFormValues.value.hotelFlightInfo.to = ''

    hotelGuestFormValues.value.hotelFlightInfo.flightTicketPrice = 0
  }
}
</script>

<style scoped lang="scss">
.disabled-fieldset {
  background-color: #f5f5f5;
  opacity: 0.7;

  input,
  select,
  textarea {
    background-color: #f9f9f9 !important;
  }
}
</style>
