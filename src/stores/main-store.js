import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalStorage, Dark } from 'quasar'

export const useMainStore = defineStore('main', {
  state: () => ({
    darkMode: false,
    locales: [
      {
        title: 'English',
        iconPath: '/assets/english-flag.png',
        lang: 'en',
      },
      {
        title: 'Turkish',
        iconPath: '/assets/turkish-flag.png',
        lang: 'tr',
      },
    ],
    selectedLocale: null,
    menus: [
      {
        title: 'cageOperations',
        icon: 'fa-solid fa-arrow-right',
        routeName: 'cageOperations',
        type: 'menu',
        permission: 'Addon.CageOperations',
      },
      {
        title: 'playerOperations',
        type: 'menu',
        icon: 'fa-solid fa-arrow-right',
        routeName: 'playerOperations',
        permission: 'Addon.PlayerOperations',
      },
      {
        title: 'tableOperations',
        icon: 'fa-solid fa-arrow-right',
        routeName: 'tableOperations',
        type: 'menu',
        permission: 'Addon.TableOperations',
      },
      {
        title: 'ticketOperations',
        type: 'menu',
        icon: 'fa-solid fa-arrow-right',
        routeName: 'ticketOperations',
        permission: 'Addon.TicketOperations',
      },
      {
        title: 'operations',
        type: 'dropdown',
        name: 'operations',
        permission: 'Addon.Operations',
        subMenus: [
          {
            title: 'customerInformation',
            icon: 'remove',
            routeName: 'customerInformation',
            permission: 'Addon.Operations.CustomerInformation',
          },
          {
            title: 'portfolioManagement',
            icon: 'remove',
            routeName: 'portfolioManagement',
            permission: 'Addon.Operations.PortfolioManagement',
          },
          {
            title: 'playerGifts',
            icon: 'remove',
            routeName: 'playerGifts',
            permission: 'Addon.Definitions.Gift.ShowList',
          },
          {
            title: 'blackListReport',
            icon: 'remove',
            routeName: 'blackListReport',
            permission: 'Addon.Operations.BlackListReport',
          },
          {
            title: 'cigaretteReport',
            icon: 'remove',
            routeName: 'cigaretteReport',
            permission: 'Addon.Operations.CigaretteReport',
          },
          {
            title: 'correctionInfosReport',
            icon: 'remove',
            routeName: 'correctionInfosReport',
            permission: 'Addon.Operations.CorrectionInfosReport',
          },
          {
            title: 'playerLookupAuditLogsReport',
            icon: 'remove',
            routeName: 'playerLookupAuditLogsReport',
            permission: 'Addon.Operations.PlayerLookupAuditLogsReport',
          },
        ],
      },
      {
        title: 'guestOperations',
        type: 'dropdown',
        name: 'guest',
        permission: 'Addon.GuestList',
        subMenus: [
          {
            title: 'hotelGuestList',
            icon: 'remove',
            routeName: 'hotelGuestList',
            permission: 'Addon.GuestList.ShowHotelList',
          },
        ],
      },
      {
        title: 'managementReports',
        type: 'dropdown',
        name: 'managementReports',
        permission: 'Addon.LiveGameReports',
        subMenus: [
          {
            title: 'activeFloorList',
            icon: 'remove',
            routeName: 'activeFloorListReport',
            permission: 'Addon.InOutReport.GetActiveFloorListReport',
          },
          {
            title: 'activeFloorInfo',
            icon: 'remove',
            routeName: 'activeFloorInfoReport',
            permission: 'Addon.InOutReport.ActiveFloorListReport',
          },
          {
            title: 'masterReport',
            icon: 'remove',
            routeName: 'masterReport',
            permission: 'Addon.Reports.MasterReport',
          },
          {
            title: 'balanceReport',
            icon: 'remove',
            routeName: 'balanceReport',
            permission: 'Addon.Reports.BalanceReport',
          },
          {
            title: 'callReport',
            icon: 'remove',
            routeName: 'callReport',
            permission: 'Addon.Operations.CallReport',
          },
          {
            title: 'playerWinLossAnalysis',
            icon: 'remove',
            routeName: 'playerWinLossAnalysisReport',
            permission: 'Addon.Operations.PlayerWinLossAnalysisReport',
          },
        ],
      },
      {
        title: 'pit',
        type: 'dropdown',
        name: 'pit',
        permission: 'Addon.PitOperations',
        subMenus: [
          {
            title: 'floorResult',
            icon: 'remove',
            routeName: 'liveGameFloorResultReport',
            permission: 'Addon.PitOperations.LiveGameFloorResultReport',
          },
          {
            title: 'missingChipReport',
            icon: 'remove',
            routeName: 'missingChipReport',
            permission: 'Addon.PitOperations.GetMissingChipReport',
          },
        ],
      },
      {
        title: 'reports',
        type: 'dropdown',
        name: 'reports',
        permission: 'Addon.Reports',
        subMenus: [
          {
            title: 'playerResult',
            icon: 'remove',
            routeName: 'playerResultReport',
            permission: 'Addon.LiveGameReports.GetPlayerResultReport',
          },
          {
            title: 'timeInOut',
            icon: 'remove',
            routeName: 'timeInOutReport',
            permission: 'Addon.InOutReport.GetTimeInOutReport',
          },
          {
            title: 'timeInOutByPlayer',
            icon: 'remove',
            routeName: 'timeInOutReportByPlayer',
            permission: 'Addon.LiveGameReports.GetTimeInOutReportByPlayer',
          },
          {
            title: 'timeInOutByTable',
            icon: 'remove',
            routeName: 'timeInOutReportByTable',
            permission: 'Addon.LiveGameReports.GetTimeInOutReportByTable',
          },
          {
            title: 'tableFloats',
            icon: 'remove',
            routeName: 'tableFloatsReport',
            permission: 'Addon.Definitions.TableFloats.ShowList',
          },
        ],
      },
      {
        title: 'inOutReport',
        type: 'dropdown',
        name: 'inOutReport',
        permission: 'Addon.InOutReport',
        subMenus: [
          {
            title: 'inOutReport',
            icon: 'remove',
            routeName: 'inOutReportNew',
            permission: 'Addon.InOutReport.GetInOutReportNew',
          },
          {
            title: 'inOutSelectedName',
            icon: 'remove',
            routeName: 'inOutSelectedNameReport',
            permission: 'Addon.InOutReport.GetInOutSelectedNameReport',
          },
          {
            title: 'filteredReport',
            icon: 'remove',
            routeName: 'filteredReport',
            permission: 'Addon.InOutReport.GetFilteredReport',
          },
          {
            title: 'netCashReport',
            icon: 'remove',
            routeName: 'netCashReport',
            permission: 'Addon.InOutReport.GetNetCashReport',
          },
          {
            title: 'inOutReportDetail',
            icon: 'remove',
            routeName: 'inOutReportDetail',
            permission: 'Addon.InOutReport.GetInoutAndNetCashReportDetail',
          },
        ],
      },
      {
        title: 'definitions',
        type: 'dropdown',
        name: 'definition',
        permission: 'Addon.Definitions',
        subMenus: [
          {
            title: 'chipManagement',
            type: 'dropdown',
            name: 'chipManagement',
            permission: 'Addon.Definitions',
            subMenus: [
              {
                title: 'chips',
                icon: 'remove',
                routeName: 'chips',
                permission: 'Addon.Definitions.Chips',
              },
              {
                title: 'chipOperations',
                icon: 'remove',
                routeName: 'chipOperations',
                permission: 'Addon.ChipOperations',
              },
              {
                title: 'floatSets',
                icon: 'remove',
                routeName: 'floatSets',
                permission: 'Addon.Definitions.FloatSets.ShowList',
              },
            ],
          },
          {
            title: 'guestManagement',
            type: 'dropdown',
            name: 'guestManagement',
            permission: 'Addon.Definitions',
            subMenus: [
              {
                title: 'roomTypes',
                icon: 'remove',
                routeName: 'roomTypes',
                permission: 'Addon.GuestList.RoomTypes',
              },
              {
                title: 'visitorCategories',
                icon: 'remove',
                routeName: 'visitorCategories',
                permission: 'Addon.GuestList.VisitorCategories',
              },
              {
                title: 'expenseParameters',
                icon: 'remove',
                routeName: 'expenseParameters',
                permission: 'Addon.GuestList.ExpenseParameters',
              },
            ],
          },
          {
            title: 'discounts',
            icon: 'remove',
            routeName: 'discounts',
            permission: 'Addon.Definitions.Discount.ShowList',
          },
          {
            title: 'transactionCodes',
            icon: 'remove',
            routeName: 'transactionCodes',
            permission: 'Addon.Definitions.TransactionCode',
          },
          {
            title: 'cashdesk',
            icon: 'remove',
            routeName: 'cashdesks',
            permission: 'Addon.Definitions.Cashdesk',
          },
          {
            title: 'playerClasses',
            icon: 'remove',
            routeName: 'playerClasses',
            permission: 'Addon.Definitions.PlayerClass',
          },
          {
            title: 'currencies',
            icon: 'remove',
            routeName: 'currencies',
            permission: 'Addon.Definitions.Currency',
          },
          {
            title: 'bankAccounts',
            icon: 'remove',
            routeName: 'bankAccounts',
            permission: 'Addon.Definitions.BankAccount.ShowList',
          },
          {
            title: 'tableGames',
            icon: 'remove',
            routeName: 'tableGames',
            permission: 'Addon.Definitions.TableGame.ShowList',
          },
          {
            title: 'gifts',
            icon: 'remove',
            routeName: 'gifts',
            permission: 'Addon.Definitions.Gift.ShowList',
          },
        ],
      },
    ],
  }),

  getters: {},

  actions: {
    setLocale(locale) {
      LocalStorage.set('locale', locale)
      this.selectedLocale = this.locales.find((l) => l.lang === locale)
    },
    setDarkMode(darkMode) {
      this.darkMode = darkMode
      Dark.set(darkMode)
      LocalStorage.set('darkMode', darkMode)
      try {
        const className = darkMode ? 'dark' : 'light'
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(className)
      } catch (error) {
        console.error(error)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
