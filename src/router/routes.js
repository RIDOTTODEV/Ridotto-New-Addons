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
          breadcrumb: [{ name: 'index' }],
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
          breadcrumb: [{ name: 'playerOperations' }],
        },
      },
      {
        path: 'player-detail/:playerId',
        component: () => import('pages/player-operations/PlayerDetail.vue'),
        name: 'playerDetail',
        meta: {
          requiredPermission: 'Addon.PlayerOperations.PlayerDetail',
          requiresAuth: true,
          breadcrumb: [{ name: 'playerOperations' }, { name: 'playerDetail' }],
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
          breadcrumb: [{ name: 'cageOperations' }],
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
          breadcrumb: [{ name: 'definitions' }, { name: 'settings' }],
        },
      },
      {
        path: 'table-games',
        name: 'tableGames',
        component: () => import('src/pages/definitions/TableGames.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TableGame',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'tableGames' }],
        },
      },
      {
        path: 'transaction-codes',
        name: 'transactionCodes',
        component: () => import('src/pages/definitions/TransactionCodes.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TransactionCode',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'transactionCodes' }],
        },
      },
      {
        path: 'cashdesks',
        name: 'cashdesks',
        component: () => import('src/pages/definitions/CashdeskPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Cashdesk',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'cashdesks' }],
        },
      },
      {
        path: 'petty-cash-categories',
        name: 'pettyCashCategories',
        component: () => import('src/pages/definitions/PettyCashCategoryPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.PettyCashCategory',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'pettyCashCategories' }],
        },
      },
      {
        path: 'player-classes',
        name: 'playerClasses',
        component: () => import('src/pages/definitions/PlayerClass.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.PlayerClass',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'playerClasses' }],
        },
      },
      {
        path: 'table-games',
        name: 'tableGames',
        component: () => import('src/pages/definitions/TableGames.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TableGame',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'tableGames' }],
        },
      },
      {
        path: 'bank-accounts',
        name: 'bankAccounts',
        component: () => import('src/pages/definitions/BankAccount.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.BankAccount',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'bankAccounts' }],
        },
      },
      {
        path: 'discounts',
        name: 'discounts',
        component: () => import('src/pages/definitions/DiscountPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Discount',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'discounts' }],
        },
      },
      {
        path: 'locations',
        name: 'locations',
        component: () => import('src/pages/definitions/Locations.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Location',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'locations' }],
        },
      },
      {
        path: 'currencies',
        name: 'currencies',
        component: () => import('src/pages/definitions/CurrenciesPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Currency',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'currencies' }],
        },
      },
      {
        path: 'gifts',
        name: 'gifts',
        component: () => import('src/pages/definitions/guest-management/GiftPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Gift',
          requiresAuth: true,
          breadcrumb: [{ name: 'definitions' }, { name: 'gifts' }],
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
          breadcrumb: [
            { name: 'definitions' },
            { name: 'guestManagement' },
            { name: 'roomTypes' },
          ],
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
          breadcrumb: [
            { name: 'definitions' },
            { name: 'guestManagement' },
            { name: 'visitorCategories' },
          ],
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
          breadcrumb: [
            { name: 'definitions' },
            { name: 'guestManagement' },
            { name: 'expenseParameters' },
          ],
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
          breadcrumb: [{ name: 'definitions' }, { name: 'chipManagement' }, { name: 'chips' }],
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
          breadcrumb: [{ name: 'definitions' }, { name: 'chipManagement' }, { name: 'floatSets' }],
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
          breadcrumb: [
            { name: 'definitions' },
            { name: 'chipManagement' },
            { name: 'chipOperations' },
          ],
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
          breadcrumb: [{ name: 'tableOperations' }],
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
          breadcrumb: [{ name: 'guestOperations' }, { name: 'hotelGuestList' }],
        },
      },
      {
        path: 'junket-operation',
        name: 'junketOperation',
        component: () => import('pages/guest-operations/JunketOperation.vue'),
        meta: {
          requiredPermission: 'Addon.GuestOperations.JunketOperation',
          requiresAuth: true,
          breadcrumb: [{ name: 'guestOperations' }, { name: 'junketOperation' }],
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
          breadcrumb: [{ name: 'slot' }, { name: 'playersInOut' }],
        },
      },
      {
        path: 'slot-in-out-report',
        name: 'slotInOutReport',
        component: () => import('pages/slot/SlotInOutReport.vue'),
        meta: {
          requiredPermission: 'Addon.SlotOperations.SlotInOutReport',
          requiresAuth: true,
          breadcrumb: [{ name: 'slot' }, { name: 'slotInOutReport' }],
        },
      },
      {
        path: 'slot-win-loss',
        name: 'slotWinLoss',
        component: () => import('pages/slot/SlotWinLoss.vue'),
        meta: {
          requiredPermission: 'Addon.SlotOperations.SlotWinLoss',
          requiresAuth: true,
          breadcrumb: [{ name: 'slot' }, { name: 'slotWinLoss' }],
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
          breadcrumb: [{ name: 'inOutReport' }, { name: 'inOutReportNew' }],
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
          breadcrumb: [{ name: 'inOutReport' }, { name: 'filteredReport' }],
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
          breadcrumb: [{ name: 'inOutReport' }, { name: 'netCashReport' }],
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
          breadcrumb: [{ name: 'inOutReport' }, { name: 'inOutReportDetail' }],
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
          breadcrumb: [{ name: 'inOutReport' }, { name: 'inOutSelectedNameReport' }],
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
          breadcrumb: [{ name: 'reports' }, { name: 'playerResultReport' }],
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
          breadcrumb: [{ name: 'reports' }, { name: 'timeInOutReport' }],
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
          breadcrumb: [{ name: 'reports' }, { name: 'timeInOutReportByPlayer' }],
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
          breadcrumb: [{ name: 'reports' }, { name: 'timeInOutReportByTable' }],
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
          breadcrumb: [{ name: 'reports' }, { name: 'tableFloatsReport' }],
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
          breadcrumb: [{ name: 'managementReports' }, { name: 'activeFloorListReport' }],
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
          breadcrumb: [{ name: 'managementReports' }, { name: 'activeFloorInfoReport' }],
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
          breadcrumb: [{ name: 'managementReports' }, { name: 'masterReport' }],
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
          breadcrumb: [{ name: 'managementReports' }, { name: 'balanceReport' }],
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
          breadcrumb: [{ name: 'managementReports' }, { name: 'callReport' }],
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
          breadcrumb: [{ name: 'managementReports' }, { name: 'playerWinLossAnalysisReport' }],
        },
      },
      {
        path: 'marketer-report',
        name: 'marketerReport',
        component: () => import('src/pages/reports/management-reports/MarketerReports.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.MarketerReport',
          requiresAuth: true,
          groupName: 'managementReports',
          breadcrumb: [{ name: 'managementReports' }, { name: 'marketerReport' }],
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
          breadcrumb: [{ name: 'operations' }, { name: 'portfolioManagement' }],
        },
      },
      {
        path: 'customer-information',
        name: 'customerInformation',
        component: () => import('src/pages/operations/CustomerInformation.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CustomerInformation',
          requiresAuth: true,
          breadcrumb: [{ name: 'operations' }, { name: 'customerInformation' }],
        },
      },
      {
        path: 'black-list-report',
        name: 'blackListReport',
        component: () => import('src/pages/operations/BlackListReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.BlackListReport',
          requiresAuth: true,
          breadcrumb: [{ name: 'operations' }, { name: 'blackListReport' }],
        },
      },
      {
        path: 'cigarette-report',
        name: 'cigaretteReport',
        component: () => import('src/pages/operations/CigaretteReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CigaretteReport',
          requiresAuth: true,
          breadcrumb: [{ name: 'operations' }, { name: 'cigaretteReport' }],
        },
      },
      {
        path: 'correction-infos-report',
        name: 'correctionInfosReport',
        component: () => import('src/pages/operations/CorrectionInfosReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CorrectionInfosReport',
          requiresAuth: true,
          breadcrumb: [{ name: 'operations' }, { name: 'correctionInfosReport' }],
        },
      },
      {
        path: 'player-lookup-audit-logs-report',
        name: 'playerLookupAuditLogsReport',
        component: () => import('src/pages/operations/PlayerLookupAuditLogsReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.PlayerLookupAuditLogsReport',
          requiresAuth: true,
          breadcrumb: [{ name: 'operations' }, { name: 'playerLookupAuditLogsReport' }],
        },
      },
      {
        path: 'player-gifts',
        name: 'playerGifts',
        component: () => import('src/pages/operations/PlayerGifts.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.PlayerGifts',
          requiresAuth: true,
          breadcrumb: [{ name: 'operations' }, { name: 'playerGifts' }],
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
          breadcrumb: [{ name: 'inspector' }],
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
          breadcrumb: [{ name: 'pit' }, { name: 'liveGameFloorResultReport' }],
        },
      },
      {
        path: 'missing-chip-report',
        name: 'missingChipReport',
        component: () => import('src/pages/pit/MissingChipReport.vue'),
        meta: {
          requiredPermission: 'Addon.Pit.MissingChipReport',
          requiresAuth: true,
          breadcrumb: [{ name: 'pit' }, { name: 'missingChipReport' }],
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
