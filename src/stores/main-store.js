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
        icon: 'account_balance',
        routeName: 'cageOperations',
        type: 'menu',
        permission: 'Addon.CageOperations',
      },
      {
        title: 'playerOperations',
        type: 'menu',
        icon: 'person_search',
        routeName: 'playerOperations',
        permission: 'Addon.PlayerOperations',
      },
      {
        title: 'tableOperations',
        icon: 'border_clear',
        routeName: 'tableOperations',
        type: 'menu',
        permission: 'Addon.TableOperations',
      },
      /*       {
        title: 'ticketOperations',
        type: 'menu',
        icon: 'fa-solid fa-arrow-right',
        routeName: 'ticketOperations',
        permission: 'Addon.TicketOperations',
      }, */
      {
        title: 'operations',
        type: 'dropdown',
        name: 'operations',
        icon: 'manage_accounts',
        permission: 'Addon.Operations',
        subMenus: [
          {
            title: 'customerInformation',
            
            routeName: 'customerInformation',
            permission: 'Addon.Operations.CustomerInformation',
          },
          {
            title: 'portfolioManagement',
            
            routeName: 'portfolioManagement',
            permission: 'Addon.Operations.PortfolioManagement',
          },
          /*           {
            title: 'playerGifts',
            
            routeName: 'playerGifts',
            permission: 'Addon.Definitions.Gift.ShowList',
          }, */
          {
            title: 'blackListReport',
            
            routeName: 'blackListReport',
            permission: 'Addon.Operations.BlackListReport',
          },
          {
            title: 'cigaretteReport',
            
            routeName: 'cigaretteReport',
            permission: 'Addon.Operations.CigaretteReport',
          },
          {
            title: 'correctionInfosReport',
            
            routeName: 'correctionInfosReport',
            permission: 'Addon.Operations.CorrectionInfosReport',
          },
          {
            title: 'playerLookupAuditLogsReport',
            
            routeName: 'playerLookupAuditLogsReport',
            permission: 'Addon.Operations.PlayerLookupAuditLogsReport',
          },
        ],
      },
      {
        title: 'guestOperations',
        type: 'dropdown',
        name: 'guestOperations',
        icon: 'hotel',
        permission: 'Addon.GuestList',
        subMenus: [
          {
            title: 'hotelGuestList',
            
            routeName: 'hotelGuestList',
            permission: 'Addon.GuestList.ShowHotelList',
          },
          {
            title: 'junketOperation',
            
            routeName: 'junketOperation',
            permission: 'Addon.GuestOperations.JunketOperation',
          },
        ],
      },
      {
        title: 'slot',
        type: 'dropdown',
        name: 'slotOperations',
        icon: 'casino',
        permission: 'Addon.SlotOperations',
        subMenus: [
          {
            title: 'playersInOut',
            
            routeName: 'playersInOut',
            permission: 'Addon.SlotOperations.PlayersInOut',
          },
          {
            title: 'slotInOutReport',
            
            routeName: 'slotInOutReport',
            permission: 'Addon.SlotOperations.SlotInOutReport',
          },
          {
            title: 'slotWinLoss',
            
            routeName: 'slotWinLoss',
            permission: 'Addon.SlotOperations.SlotWinLoss',
          },
        ],
      },
      {
        title: 'managementReports',
        type: 'dropdown',
        name: 'managementReports',
        icon: 'analytics',
        permission: 'Addon.LiveGameReports',
        subMenus: [
          {
            title: 'activeFloorList',
            
            routeName: 'activeFloorListReport',
            permission: 'Addon.InOutReport.GetActiveFloorListReport',
          },
          {
            title: 'activeFloorInfo',
            
            routeName: 'activeFloorInfoReport',
            permission: 'Addon.InOutReport.ActiveFloorListReport',
          },
          {
            title: 'masterReport',
            
            routeName: 'masterReport',
            permission: 'Addon.Reports.MasterReport',
          },
          {
            title: 'balanceReport',
            
            routeName: 'balanceReport',
            permission: 'Addon.Reports.BalanceReport',
          },
          {
            title: 'callReport',
            
            routeName: 'callReport',
            permission: 'Addon.Operations.CallReport',
          },
          {
            title: 'playerWinLossAnalysis',
            
            routeName: 'playerWinLossAnalysisReport',
            permission: 'Addon.Operations.PlayerWinLossAnalysisReport',
          },
          {
            title: 'marketerReport',
            
            routeName: 'marketerReport',
            permission: 'Addon.Operations.MarketerReports',
          },
        ],
      },
      {
        title: 'pit',
        type: 'dropdown',
        name: 'pit',
        icon: 'grid_view',
        permission: 'Addon.PitOperations',
        subMenus: [
          {
            title: 'floorResult',
            
            routeName: 'liveGameFloorResultReport',
            permission: 'Addon.PitOperations.LiveGameFloorResultReport',
          },
          {
            title: 'missingChipReport',
            
            routeName: 'missingChipReport',
            permission: 'Addon.PitOperations.GetMissingChipReport',
          },
        ],
      },
      {
        title: 'reports',
        type: 'dropdown',
        name: 'reports',
        icon: 'summarize',
        permission: 'Addon.Reports',
        subMenus: [
          {
            title: 'playerResult',
            
            routeName: 'playerResultReport',
            permission: 'Addon.LiveGameReports.GetPlayerResultReport',
          },
          {
            title: 'timeInOut',
            
            routeName: 'timeInOutReport',
            permission: 'Addon.InOutReport.GetTimeInOutReport',
          },
          {
            title: 'timeInOutByPlayer',
            
            routeName: 'timeInOutReportByPlayer',
            permission: 'Addon.LiveGameReports.GetTimeInOutReportByPlayer',
          },
          {
            title: 'timeInOutByTable',
            
            routeName: 'timeInOutReportByTable',
            permission: 'Addon.LiveGameReports.GetTimeInOutReportByTable',
          },
          {
            title: 'tableFloats',
            
            routeName: 'tableFloatsReport',
            permission: 'Addon.Definitions.TableFloats.ShowList',
          },
        ],
      },
      {
        title: 'inOutReport',
        type: 'dropdown',
        name: 'inOutReport',
        icon: 'swap_horiz',
        permission: 'Addon.InOutReport',
        subMenus: [
          {
            title: 'inOutReport',
            
            routeName: 'inOutReportNew',
            permission: 'Addon.InOutReport.GetInOutReportNew',
          },
          {
            title: 'inOutSelectedName',
            
            routeName: 'inOutSelectedNameReport',
            permission: 'Addon.InOutReport.GetInOutSelectedNameReport',
          },
          {
            title: 'filteredReport',
            
            routeName: 'filteredReport',
            permission: 'Addon.InOutReport.GetFilteredReport',
          },
          {
            title: 'netCashReport',
            
            routeName: 'netCashReport',
            permission: 'Addon.InOutReport.GetNetCashReport',
          },
          {
            title: 'inOutReportDetail',
            
            routeName: 'inOutReportDetail',
            permission: 'Addon.InOutReport.GetInoutAndNetCashReportDetail',
          },
        ],
      },
      {
        title: 'definitions',
        type: 'dropdown',
        name: 'definition',
        icon: 'settings',
        permission: 'Addon.Definitions',
        subMenus: [
          {
            title: 'chipManagement',
            type: 'dropdown',
            name: 'definition',
            permission: 'Addon.Definitions',
            subMenus: [
              {
                title: 'chips',
                
                routeName: 'chips',
                permission: 'Addon.Definitions.Chips',
              },
              {
                title: 'chipOperations',
                
                routeName: 'chipOperations',
                permission: 'Addon.ChipOperations',
              },
              {
                title: 'floatSets',
                
                routeName: 'floatSets',
                permission: 'Addon.Definitions.FloatSets.ShowList',
              },
            ],
          },
          {
            title: 'guestManagement',
            type: 'dropdown',
            name: 'definition',
            permission: 'Addon.Definitions',
            subMenus: [
              {
                title: 'roomTypes',
                
                routeName: 'roomTypes',
                permission: 'Addon.GuestList.RoomTypes',
              },
              {
                title: 'visitorCategories',
                
                routeName: 'visitorCategories',
                permission: 'Addon.GuestList.VisitorCategories',
              },
              {
                title: 'expenseParameters',
                
                routeName: 'expenseParameters',
                permission: 'Addon.GuestList.ExpenseParameters',
              },
            ],
          },
          {
            title: 'locations',
            
            routeName: 'locations',
            permission: 'Addon.Definitions.Location.ShowList',
          },
          {
            title: 'discounts',
            
            routeName: 'discounts',
            permission: 'Addon.Definitions.Discount.ShowList',
          },
          {
            title: 'transactionCodes',
            
            routeName: 'transactionCodes',
            permission: 'Addon.Definitions.TransactionCode',
          },
          {
            title: 'cashdesk',
            
            routeName: 'cashdesks',
            permission: 'Addon.Definitions.Cashdesk',
          },
          {
            title: 'pettyCashCategories',
            
            routeName: 'pettyCashCategories',
            permission: 'Addon.Definitions.PettyCashCategory',
          },
          {
            title: 'playerClasses',
            
            routeName: 'playerClasses',
            permission: 'Addon.Definitions.PlayerClass',
          },
          {
            title: 'currencies',
            
            routeName: 'currencies',
            permission: 'Addon.Definitions.Currency',
          },
          {
            title: 'bankAccounts',
            
            routeName: 'bankAccounts',
            permission: 'Addon.Definitions.BankAccount.ShowList',
          },
          {
            title: 'tableGames',
            
            routeName: 'tableGames',
            permission: 'Addon.Definitions.TableGame.ShowList',
          },
          {
            title: 'gifts',
            
            routeName: 'gifts',
            permission: 'Addon.Definitions.Gift.ShowList',
          },
          {
            title: 'settings',
            
            routeName: 'settings',
            permission: 'Addon.Definitions.Settings',
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
