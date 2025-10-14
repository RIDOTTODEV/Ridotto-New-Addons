import mainOidc from 'src/helpers/oidc-lib'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiredPermission: 'Addon',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/player-operations',
    component: () => import('layouts/PlayerOperationLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: () => import('pages/player-operations/IndexPage.vue'),
        name: 'playerOperations',
        meta: {
          requiredPermission: 'Addon.PlayerOperations',
          requiresAuth: true,
        },
      },
      {
        path: 'player-detail/:playerId',
        component: () => import('pages/player-operations/PlayerDetail.vue'),
        name: 'playerDetail',
        meta: {
          requiredPermission: 'Addon.PlayerOperations.PlayerDetail',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/cage-operations',
    component: () => import('layouts/CageOperationLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'cageOperations',
        component: () => import('pages/cage-operations/IndexPage.vue'),
        meta: {
          requiredPermission: 'Addon.CageOperations',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/definitions',
    component: () => import('layouts/DefinitionLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'definition',
    },
    children: [
      {
        path: 'settings',
        name: 'settings',
        component: () => import('src/pages/definitions/SettingsPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Settings',
          requiresAuth: true,
        },
      },
      {
        path: 'table-games',
        name: 'tableGames',
        component: () => import('src/pages/definitions/TableGames.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TableGame',
          requiresAuth: true,
        },
      },
      {
        path: 'transaction-codes',
        name: 'transactionCodes',
        component: () => import('src/pages/definitions/TransactionCodes.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TransactionCode',
          requiresAuth: true,
        },
      },
      {
        path: 'cashdesks',
        name: 'cashdesks',
        component: () => import('src/pages/definitions/CashdeskPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Cashdesk',
          requiresAuth: true,
        },
      },
      {
        path: 'petty-cash-categories',
        name: 'pettyCashCategories',
        component: () => import('src/pages/definitions/PettyCashCategoryPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.PettyCashCategory',
          requiresAuth: true,
        },
      },
      {
        path: 'player-classes',
        name: 'playerClasses',
        component: () => import('src/pages/definitions/PlayerClass.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.PlayerClass',
          requiresAuth: true,
        },
      },
      {
        path: 'table-games',
        name: 'tableGames',
        component: () => import('src/pages/definitions/TableGames.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TableGame',
          requiresAuth: true,
        },
      },
      {
        path: 'bank-accounts',
        name: 'bankAccounts',
        component: () => import('src/pages/definitions/BankAccount.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.BankAccount',
          requiresAuth: true,
        },
      },
      {
        path: 'discounts',
        name: 'discounts',
        component: () => import('src/pages/definitions/DiscountPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Discount',
          requiresAuth: true,
        },
      },
      {
        path: 'locations',
        name: 'locations',
        component: () => import('src/pages/definitions/Locations.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Location',
          requiresAuth: true,
        },
      },
      {
        path: 'currencies',
        name: 'currencies',
        component: () => import('src/pages/definitions/CurrenciesPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Currency',
          requiresAuth: true,
        },
      },
      {
        path: 'gifts',
        name: 'gifts',
        component: () => import('src/pages/definitions/guest-management/GiftPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Gift',
          requiresAuth: true,
        },
      },
      {
        path: 'room-types',
        name: 'roomTypes',
        component: () => import('src/pages/definitions/guest-management/RoomTypes.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.RoomType',
          requiresAuth: true,
          groupName: 'definitionGuestManagement',
        },
      },
      {
        path: 'visitor-categories',
        name: 'visitorCategories',
        component: () => import('src/pages/definitions/guest-management/PlayerCategory.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.VisitorCategory',
          requiresAuth: true,
          groupName: 'definitionGuestManagement',
        },
      },
      {
        path: 'expense-parameters',
        name: 'expenseParameters',
        component: () => import('src/pages/definitions/guest-management/ExpenseParameter.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.ExpenseParameter',
          requiresAuth: true,
          groupName: 'definitionGuestManagement',
        },
      },
      {
        path: 'chips',
        name: 'chips',
        component: () => import('src/pages/definitions/chip-management/ChipsPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Chips',
          requiresAuth: true,
          groupName: 'definitionChipManagement',
        },
      },
      {
        path: 'float-sets',
        name: 'floatSets',
        component: () => import('src/pages/definitions/chip-management/FloatSet.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.FloatSets',
          requiresAuth: true,
          groupName: 'definitionChipManagement',
        },
      },
      {
        path: 'chip-operations',
        name: 'chipOperations',
        component: () => import('src/pages/definitions/chip-management/ChipOperation.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.ChipOperations',
          requiresAuth: true,
          groupName: 'definitionChipManagement',
        },
      },
    ],
  },
  {
    path: '/table-operations',
    component: () => import('layouts/MainLayout.vue'),

    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'tableOperations',
    },
    children: [
      {
        path: '',
        name: 'tableOperations',
        component: () => import('pages/table-operations/IndexPage.vue'),
        meta: {
          requiredPermission: 'Addon.TableOperations',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/guest-operations',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'guestOperations',
    },
    children: [
      {
        path: 'hotel-guest-list',
        name: 'hotelGuestList',
        component: () => import('pages/guest-operations/HotelGuestList.vue'),
        meta: {
          requiredPermission: 'Addon.GuestOperations.HotelGuestList',
          requiresAuth: true,
        },
      },
      {
        path: 'junket-operation',
        name: 'junketOperation',
        component: () => import('pages/guest-operations/JunketOperation.vue'),
        meta: {
          requiredPermission: 'Addon.GuestOperations.JunketOperation',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/slot-operations',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'slotOperations',
    },
    children: [
      {
        path: 'players-in-out',
        name: 'playersInOut',
        component: () => import('pages/slot/PlayersInOut.vue'),
        meta: {
          requiredPermission: 'Addon.SlotOperations.PlayersInOut',
          requiresAuth: true,
        },
      },
      {
        path: 'slot-in-out-report',
        name: 'slotInOutReport',
        component: () => import('pages/slot/SlotInOutReport.vue'),
        meta: {
          requiredPermission: 'Addon.SlotOperations.SlotInOutReport',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/reports',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
    },
    children: [
      {
        path: 'inout-report',
        name: 'inOutReportNew',
        component: () => import('pages/reports/inout-reports/InOutReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetInOutReportNew',
          requiresAuth: true,
          groupName: 'inOutReport',
        },
      },
      {
        path: 'filtered-report',
        name: 'filteredReport',
        component: () => import('pages/reports/inout-reports/FilteredReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetFilteredReport',
          requiresAuth: true,
          groupName: 'inOutReport',
        },
      },
      {
        path: 'net-cash-report',
        name: 'netCashReport',
        component: () => import('pages/reports/inout-reports/NetCashReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetNetCashReport',
          requiresAuth: true,
          groupName: 'inOutReport',
        },
      },
      {
        path: 'inout-report-detail',
        name: 'inOutReportDetail',
        component: () => import('pages/reports/inout-reports/InOutReportDetail.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetInOutReportDetail',
          requiresAuth: true,
          groupName: 'inOutReport',
        },
      },
      {
        path: 'inout-selected-name-report',
        name: 'inOutSelectedNameReport',
        component: () => import('pages/reports/inout-reports/InOutSelectedNameReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetInOutSelectedNameReport',
          requiresAuth: true,
          groupName: 'inOutReport',
        },
      },
      {
        path: 'player-result-report',
        name: 'playerResultReport',
        component: () => import('pages/reports/reports/GetPlayerResultReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetPlayerResultReport',
          requiresAuth: true,
          groupName: 'reports',
        },
      },
      {
        path: 'time-inout-report',
        name: 'timeInOutReport',
        component: () => import('pages/reports/reports/GetTimeInOutReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetTimeInOutReport',
          requiresAuth: true,
          groupName: 'reports',
        },
      },
      {
        path: 'time-inout-report-by-player',
        name: 'timeInOutReportByPlayer',
        component: () => import('pages/reports/reports/GetTimeInOutByPlayerReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetTimeInOutReportByPlayer',
          requiresAuth: true,
          groupName: 'reports',
        },
      },
      {
        path: 'time-inout-report-by-table',
        name: 'timeInOutReportByTable',
        component: () => import('pages/reports/reports/GetTimeInOutByTableReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetTimeInOutReportByTable',
          requiresAuth: true,
          groupName: 'reports',
        },
      },
      {
        path: 'table-floats-report',
        name: 'tableFloatsReport',
        component: () => import('pages/reports/reports/GetTableFloatsReport.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TableFloats.ShowList',
          requiresAuth: true,
          groupName: 'reports',
        },
      },
      {
        path: 'active-floor-list-report',
        name: 'activeFloorListReport',
        component: () => import('src/pages/reports/management-reports/ActiveFloorListReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetActiveFloorListReport',
          requiresAuth: true,
          groupName: 'managementReports',
        },
      },
      {
        path: 'active-floor-info-report',
        name: 'activeFloorInfoReport',
        component: () => import('src/pages/reports/management-reports/ActiveFloorInfoReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetActiveFloorInfoReport',
          requiresAuth: true,
          groupName: 'managementReports',
        },
      },
      {
        path: 'master-report',
        name: 'masterReport',
        component: () => import('src/pages/reports/management-reports/MasterReport.vue'),
        meta: {
          requiredPermission: 'Addon.Reports.MasterReport',
          requiresAuth: true,
          groupName: 'managementReports',
        },
      },
      {
        path: 'balance-report',
        name: 'balanceReport',
        component: () => import('src/pages/reports/management-reports/BalanceReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetBalanceReport',
          requiresAuth: true,
          groupName: 'managementReports',
        },
      },
      {
        path: 'call-report',
        name: 'callReport',
        component: () => import('src/pages/reports/management-reports/CallReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CallReport',
          requiresAuth: true,
          groupName: 'managementReports',
        },
      },
      {
        path: 'player-win-loss-analysis-report',
        name: 'playerWinLossAnalysisReport',
        component: () =>
          import('src/pages/reports/management-reports/PlayerWinLossAnalysisReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.PlayerWinLossAnalysisReport',
          requiresAuth: true,
          groupName: 'managementReports',
        },
      },
    ],
  },
  {
    path: '/operations',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'operations',
    },
    children: [
      {
        path: 'portfolio-management',
        name: 'portfolioManagement',
        component: () => import('src/pages/operations/PortfolioManagement.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.PortfolioManagement',
          requiresAuth: true,
        },
      },
      {
        path: 'customer-information',
        name: 'customerInformation',
        component: () => import('src/pages/operations/CustomerInformation.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CustomerInformation',
          requiresAuth: true,
        },
      },
      {
        path: 'black-list-report',
        name: 'blackListReport',
        component: () => import('src/pages/operations/BlackListReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.BlackListReport',
          requiresAuth: true,
        },
      },
      {
        path: 'cigarette-report',
        name: 'cigaretteReport',
        component: () => import('src/pages/operations/CigaretteReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CigaretteReport',
          requiresAuth: true,
        },
      },
      {
        path: 'correction-infos-report',
        name: 'correctionInfosReport',
        component: () => import('src/pages/operations/CorrectionInfosReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CorrectionInfosReport',
          requiresAuth: true,
        },
      },
      {
        path: 'player-lookup-audit-logs-report',
        name: 'playerLookupAuditLogsReport',
        component: () => import('src/pages/operations/PlayerLookupAuditLogsReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.PlayerLookupAuditLogsReport',
          requiresAuth: true,
        },
      },
      {
        path: 'player-gifts',
        name: 'playerGifts',
        component: () => import('src/pages/operations/PlayerGifts.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.PlayerGifts',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/inspector',
    component: () => import('layouts/InspectorLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'inspector',
    },
    children: [
      {
        path: '',
        name: 'inspector',
        component: () => import('pages/inspector/InspectorPage.vue'),
        meta: {
          requiredPermission: 'Addon.Inspector',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/pit',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authName: mainOidc.authName,
      requiresAuth: true,
      groupName: 'pit',
    },
    children: [
      {
        path: 'live-game-floor-result-report',
        name: 'liveGameFloorResultReport',
        component: () => import('src/pages/pit/LiveGameFlootResultReport.vue'),
        meta: {
          requiredPermission: 'Addon.Pit.LiveGameFloorResultReport',
          requiresAuth: true,
        },
      },
      {
        path: 'missing-chip-report',
        name: 'missingChipReport',
        component: () => import('src/pages/pit/MissingChipReport.vue'),
        meta: {
          requiredPermission: 'Addon.Pit.MissingChipReport',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/callback',
    name: 'OidcCallback',
    component: () => import('pages/auth/OidcCallback.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth/signinwin/main',
    name: 'SignInWindow',
    component: () => import('pages/auth/OidcCallback.vue'),
    meta: { requiresAuth: false },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
