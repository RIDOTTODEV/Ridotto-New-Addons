<template>
  <q-dialog v-model="show" persistent @hide="onDialogHide">
    <q-card class="full-width" style="max-width: 1000px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t('title') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Left Column: Player and Due Date -->
          <div class="col-4">
            <div class="column q-gutter-md">
              <SearchPlayerInput
                v-model="localSelectedPlayer"
                :placeholder="$t('searchPlayer')"
                @onSelectPlayer="onPlayerSelect"
                :optionLabel="'value'"
                :displayedValue="localSelectedPlayer.value"
                @onClear="clearPlayerData"
              />

              <q-input
                v-model="taskData.dueDate"
                :label="$t('dueDate')"
                outlined
                dense
                type="date"
              />

              <div class="row q-gutter-md">
                <q-checkbox v-model="taskData.transfer" :label="$t('transfer')" />
                <q-checkbox v-model="taskData.ok" :label="$t('completed')" />
              </div>
            </div>
          </div>

          <!-- Middle Column: Notes -->
          <div class="col-4">
            <q-input
              v-model="taskData.notes"
              :label="$t('notes')"
              outlined
              dense
              type="textarea"
              rows="8"
            />
          </div>

          <!-- Right Column: Result and Buttons -->
          <div class="col-4">
            <div class="column q-gutter-md">
              <q-input
                v-model="taskData.result"
                :label="$t('result')"
                outlined
                dense
                type="textarea"
                rows="8"
              />

              <div class="row justify-end q-gutter-sm">
                <q-btn :label="$t('new')" color="primary" outline @click="onNew" />
                <q-btn :label="$t('save')" color="primary" @click="onSave" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Task List Table -->
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Date Range Filter and Status Filter -->
          <div class="col-12">
            <div class="row q-gutter-md">
              <date-time-picker
                :no-wrap="false"
                btnClass="col-12 full-width"
                @selected-date="onDateChange"
              />
              <q-select
                v-model="filters.status"
                :options="[
                  { label: $t('all'), value: 'all' },
                  { label: $t('pending'), value: 'pending' },
                  { label: $t('completed'), value: 'completed' },
                ]"
                outlined
                dense
                emit-value
                map-options
                style="width: 200px"
              />
              <q-btn
                type="button"
                :label="$t('filter')"
                icon="tune"
                color="grey-2"
                text-color="dark"
                size="13px"
                unelevated
                no-caps
                @click="onFilter"
                class="q-ml-sm"
              />
            </div>
          </div>
        </div>

        <q-table
          :rows="filteredTasks"
          :columns="columns"
          row-key="id"
          dense
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
          class="full-width"
          @row-dblclick="(evt, row) => onTaskDoubleClick(row)"
        >
          <template v-slot:body-cell-dueDate="props">
            <q-td :props="props">
              {{ new Date(props.row.dueDate).toLocaleDateString() }}
            </q-td>
          </template>
          <template v-slot:body-cell-ok="props">
            <q-td :props="props">
              <q-icon
                :name="props.row.ok ? 'check_circle' : 'radio_button_unchecked'"
                :color="props.row.ok ? 'positive' : 'grey'"
                size="sm"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from 'src/stores/player-store'
import { useReportStore } from 'src/stores/report-store'
export default {
  name: 'TaskModal',
  components: {},
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    selectedPlayer: {
      type: Object,
      default: null,
    },
    editTask: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue', 'update:editTask'],
  setup(props, { emit }) {
    const playerStore = usePlayerStore()
    const reportStore = useReportStore()
    const show = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    const taskData = ref({
      id: null,
      playerId: null,
      playerFullName: '',
      dueDate: new Date().toISOString().split('T')[0],
      transfer: false,
      notes: '',
      result: '',
      ok: false,
    })

    const localSelectedPlayer = ref(null)
    const playerOptions = ref([])
    const loading = ref(false)
    const tasks = ref([])
    const isEditing = ref(false)
    const originalTaskData = ref(null)

    const filters = ref({
      startDate: '',
      endDate: '',
      status: 'all',
    })

    const columns = ref([
      {
        name: 'date',
        align: 'left',
        label: 'date',
        field: 'date',
        sortable: false,
      },
      {
        name: 'dueDate',
        align: 'left',
        label: 'dueDate',
        field: 'dueDate',
        sortable: false,
      },
      {
        name: 'playerName',
        align: 'left',
        label: 'playerName',
        field: 'playerName',
        sortable: false,
      },
      {
        name: 'notes',
        align: 'left',
        label: 'notes',
        field: 'notes',
        sortable: false,
      },
      {
        name: 'result',
        align: 'left',
        label: 'result',
        field: 'result',
        sortable: false,
      },
      {
        name: 'ok',
        align: 'center',
        label: 'completed',
        field: 'ok',
        sortable: false,
      },
    ])

    const fetchTasks = async () => {
      try {
        const filterObj = {}
        if (localSelectedPlayer.value) {
          filterObj.playerId = localSelectedPlayer.value.id
        }

        const result = await reportStore.getCallReport(filterObj)
        if (result && result.data) {
          tasks.value = result.data.map((item) => ({
            ...item,
            ok: item.completed,
            playerName: item.playerFullName,
            date: new Date(item.createdAt).toLocaleDateString(),
          }))
        } else {
          tasks.value = []
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
        tasks.value = []
      }
    }

    const filteredTasks = computed(() => tasks.value)

    // Watch for changes in the selectedPlayer prop
    watch(
      () => props.selectedPlayer,
      (newVal) => {
        if (newVal) {
          localSelectedPlayer.value = newVal
          taskData.value.playerId = newVal.id
          taskData.value.playerFullName = newVal.name + ' ' + newVal.surname
        }
      },
      { immediate: true },
    )

    // Watch for changes in the editTask prop
    watch(
      () => props.editTask,
      (newVal) => {
        if (newVal) {
          isEditing.value = true
          // Store the complete original task data
          originalTaskData.value = { ...newVal }
          taskData.value = {
            id: newVal.id,
            playerId: newVal.playerId,
            playerFullName: newVal.playerFullName,
            dueDate: String(newVal.dueDate).substring(0, 10),
            transfer: newVal.transfer,
            notes: newVal.notes,
            result: newVal.result,
            ok: newVal.completed,
          }
          localSelectedPlayer.value = {
            id: newVal.playerId,
            name: newVal.playerFullName.split(' ')[0],
            surname: newVal.playerFullName.split(' ').slice(1).join(' '),
          }
        }
      },
      { immediate: true },
    )

    const onPlayerFilter = async (val, update) => {
      if (!val || val.trim() === '') {
        update(() => {
          playerOptions.value = []
        })
        loading.value = false
        return
      }

      const needle = val.toLowerCase()
      loading.value = true
      const players = await playerStore.searchPlayer(needle)
      update(() => {
        playerOptions.value = players
        loading.value = false
      })
    }

    const onPlayerSelect = (player) => {
      if (player) {
        taskData.value.playerId = player.id
        taskData.value.playerFullName = player.value
      }
    }

    const clearPlayerData = () => {
      taskData.value = {
        id: null,
        playerId: null,
        playerFullName: '',
        dueDate: new Date().toISOString().split('T')[0],
        transfer: false,
        notes: '',
        result: '',
        ok: false,
      }
    }

    const onTaskDoubleClick = (task) => {
      isEditing.value = true
      // Store the complete original task data
      originalTaskData.value = { ...task }
      // Set the selected player
      localSelectedPlayer.value = {
        id: task.playerId,
        value: task.playerFullName,
      }

      taskData.value = {
        id: task.id,
        playerId: task.playerId,
        playerFullName: task.playerFullName,
        dueDate: String(task.dueDate).substring(0, 10),
        transfer: task.transfer,
        notes: task.notes,
        result: task.result,
        ok: task.ok,
      }
    }

    const onNew = () => {
      isEditing.value = false
      originalTaskData.value = null
      taskData.value = {
        id: null,
        playerId: null,
        playerFullName: '',
        dueDate: new Date().toISOString().split('T')[0],
        transfer: false,
        notes: '',
        result: '',
        ok: false,
      }
      localSelectedPlayer.value = null
      emit('update:editTask', null)
    }

    const onSave = async () => {
      if (!localSelectedPlayer.value) {
        return
      }

      const payload = {
        playerId: taskData.value.playerId,
        playerFullName: taskData.value.playerFullName,
        dueDate: taskData.value.dueDate,
        transfer: taskData.value.transfer,
        notes: taskData.value.notes,
        result: taskData.value.result,
        completed: taskData.value.ok,
      }

      if (isEditing.value && taskData.value.id) {
        // Merge original task data with updated form data to preserve fields like createdAt, createdBy, etc.
        const updatedPayload = {
          ...(originalTaskData.value || {}), // Include all original fields (with fallback)
          ...payload, // Override with updated form data
          id: taskData.value.id, // Ensure ID is set
        }

        await reportStore.updateCallReport(updatedPayload)
      } else {
        await reportStore.createCallReport(payload)
      }

      // Reset form for a new entry for the same player, but keep player info
      isEditing.value = false
      originalTaskData.value = null
      emit('update:editTask', null)

      taskData.value = {
        id: null,
        playerId: localSelectedPlayer.value.id,
        playerFullName: localSelectedPlayer.value.value,
        dueDate: new Date().toISOString().split('T')[0],
        transfer: false,
        notes: '',
        result: '',
        ok: false,
      }

      await fetchTasks()
    }

    const isFirstOpen = ref(true)

    const onDateChange = (val) => {
      filters.value.startDate = val.StartDate
      filters.value.endDate = val.EndDate
      if (isFirstOpen.value) {
        fetchTasks()
        isFirstOpen.value = false
      }
    }

    const onFilter = () => {
      fetchTasks()
    }
    const onDialogHide = () => {
      taskData.value = {
        id: null,
        playerId: localSelectedPlayer.value.id,
        playerFullName: localSelectedPlayer.value.value,
        dueDate: new Date().toISOString().split('T')[0],
        transfer: false,
        notes: '',
        result: '',
        ok: false,
      }
    }
    watch(show, (val) => {
      if (val) {
        filters.value = {
          startDate: '',
          endDate: '',
          status: 'all',
        }
        isFirstOpen.value = true
      }
    })

    return {
      show,
      taskData,
      localSelectedPlayer,
      playerOptions,
      loading,
      tasks,
      filters,
      columns,
      filteredTasks,
      onPlayerFilter,
      onPlayerSelect,
      clearPlayerData,
      onNew,
      onSave,
      onTaskDoubleClick,
      onFilter,
      fetchTasks,
      onDateChange,
      onDialogHide,
    }
  },
}
</script>
