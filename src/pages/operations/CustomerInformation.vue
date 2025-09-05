<template>
  <q-page class="q-pa-xs">
    <div class="q-pa-md">
      <div class="row no-wrap">
        <div class="col-12 col-md-8" style="display: flex; flex-direction: column">
          <q-card flat bordered>
            <q-card-section class="">
              <div class="row flex justify-center">
                <div class="col q-pa-xs text-center" v-if="selectedPlayer">
                  <q-img
                    class="cursor-pointer rounded-borders player-photo"
                    style="width: 100px"
                    :src="$playerPhotoUrl + selectedPlayer?.id"
                    :alt="selectedPlayer?.fullName"
                    error-src="/assets/no-photo.png"
                    ref="playerPhoto"
                  />
                </div>

                <div class="col-4 q-pr-xs" :class="{ 'col-7': !selectedPlayer }">
                  <div class="fit row wrap justify-start items-start content-around">
                    <div class="col-12">
                      <div class="text-subtitle2 text-grey-8">-- {{ $t('searchPlayer') }}</div>
                    </div>
                    <SearchPlayerInput
                      v-model="searchPlayer.id"
                      :placeholder="$t('searchPlayer')"
                      @onSelectPlayer="onSelectPlayer"
                      :optionLabel="'value'"
                      :displayedValue="searchPlayer.value"
                      @onClear="clearPlayerData"
                    />
                    <div class="row flex justify-start items-center">
                      <q-chip
                        v-if="selectedPlayer"
                        :color="playerData.isBlackListed ? 'negative' : 'blue-grey-8'"
                        text-color="white"
                        size="11px"
                        no-caps
                        square
                        :label="playerData.isBlackListed ? $t('blacklisted') : $t('notBlacklisted')"
                        :icon="playerData.isBlackListed ? 'fa fa-check' : 'fa fa-times'"
                      />
                      <q-chip
                        v-if="playerData.isActive"
                        :color="playerData.isActive ? 'green-8' : 'red-8'"
                        text-color="white"
                        size="11px"
                        no-caps
                        square
                        :label="playerData.isActive ? $t('isActive') : $t('isNotActive')"
                        :icon="playerData.isActive ? 'o_check' : 'o_close'"
                      />
                    </div>
                  </div>
                </div>

                <!-- Nation and Gender Section -->
                <div class="col-2 q-pa-xs" v-if="selectedPlayer">
                  <div
                    v-if="editPlayer"
                    class="fit row wrap justify-center items-end content-around"
                  >
                    <q-select
                      v-model="playerData.nation"
                      :options="countries"
                      option-value="id"
                      option-label="name"
                      :label="$t('nation')"
                      outlined
                      dense
                      emit-value
                      map-options
                      class="super-small"
                    />
                    <q-select
                      v-model="playerData.gender"
                      :options="genderOptions"
                      :label="$t('gender')"
                      outlined
                      dense
                      emit-value
                      map-options
                      class="super-small"
                    />
                  </div>
                  <div class="fit row wrap justify-center items-end content-around">
                    <div
                      class="col-12 flex justify-center items-center"
                      v-if="selectedPlayer && !editPlayer"
                    >
                      <div class="text-subtitle2 text-grey-8">{{ $t('nation') }}:</div>
                      <div class="text-subtitle2 text-blue-grey-8 q-ml-sm">
                        {{
                          countries.find((country) => country.id === playerData.nation)?.value || ''
                        }}
                      </div>
                    </div>
                    <div
                      class="col-12 flex justify-center items-center"
                      v-if="selectedPlayer && !editPlayer"
                    >
                      <div class="text-subtitle2 text-grey-8">{{ $t('gender') }}:</div>
                      <div class="text-subtitle2 text-blue-grey-8 q-ml-sm">
                        {{ playerData.gender || '' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- SP Name and SP Surname Section -->
                <div class="col-4 q-pa-xs" v-if="selectedPlayer">
                  <div
                    v-if="editPlayer"
                    class="fit row wrap justify-center items-end content-around"
                  >
                    <q-input
                      v-model="playerData.spName"
                      :label="$t('spName')"
                      outlined
                      dense
                      bg-color="white"
                      class="super-small"
                    />
                    <q-input
                      v-model="playerData.spSurname"
                      :label="$t('spSurname')"
                      outlined
                      dense
                      bg-color="white"
                      class="super-small"
                    />
                  </div>
                  <div class="fit row wrap justify-center items-end content-around">
                    <div
                      class="col-12 flex justify-center items-center"
                      v-if="selectedPlayer && !editPlayer"
                    >
                      <div class="text-subtitle2 text-grey-8">{{ $t('spName') }}:</div>
                      <div class="text-subtitle2 text-blue-grey-8 q-ml-sm">
                        {{ playerData.spName || '' }}
                      </div>
                    </div>
                    <div
                      class="col-12 flex justify-center items-center"
                      v-if="selectedPlayer && !editPlayer"
                    >
                      <div class="text-subtitle2 text-grey-8">{{ $t('spSurname') }}:</div>
                      <div class="text-subtitle2 text-blue-grey-8 q-ml-sm">
                        {{ playerData.spSurname || '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" v-if="selectedPlayer">
                <div class="col-6 q-pa-xs flex justify-start items-center">
                  <div class="text-subtitle2 text-grey-8">
                    {{ $t('playerId') }}:
                    <span class="q-ml-sm"> {{ playerData.id || '' }}</span>
                  </div>
                  <div class="text-subtitle2 q-ml-md text-grey-8">
                    {{ $t('assistId') }}:
                    <span class="q-ml-sm"> {{ playerData.assistId || '' }}</span>
                  </div>
                  <div class="text-subtitle2 q-ml-md text-grey-8">
                    {{ $t('class') }}:
                    <span class="q-ml-sm"> {{ playerData.class || '' }}</span>
                  </div>
                </div>
                <div class="col-6 q-pa-xs text-right">
                  <q-btn
                    color="blue-grey-8"
                    icon="card_giftcard"
                    label="Give Gift"
                    @click="openGiftModal"
                    :disable="!playerData.id"
                    unelevated
                    no-caps
                  />
                  <q-btn
                    color="primary"
                    icon="save"
                    label="Save"
                    @click="savePlayerData"
                    :disable="!playerData.id || !playerData.name"
                    unelevated
                    no-caps
                    class="q-ml-sm"
                    v-if="editPlayer"
                  />
                  <q-btn
                    v-if="selectedPlayer"
                    :color="editPlayer ? 'negative' : 'primary'"
                    @click="editPlayer = !editPlayer"
                    class="q-mr-sm q-ml-sm"
                    dense
                    unelevated
                    no-caps
                    padding="6px"
                    :icon="editPlayer ? 'o_close' : 'o_edit'"
                  />
                  <!--  :icon="editPlayer ? 'fa fa-close' : 'fa fa-edit'" -->
                </div>
              </div>
            </q-card-section>
            <!-- Information Section -->
            <q-card-section class="row q-pt-none" v-if="selectedPlayer">
              <div class="col q-mx-xs">
                <div
                  class="bg-yellow-1 q-pa-sm q-radius-md flex flex-center column text-center text-bold q-card--bordered"
                >
                  <div class="text-caption">
                    {{ $t('visitDays') }}
                  </div>
                  <div class="text-subtitle2">
                    {{ playerMetaData.visitDaysCount || '-' }}
                  </div>
                </div>
              </div>
              <div class="col q-mx-xs">
                <div
                  class="bg-yellow-1 q-pa-sm q-radius-md flex flex-center column text-center text-bold q-card--bordered"
                >
                  <div class="text-caption">
                    {{ $t('category') }}
                  </div>
                  <div class="text-subtitle2 text-primary">
                    {{ playerMetaData.category || '-' }}
                  </div>
                </div>
              </div>
              <div class="col q-mx-xs">
                <div
                  class="bg-yellow-1 q-pa-sm q-radius-md flex flex-center column text-center text-bold q-card--bordered"
                >
                  <div class="text-caption">
                    {{ $t('playedDays') }}
                  </div>
                  <div class="text-subtitle2">
                    {{ playerMetaData.playedDaysReal || '-' }}
                  </div>
                </div>
              </div>
              <div class="col q-mx-xs">
                <div
                  class="bg-yellow-1 q-pa-sm q-radius-md flex flex-center column text-center text-bold q-card--bordered"
                >
                  <div class="text-caption">
                    {{ $t('reservTotal') }}
                  </div>
                  <div class="text-subtitle2 text-blue">
                    {{ playerMetaData.reservTotal || '-' }}
                  </div>
                </div>
              </div>
              <div class="col q-mx-xs">
                <div
                  class="bg-yellow-1 q-pa-sm q-radius-md flex flex-center column text-center text-bold q-card--bordered"
                >
                  <div class="text-caption">
                    {{ $t('dailyTheo') }}
                  </div>
                  <div class="text-subtitle2">
                    {{ playerMetaData.dailyTheo || '-' }}
                  </div>
                </div>
              </div>
              <div class="col q-mx-xs">
                <div
                  class="bg-yellow-1 q-pa-sm q-radius-md flex flex-center column text-center text-bold q-card--bordered"
                >
                  <div class="text-caption">
                    {{ $t('hotelDays') }}
                  </div>
                  <div class="text-subtitle2 text-green">
                    {{ playerMetaData.hotelDaysCount || '-' }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Tablolar (Oyuncu Bilgisi Kartının Hemen Altında) -->
          <q-card flat bordered class="q-pa-md q-mt-md">
            <!-- Filter Section -->
            <div class="row items-center q-mb-md q-gutter-x-md">
              <!-- Visit Input -->
              <div class="col-auto">
                <div class="row items-center q-gutter-x-sm">
                  <div class="text-subtitle2 text-grey-8">{{ $t('day') }}:</div>
                  <q-input
                    v-model="currentVisit"
                    type="number"
                    dense
                    outlined
                    style="width: 70px"
                    class="super-small visit-input"
                  />
                </div>
              </div>

              <!-- Show Visit Button -->
              <div class="col-auto">
                <q-btn
                  type="button"
                  :label="$t('show')"
                  icon="tune"
                  color="grey-2"
                  text-color="dark"
                  size="13px"
                  unelevated
                  no-caps
                  @click="showVisitDetails"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <!-- Left Side Tables - 3 Tables -->
              <div class="col-12">
                <!-- Summary Table -->
                <div class="q-mb-md">
                  <q-table
                    flat
                    bordered
                    :rows="tableData.summary"
                    :columns="summaryColumns"
                    hide-bottom
                    dense
                    separator="horizontal"
                    row-key="id"
                    binary-state-sort
                    :pagination="{ rowsPerPage: 0 }"
                    square
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          :props="props"
                          v-for="col in props.cols"
                          :key="col.name"
                          :auto-width="col.autoWidth"
                          :align="col.align"
                          :sortable="col.sortable"
                          :sort-method="col.sortMethod"
                          :sort-order="col.sortOrder"
                          :style="col.style"
                          :class="col.classes"
                          class="cursor-pointer"
                        >
                          {{ col.shortName }}
                          <q-tooltip class="bg-blue-grey-8 text-white text-subtitle2">
                            {{ col.label }}
                          </q-tooltip>
                        </q-th>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <!-- Average Table -->
                <div class="q-mb-md">
                  <q-table
                    flat
                    bordered
                    :rows="tableData.averages"
                    :columns="averageColumns"
                    hide-bottom
                    dense
                    separator="horizontal"
                    row-key="id"
                    binary-state-sort
                    :pagination="{ rowsPerPage: 0 }"
                    square
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          :props="props"
                          v-for="col in props.cols"
                          :key="col.name"
                          :auto-width="col.autoWidth"
                          :align="col.align"
                          :sortable="col.sortable"
                          :sort-method="col.sortMethod"
                          :sort-order="col.sortOrder"
                          :style="col.style"
                          :class="col.classes"
                          class="cursor-pointer"
                        >
                          {{ col.shortName }}
                          <q-tooltip class="bg-blue-grey-8 text-white text-subtitle2">
                            {{ col.label }}
                          </q-tooltip>
                        </q-th>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <!-- Game Details Table -->
                <div>
                  <q-table
                    flat
                    bordered
                    :rows="tableData.gameDetails"
                    :columns="gameDetailsColumns"
                    hide-bottom
                    dense
                    separator="horizontal"
                    row-key="game"
                    binary-state-sort
                    :pagination="{ rowsPerPage: 0 }"
                    square
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          :props="props"
                          v-for="col in props.cols"
                          :key="col.name"
                          :auto-width="col.autoWidth"
                          :align="col.align"
                          :sortable="col.sortable"
                          :sort-method="col.sortMethod"
                          :sort-order="col.sortOrder"
                          :style="col.style"
                          :class="col.classes"
                          class="cursor-pointer"
                        >
                          {{ col.shortName }}
                          <q-tooltip class="bg-blue-grey-8 text-white text-subtitle2">
                            {{ col.label }}
                          </q-tooltip>
                        </q-th>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </div>
              <!-- Right Side Table - Visit Details -->
              <div class="col-12">
                <q-table
                  flat
                  bordered
                  :rows="tableData.visitDetails"
                  :columns="visitDetailsColumns"
                  hide-bottom
                  dense
                  separator="horizontal"
                  row-key="date"
                  binary-state-sort
                  :pagination="{ rowsPerPage: 0 }"
                  square
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        :props="props"
                        v-for="col in props.cols"
                        :key="col.name"
                        :auto-width="col.autoWidth"
                        :align="col.align"
                        :sortable="col.sortable"
                        :sort-method="col.sortMethod"
                        :sort-order="col.sortOrder"
                        :style="col.style"
                        :class="col.classes"
                        class="cursor-pointer"
                      >
                        {{ col.shortName }}
                        <q-tooltip class="bg-blue-grey-8 text-white text-subtitle2">
                          {{ col.label }}
                        </q-tooltip>
                      </q-th>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card>

          <!-- Oda Bilgisi Tablosu (En Altta) -->
          <q-card flat bordered class="q-mb-md q-mt-md">
            <q-card-section>
              <div class="text-subtitle2">Player Reservations</div>
              <q-table
                flat
                bordered
                :rows="tableData.roomInfo"
                :columns="roomInfoColumns"
                hide-bottom
                dense
                separator="horizontal"
                row-key="nameSurname"
                binary-state-sort
                :pagination="{ rowsPerPage: 0 }"
                square
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4 q-ml-md">
          <div style="margin-right: 16px">
            <q-card flat bordered>
              <q-card-section class="q-pa-md">
                <div class="q-gutter-sm">
                  <div class="q-card--bordered q-pa-xs">
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-blue text-bold text-caption cursor-pointer">Tasks</div>
                      <div class="row items-center">
                        <q-btn
                          flat
                          dense
                          round
                          icon="add"
                          size="sm"
                          class="q-ml-xs"
                          @click="showTaskModal = true"
                          :disable="!selectedPlayer"
                        />
                        <q-btn
                          flat
                          dense
                          round
                          icon="refresh"
                          size="sm"
                          class="q-ml-xs"
                          @click="fetchPlayerTasks()"
                          :disable="!selectedPlayer"
                          :title="$t('refresh')"
                        />
                      </div>
                    </div>
                    <div class="bg-grey-1 q-pa-md q-radius-md" style="min-height: 100px">
                      <div v-if="playerTasks.length" class="q-gutter-y-xs">
                        <div v-for="task in playerTasks" :key="task.id" class="task-item q-pa-sm">
                          <div class="row items-center no-wrap">
                            <div class="col">
                              <div class="text-body2 ellipsis-2-lines">
                                {{ task.result }}
                              </div>
                              <div class="row items-center q-gutter-x-sm q-mt-xs">
                                <div class="text-caption text-grey-7">
                                  <q-icon name="person" size="14px" class="q-mr-xs" />
                                  {{ task.createdByName || 'Unknown' }}
                                </div>
                                <div
                                  class="text-caption"
                                  :class="
                                    isTaskOverdue(task.dueDate) ? 'text-negative' : 'text-positive'
                                  "
                                >
                                  <q-icon name="event" size="14px" class="q-mr-xs" />
                                  {{ new Date(task.dueDate).toLocaleDateString() }}
                                </div>
                              </div>
                            </div>
                            <div class="col-2 flex no-wrap">
                              <q-btn
                                :ref="'editTaskBtn_' + task.id"
                                flat
                                dense
                                round
                                icon="o_edit"
                                size="sm"
                                @click="openTaskPopover('edit', task, $event)"
                              />
                              <q-btn
                                flat
                                dense
                                round
                                icon="o_delete_forever"
                                size="sm"
                                @click="deleteTask(task)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-grey text-center q-pa-md">
                        <q-icon name="task_alt" size="24px" class="q-mb-sm" />
                        <div>No tasks found for this player</div>
                      </div>
                      <TaskModal
                        v-model="showTaskModal"
                        :selected-player="selectedPlayer"
                        :edit-task="editingTask"
                        @update:edit-task="editingTask = $event"
                        @task-saved="onTaskSaved"
                      />
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <PlayerAttechments
                      v-if="selectedPlayer"
                      :player="selectedPlayer"
                      :player-id="selectedPlayer.id"
                      :show-player-attechments-permission="'Addon.Operations.CustomerInformation.ShowPlayerAttechments'"
                      :reload-player-attechments-permission="'Addon.Operations.CustomerInformation.ReloadPlayerAttechments'"
                    />
                    <div v-else>
                      <div class="text-blue text-bold text-caption">
                        {{ $t('playerAttechmentsList') }}
                      </div>
                      <div
                        class="bg-grey-1 q-pa-md q-radius-md"
                        style="min-height: 80px; position: relative"
                      >
                        <div class="text-grey text-center q-pa-md">
                          <q-icon name="o_people" size="24px" class="q-mb-sm" />
                          <div>No player attechments found for this player</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <PlayerFriends
                      v-if="selectedPlayer"
                      :player="selectedPlayer"
                      :player-id="selectedPlayer.id"
                      :show-friends-permission="'Addon.Operations.CustomerInformation.ShowFriends'"
                      :reload-friends-permission="'Addon.Operations.CustomerInformation.ReloadFriends'"
                    />
                    <div v-else>
                      <div class="text-blue text-bold text-caption">
                        {{ $t('friends') }}
                      </div>
                      <div
                        class="bg-grey-1 q-pa-md q-radius-md"
                        style="min-height: 80px; position: relative"
                      >
                        <div class="text-grey text-center q-pa-md">
                          <q-icon name="o_people" size="24px" class="q-mb-sm" />
                          <div>No friends found for this player</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <PlayerLinkedPlayers
                      v-if="selectedPlayer"
                      :player="selectedPlayer"
                      :player-id="selectedPlayer.id"
                      :show-linked-players-permission="'Addon.Operations.CustomerInformation.ShowLinkedPlayers'"
                      :reload-linked-players-permission="'Addon.Operations.CustomerInformation.ReloadLinkedPlayers'"
                    />
                    <div v-else>
                      <div class="text-blue text-bold text-caption">
                        {{ $t('linkedPlayersList') }}
                      </div>
                      <div
                        class="bg-grey-1 q-pa-md q-radius-md"
                        style="min-height: 80px; position: relative"
                      >
                        <div class="text-grey text-center q-pa-md">
                          <q-icon name="o_people" size="24px" class="q-mb-sm" />
                          <div>No linked players found for this player</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-blue text-bold text-caption cursor-pointer">Gifts</div>
                      <div class="row items-center">
                        <q-btn
                          flat
                          dense
                          round
                          icon="refresh"
                          size="sm"
                          class="q-ml-xs"
                          @click="getPlayerGifts()"
                          :disable="!playerData.id"
                          :title="$t('refresh')"
                        />
                      </div>
                    </div>
                    <div class="" style="min-height: 100px">
                      <div v-if="playerGifts.length" class="q-gutter-y-xs">
                        <div v-for="gift in playerGifts" :key="gift.id" class="gift-item">
                          <div class="row items-center no-wrap bg-grey-1 q-pa-xs">
                            <div class="col flex justify-between">
                              <div class="text-subtitle2">
                                {{ gift.giftName }}
                              </div>
                              <div
                                class="text-caption"
                                :class="gift.isDeleted ? 'text-negative' : 'text-grey-7'"
                              >
                                {{ date.formatDate(gift.plannedDate, 'DD.MM.YYYY') }}
                                <q-icon name="event" size="16px" class="q-mr-xs" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-grey text-center q-pa-md">
                        <q-icon name="gift" size="24px" class="q-mb-sm" />
                        <div>No gifts found for this player</div>
                      </div>
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <PlayerNote
                      v-if="selectedPlayer"
                      :player-id="selectedPlayer.id"
                      :note-source="'General'"
                      :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
                      :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
                      :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
                      :min-height="100"
                      :title="$t('generalNotes')"
                    />
                    <div v-else>
                      <div class="text-blue text-bold text-caption">
                        {{ $t('generalNotes') }}
                      </div>
                      <div
                        class="bg-green-1 q-pa-md q-radius-md"
                        style="min-height: 80px; position: relative"
                      >
                        <div class="text-grey text-center q-pa-md">
                          <q-icon name="note" size="24px" class="q-mb-sm" />
                          <div>No notes found General for this player</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <PlayerNote
                      v-if="selectedPlayer"
                      :player-id="selectedPlayer.id"
                      :note-source="'PublicRelations'"
                      :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
                      :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
                      :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
                      :min-height="100"
                      :title="$t('prNotes')"
                    />
                    <div v-else>
                      <div class="text-blue text-bold text-caption">
                        {{ $t('prNotes') }}
                      </div>
                      <div
                        class="bg-green-1 q-pa-md q-radius-md"
                        style="min-height: 80px; position: relative"
                      >
                        <div class="text-grey text-center q-pa-md">
                          <q-icon name="note" size="24px" class="q-mb-sm" />
                          <div>No notes found Public Relations for this player</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="q-card--bordered q-pa-xs">
                    <PlayerNote
                      v-if="selectedPlayer"
                      :player-id="selectedPlayer.id"
                      :note-source="'Portfolio'"
                      :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
                      :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
                      :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
                      :min-height="100"
                      :title="$t('portfolioNotes')"
                    />
                    <div v-else>
                      <div class="text-blue text-bold text-caption">
                        {{ $t('portfolioNotes') }}
                      </div>
                      <div
                        class="bg-green-1 q-pa-md q-radius-md"
                        style="min-height: 80px; position: relative"
                      >
                        <div class="text-grey text-center q-pa-md">
                          <q-icon name="note" size="24px" class="q-mb-sm" />
                          <div>No notes found Portfolio for this player</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <PlayerGiftModal v-if="showGiftModal" v-model="showGiftModal" :player="selectedPlayer" />
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { date, useQuasar } from 'quasar'
import { usePlayerStore } from 'src/stores/player-store'
import { useOperationsStore } from 'src/stores/operations-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useReportStore } from 'src/stores/report-store'
import { formatPrice } from 'src/helpers/helpers'
import { useRouter } from 'vue-router'

import TaskModal from 'src/components/pages/operations/TaskModal.vue'
import PlayerGiftModal from 'src/components/pages/operations/PlayerGiftModal.vue'
import PlayerNote from 'src/components/pages/player-operations/meta-detail/PlayerNote.vue'
import PlayerFriends from 'src/components/pages/player-operations/meta-detail/PlayerFriends.vue'
import PlayerLinkedPlayers from 'src/components/pages/player-operations/meta-detail/LinkedPlayers.vue'
import PlayerAttechments from 'src/components/pages/player-operations/meta-detail/PlayerAttechments.vue'
const router = useRouter()
const $q = useQuasar()
const playerData = ref({
  name: '',
  surname: '',
  nation: null,
  gender: null,
  class: '',
  isBlackListed: false,
  spName: '',
  spSurname: '',
  isActive: false,
})
const playerMetaData = ref({
  visitDaysCount: null,
  playedDaysReal: null,
  dailyTheo: null,
  hotelDaysCount: null,
  category: null,
  reservTotal: null,
})
const currentVisit = ref(30)
const totalVisits = ref(30)
const genderOptions = ref(['Male', 'Female'])

const summaryColumns = ref([
  {
    name: 'TDropLG',
    align: 'center',
    label: 'tDropLG',
    shortName: 'T.Drop LG',
    field: 'TDropLG',
    sortable: false,
  },
  {
    name: 'TResultLG',
    align: 'center',
    label: 'tResultLG',
    shortName: 'T.Result LG',
    field: 'TResultLG',
    sortable: false,
  },
  {
    name: 'TDropSL',
    align: 'center',
    label: 'tDropSL',
    shortName: 'T.Drop SL',
    field: 'TDropSL',
    sortable: false,
  },
  {
    name: 'TResultSL',
    align: 'center',
    label: 'tResultSL',
    shortName: 'T.Result SL',
    field: 'TResultSL',
    sortable: false,
  },
  {
    name: 'TDrop',
    align: 'center',
    label: 'tDrop',
    shortName: 'T.Drop',
    field: 'TDrop',
    sortable: false,
  },
  {
    name: 'TResult',
    align: 'center',
    label: 'tResult',
    shortName: 'T.Result',
    field: 'TResult',
    sortable: false,
  },
])
const averageColumns = ref([
  {
    name: 'avgDropLG',
    align: 'center',
    label: 'avgDropLG',
    shortName: 'Avg.Drop LG',
    field: 'avgDropLG',
    sortable: false,
  },
  {
    name: 'avgResultLG',
    align: 'center',
    label: 'avgResultLG',
    shortName: 'Avg.Result LG',
    field: 'avgResultLG',
    sortable: false,
  },
  {
    name: 'avgTOverSL',
    align: 'center',
    label: 'avgTOverSL',
    shortName: 'Avg.T.Over SL',
    field: 'avgTOverSL',
    sortable: false,
  },
  {
    name: 'avgResultSL',
    align: 'center',
    label: 'avgResultSL',
    shortName: 'Avg.Result SL',
    field: 'avgResultSL',
    sortable: false,
  },
  {
    name: 'avgDrop',
    align: 'center',
    label: 'avgDrop',
    shortName: 'Avg.Drop',
    field: 'avgDrop',
    sortable: false,
  },
  {
    name: 'avgResult',
    align: 'center',
    label: 'avgResult',
    shortName: 'Avg.Result',
    field: 'avgResult',
    sortable: false,
  },
])
const gameDetailsColumns = ref([
  {
    name: 'game',
    align: 'center',
    label: 'game',
    shortName: 'Game',
    field: 'game',
    sortable: false,
  },
  {
    name: 'time',
    align: 'center',
    label: 'time',
    shortName: 'Time',
    field: 'time',
    sortable: false,
  },
  {
    name: 'avgBet',
    align: 'center',
    label: 'avgBet',
    shortName: 'Avg.Bet',
    field: 'avgBet',
    sortable: false,
  },
  {
    name: 'theoretical',
    align: 'center',
    label: 'theoretical',
    shortName: 'Theoretical',
    field: 'theoretical',
    sortable: false,
  },
])
const visitDetailsColumns = ref([
  {
    name: 'drop',
    align: 'center',
    label: 'drop',
    shortName: 'Drop LG',
    field: 'drop',
    sortable: false,
  },
  {
    name: 'result',
    align: 'center',
    label: 'result',
    shortName: 'Result LG',
    field: 'result',
    sortable: false,
  },
  {
    name: 'tOver',
    align: 'center',
    label: 'tOver',
    shortName: 'T.Over SL',
    field: 'tOver',
    sortable: false,
  },
  {
    name: 'resultValue',
    align: 'center',
    label: 'resultValue',
    shortName: 'Result SL',
    field: 'resultValue',
    sortable: false,
  },
  {
    name: 'date',
    align: 'center',
    label: 'date',
    shortName: 'Date',
    field: 'date',
    sortable: false,
  },
])
const roomInfoColumns = ref([
  {
    name: 'nameSurname',
    align: 'left',
    label: 'Name Surname',
    field: 'nameSurname',
    sortable: false,
  },
  {
    name: 'roomMate',
    align: 'left',
    label: 'Room Mate',
    field: 'roomMate',
    sortable: false,
  },
  {
    name: 'checkIn',
    align: 'center',
    label: 'Check In',
    field: 'checkIn',
    sortable: false,
  },
  {
    name: 'checkOut',
    align: 'center',
    label: 'Check Out',
    field: 'checkOut',
    sortable: false,
  },
  {
    name: 'room',
    align: 'center',
    label: 'Room',
    field: 'room',
    sortable: false,
  },
  {
    name: 'category',
    align: 'center',
    label: 'Category',
    field: 'category',
    sortable: false,
  },
  {
    name: 'nq',
    align: 'center',
    label: 'NQ',
    field: 'nq',
    sortable: false,
  },
  {
    name: 'ticket',
    align: 'center',
    label: 'Ticket',
    field: 'ticket',
    sortable: false,
  },
  {
    name: 'from',
    align: 'center',
    label: 'From',
    field: 'from',
    sortable: false,
  },
  {
    name: 'flight',
    align: 'center',
    label: 'Flight',
    field: 'flight',
    sortable: false,
  },
])

const playerStore = usePlayerStore()
const reportStore = useReportStore()
const { countries } = storeToRefs(playerStore)

const showTaskModal = ref(false)
const playerTasks = ref([])

const playerFullData = ref({})

const selectedPlayer = ref(null)
const searchPlayer = ref({
  id: null,
  value: null,
})
const editingTask = ref(null)
const tableData = ref({
  summary: [],
  averages: [],
  gameDetails: [],
  visitDetails: [],
  roomInfo: [],
})
const showGiftModal = ref(false)
const operationsStore = useOperationsStore()

const playerIdComputed = computed(() => router.currentRoute.value.query?.playerId)
const editPlayer = ref(false)

const onSelectPlayer = async (player) => {
  searchPlayer.value = { ...player }
  if (player) {
    try {
      const playerDetails = await playerStore.fetchPlayerById({ playerId: player.id })
      if (playerDetails) {
        searchPlayer.value.value = playerDetails.name + ' ' + playerDetails.surname
        playerFullData.value = { ...playerDetails }
        playerData.value = {
          isActive: playerDetails.isActive || false,
          gender: playerDetails.gender || null,
          nation: playerDetails.countryId,
          isBlackListed: playerDetails.isBlackListed || false,
          name: playerDetails.name,
          surname: playerDetails.surname,
          class: playerDetails.class || '',
          id: playerDetails.id,
          spName: playerDetails.spName,
          spSurname: playerDetails.spSurname,
        }

        selectedPlayer.value = {
          ...selectedPlayer.value,
          name: playerDetails.name,
          id: playerDetails.id,
          value: player.value,
          fullName: playerDetails.name + ' ' + playerDetails.surname,
        }

        // Fetch player meta information
        const metaDetails = await playerStore.fetchPlayerInformationMetaDetail({
          playerId: player.id,
          day: currentVisit.value,
        })
        if (metaDetails) {
          playerMetaData.value = {
            visitDaysCount: metaDetails.visitDays,
            playedDaysReal: metaDetails.playedDays,
            dailyTheo: metaDetails.dailyTheoretical,
            hotelDaysCount: metaDetails.hotelDaysCount,
            category: metaDetails.category,
            reservTotal: metaDetails.reservationTotal,
          }
        }

        const authStore = useAuthStore()
        // Fetch table data with default currency id
        const tableData = await playerStore.fetchPlayerInformationDetail({
          playerId: player.id,
          day: currentVisit.value,
          defaultCurrencyId: authStore.getDefaultCurrencyId,
        })
        if (tableData) {
          updateTableData(tableData)
        }

        // Fetch tasks
        const result = await reportStore.getCallReport({
          playerId: player.id,
        })
        playerTasks.value = result?.data || []

        // Fetch notes
        //await this.fetchPlayerNotes(player.id);

        // Fetch gifts
        getPlayerGifts()
      }
    } catch (error) {
      console.error('Error fetching player details:', error)
    }
  }
}
const updateTableData = (data) => {
  tableData.value = {
    summary: [
      {
        id: 1,
        TDropLG: formatPrice(data.totalOutput?.totalDropLg || 0),
        TResultLG: formatPrice(data.totalOutput?.totalResultLg || 0),
        TDropSL: formatPrice(data.totalOutput?.totalSlotDrop || 0),
        TResultSL: formatPrice(data.totalOutput?.totalSlotResult || 0),
        TDrop: formatPrice(data.totalOutput?.totalDrop || 0),
        TResult: formatPrice(data.totalOutput?.totalResult || 0),
      },
    ],
    averages: [
      {
        id: 1,
        avgDropLG: formatPrice(data.avgOutput?.avgDropLg || 0),
        avgResultLG: formatPrice(data.avgOutput?.avgResultLg || 0),
        avgTOverSL: formatPrice(data.avgOutput?.avgSlotDrop || 0),
        avgResultSL: formatPrice(data.avgOutput?.avgSlotResult || 0),
        avgDrop: formatPrice(data.avgOutput?.avgDrop || 0),
        avgResult: formatPrice(data.avgOutput?.avgResult || 0),
      },
    ],
    gameDetails:
      data.byGameOutput?.map((game) => ({
        game: game.game,
        time: game.time,
        avgBet: formatPrice(game.avgBet || 0),
        theoretical: formatPrice(game.theoretical || 0),
      })) || [],
    visitDetails:
      data.dataByGamingDateOutput?.map((visit) => ({
        drop: formatPrice(visit.lgDrop || 0),
        result: formatPrice(visit.lgResult || 0),
        tOver: formatPrice(visit.slotTurnover || 0),
        resultValue: formatPrice(visit.slotResult || 0),
        date: visit.gamingDateName,
      })) || [],
    roomInfo:
      data.hotelReservations?.map((room) => ({
        nameSurname: room.playerFullName,
        roomMate: room.roomMates?.join(', ') || '-',
        checkIn: new Date(room.checkIn).toLocaleDateString(),
        checkOut: new Date(room.checkOut).toLocaleDateString(),
        room: room.roomNo,
        category: room.category,
        nq: room.ticketType,
        ticket: room.ticketType,
        from: room.from,
        flight: room.flight,
      })) || [],
  }
}
const clearPlayerData = () => {
  selectedPlayer.value = null
  playerData.value = {
    name: '',
    surname: '',
    gender: null,
    nation: null,
    class: '',
    isBlackListed: false,
    spName: '',
    spSurname: '',
    id: null,
    isActive: false,
  }
  playerMetaData.value = {
    visitDaysCount: null,
    playedDaysReal: null,
    dailyTheo: null,
    hotelDaysCount: null,
    category: null,
    reservTotal: null,
  }
  tableData.value = {
    summary: [],
    averages: [],
    gameDetails: [],
    visitDetails: [],
    roomInfo: [],
  }
  currentVisit.value = 30
  totalVisits.value = 30
  playerTasks.value = []
  playerGifts.value = []
  if (router.currentRoute.value.query?.playerId) {
    router.push({
      name: 'customerInformation',
    })
  }
}

const showVisitDetails = async () => {
  if (!selectedPlayer.value?.id) return

  try {
    onSelectPlayer(selectedPlayer.value)
    const authStore = useAuthStore()
    const tableData = await playerStore.fetchPlayerInformationDetail({
      playerId: selectedPlayer.value.id,
      day: currentVisit.value,
      defaultCurrencyId: authStore.getDefaultCurrencyId,
    })
    if (tableData) {
      updateTableData(tableData)
    }
  } catch (error) {
    console.error('Error fetching visit details:', error)
  }
}
const isTaskOverdue = (dueDate) => {
  return new Date(dueDate) < new Date()
}
const onTaskSaved = () => {
  fetchPlayerTasks()
  editingTask.value = null
}
const openTaskPopover = (mode, task = null) => {
  if (mode === 'edit' && task) {
    editingTask.value = task
    showTaskModal.value = true
  } else {
    editingTask.value = null
    showTaskModal.value = true
  }
}
const deleteTask = async (task) => {
  try {
    const confirmed = await new Promise((resolve) => {
      $q.dialog({
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Delete',
          color: 'negative',
        },
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
    })

    if (confirmed) {
      await playerStore.deleteCallReport(task.id)
      await fetchPlayerTasks()
    }
  } catch (error) {
    console.error('Error in deleteTask:', error)
  }
}
const fetchPlayerTasks = async () => {
  if (!playerData.value.id) return
  try {
    const result = await reportStore.getCallReport({
      playerId: playerData.value.id,
    })
    playerTasks.value = result?.data || []
  } catch (error) {
    console.error('Error fetching player tasks:', error)
  }
}

const openGiftModal = () => {
  if (!playerData.value.id) return
  showGiftModal.value = true
}
const savePlayerData = async () => {
  const confirmed = await new Promise((resolve) => {
    $q.dialog({
      title: 'Update Player Data',
      message: 'Are you sure you want to update this player data?',

      persistent: true,
      cancel: {
        label: 'Cancel',
        color: 'grey-7',
        noCaps: true,
        flat: true,
        unelevated: true,
        icon: 'o_close',
      },
      ok: {
        label: 'Update',
        color: 'primary',
        icon: 'o_check',
        noCaps: true,
        unelevated: true,
      },
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false))
  })
  if (confirmed) {
    const data = {
      playerId: playerData.value.id,
      spName: playerData.value.spName,
      spSurname: playerData.value.spSurname,
      countryId: playerData.value.nation,
      gender: playerData.value.gender,
    }
    const response = await playerStore.updatePlayerMetaDetail(data)
    if (response.status === 200) {
      editPlayer.value = false
      $q.notify({
        message: 'Player data updated successfully',
        type: 'positive',
        position: 'top-right',
        timeout: 3000,
      })
      onSelectPlayer({
        id: playerData.value.id,
        value: playerData.value.name + ' ' + playerData.value.surname,
      })
    }
  }
}

const playerGifts = ref([])
const getPlayerGifts = () => {
  operationsStore.getPlayerGifts({ playerId: playerData.value.id }).then((res) => {
    playerGifts.value = res.data
  })
}

watch(showTaskModal, (val) => {
  if (val === false) {
    fetchPlayerTasks()
  }
})

// watch the playerIdComputed and if it changes, fetch the player data
onMounted(async () => {
  await playerStore.fetchCountries()
  if (playerIdComputed.value) {
    onSelectPlayer({
      id: playerIdComputed.value,
    })
  }
})

watch(playerIdComputed, (val) => {
  if (val) {
    onSelectPlayer({
      id: val,
    })
  }
})
</script>

<style scoped>
.player-photo-zoomed {
  transform: scale(3);
  z-index: 9999;
}

.visit-input .q-field__native {
  text-align: center;
}

.task-item {
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: #f5f5f5;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-item {
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.note-item:hover {
  background: #f5f5f5;
}

.friend-item {
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.friend-item:hover {
  background: #f5f5f5;
}

/* Add these new styles */
.q-select,
.q-input {
  width: 100%;
  max-width: 100%;
}

.q-field__native {
  min-width: 0;
  width: 100%;
}

.q-field__control {
  min-width: 0;
  width: 100%;
}

.q-field__marginal {
  flex-shrink: 0;
}
.flex-direction-column {
  flex-direction: column;
}
</style>
