import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import {
  searchService,
  playerAccountService,
  cashdeskTransactionService,
  blacklistService,
  playerService,
  playerClassService,
  playerNoteService,
  playerFriendshipService,
  countryService,
  playerInfoService,
  playerLinkService,
  playerAttachmentService,
  playerLgReportService,
} from 'src/api'
import { LocalStorage } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { errorHandle } from 'src/helpers/helpers'
export const usePlayerStore = defineStore('playerStore', {
  state: () => ({
    lastSearchedPlayers: [],
    selectedPlayer: null,
    playerClasses: [],
    playerDepositAndCredits: [],
    accountTypes: [],
    dateTimeFilterValues: {},
    accountTransactionTypes: [
      {
        value: 'deposit',
        label: 'Deposit',
      },
      {
        value: 'withdrawal',
        label: 'Withdrawal',
      },
    ],
    countries: [],
  }),
  getters: {
    getClassById: (state) => (id) => {
      return state.playerClasses.find((c) => c.id === id)
    },
    getAccountTypesForPlayer: (state) => {
      return state.accountTypes.filter((at) => at.name !== 'NonRestricted')
    },
    getSelectedPlayerId: (state) => {
      return state.selectedPlayer?.player?.id
    },
  },
  actions: {
    async searchPlayer(needle) {
      const { data } = await searchService.player({ input: needle })
      return data
    },
    setLastSearchedPlayer(player) {
      // first check if the player is already in the array and then check the length of the array it will max 10 players
      if (this.lastSearchedPlayers.length >= 10) {
        this.lastSearchedPlayers.pop()
      }

      const index = this.lastSearchedPlayers.findIndex((p) => p.id === player.id)
      if (index !== -1) {
        this.lastSearchedPlayers.splice(index, 1)
      }
      this.lastSearchedPlayers.unshift(player)
      LocalStorage.set('lastSearchedPlayers', this.lastSearchedPlayers)
    },
    initLastSearchedPlayers() {
      this.lastSearchedPlayers = LocalStorage.getItem('lastSearchedPlayers') || []
    },
    async fetchPlayerMetaDetail(params) {
      const { data } = await playerAccountService.getPlayerMetaDetail(params)
      this.selectedPlayer = { ...data }
      await this.fetchDepositAndCredits(params.playerId)
    },
    async fetchDepositAndCredits(playerId = null) {
      const authStore = useAuthStore()
      const params = {
        playerId: playerId || this.selectedPlayer.player.id,
        defaultCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await cashdeskTransactionService.getDepositsAndCredits(params)
      this.playerDepositAndCredits = data
    },
    async updatePlayerDefaultCurrency(params) {
      await playerService.updateDefaultCurrency(params)
      this.fetchPlayerMetaDetail({ playerId: params.playerId })
    },
    async updatePlayerBlacklist(params) {
      const { data } = await playerService.updateBlackList(params)
      return data
    },
    async fetchPlayerBlackListHistory(params) {
      const { data } = await blacklistService.getAll(params)
      return data
    },
    async fetchPlayerClasses() {
      const { data } = await playerClassService.getAll()
      this.playerClasses = data.data
    },
    async updatePlayerClass(params) {
      await playerService.updateUserClass(params)
      this.fetchPlayerMetaDetail({ playerId: params.playerId })
    },
    async updatePlayerDiscount(params) {
      await playerService.updateDiscount(params)
      this.fetchPlayerMetaDetail({ playerId: params.playerId })
    },
    async fetchPlayerNotes(params) {
      const { data } = await playerNoteService.getAll(params)
      return data.data
    },
    async createPlayerNote(params) {
      await playerNoteService.create(params)
    },
    async updatePlayerNote(params) {
      await playerNoteService.update(params)
    },
    async deletePlayerNote(params) {
      await playerNoteService.delete(params)
    },
    async fetchPlayerFriends(params) {
      const { data } = await playerFriendshipService.getPlayerFriendship(params)
      return data
    },
    async createPlayerFriend(params) {
      await playerFriendshipService.create(params)
    },
    async deletePlayerFriend(params) {
      await playerFriendshipService.delete(params)
    },
    async getAccountsWithTotals(params) {
      const payload = {
        ...params,
        ...this.dateTimeFilterValues,
      }
      return await playerAccountService.getAccountsWithTotals(payload)
    },
    async fetchAccountTypes() {
      const { data } = await playerAccountService.getPlayerAccountTypes()
      this.accountTypes = Object.keys(data).map((key) => {
        return { id: key, name: data[key] }
      })
    },
    async getPlayerAccountWithdrawalAllAmount(params) {
      const { data } = await playerAccountService.getPlayerAccounts(params)
      return (
        data.accounts.reduce((acc, account) => {
          if (account.accountId === params.accountId) {
            return acc + account.amount
          }
          return acc
        }, 0) || 0
      )
    },
    async postCashdeskTransaction(params) {
      const { data } = await playerAccountService.postCashdeskTransaction(params)
      return data
    },
    async getPlayerLastTransaction(params) {
      const { data } = await playerAccountService.getLastTransactions(params)
      return data
    },
    async getPlayerLastCashdeskTransaction(params) {
      const { data } = await playerAccountService.getLastCashTransactions(params)
      return data
    },
    setDateTimeFilterValues(params) {
      this.dateTimeFilterValues = params
    },
    async fetchPlayerAccountTransactions(payload) {
      const authStore = useAuthStore()
      const params = {
        ...payload,
        defaultCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await playerAccountService.getAccountTransactions(params)
      return data
    },
    async fetchPlayerLastCageTransactions(params) {
      const { data } = await playerAccountService.getLastCashTransactions(params)
      return data
    },
    async fetchPlayerLastCashlessTransactions(params) {
      const { data } = await playerAccountService.getLastTransactions(params)
      return data
    },
    async fetchPlayerLastChipTransactions(params) {
      const { data } = await cashdeskTransactionService.getLastChipTransactions(params)
      return data
    },
    async playerChipTransaction(params) {
      const { data } = await cashdeskTransactionService.cashdeskChipTransaction(params)
      return data
    },
    async fetchCountries() {
      const { data } = await countryService.getAll()
      this.countries = data.data
    },
    async fetchPlayerById(params) {
      const { data } = await playerService.get(params)
      return data
    },
    async fetchPlayerInformationDetail(params) {
      const { data } = await playerInfoService.getPlayerInformationDetail(params)
      return data
    },
    async fetchPlayerInformationMetaDetail(params) {
      const { data } = await playerInfoService.getPlayerInformationMetaDetail(params)
      return data
    },
    async updatePlayerMetaDetail(params) {
      return await playerService.updatePlayerMetaDetail(params)
    },
    async playerPostCashDeskCashTransaction(data) {
      return await api
        .post(`/api${data.methodName}`, data)
        .then(() => {
          return true
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchPlayerLinkedPlayers(params) {
      const { data } = await playerLinkService.getLinkedPlayersByPlayer(params)
      return data
    },
    async createPlayerLinkedPlayer(params) {
      await playerLinkService.add(params)
    },
    async deletePlayerLinkedPlayer(params) {
      await playerLinkService.delete(params)
    },
    async updatePlayerStatusFlags(params) {
      return await playerService.updatePlayerStatusFlags(params)
    },
    async createPlayerAttechment(params) {
      await playerAttachmentService.add(params)
    },
    async deletePlayerAttechment(params) {
      await playerAttachmentService.delete(params)
    },
    async fetchPlayerAttechments(params) {
      const { data } = await playerAttachmentService.getAllByPlayer(params)
      return data
    },
    async fetchPlayerTransactions(params) {
      const { data } = await playerService.getPlayerTransactions(params)
      return data
    },
    async fetchPlayerLgTableResult(params) {
      const { data } = await playerLgReportService.getPlayerLgTableResult(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
