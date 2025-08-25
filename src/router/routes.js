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
      {
        path: 'inspector',
        component: () => import('pages/inspector/IndexPage.vue'),
        meta: {
          requiredPermission: 'Addon.Inspector',
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
    },
    children: [
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
        },
      },
      {
        path: 'visitor-categories',
        name: 'visitorCategories',
        component: () => import('src/pages/definitions/guest-management/PlayerCategory.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.VisitorCategory',
          requiresAuth: true,
        },
      },
      {
        path: 'expense-parameters',
        name: 'expenseParameters',
        component: () => import('src/pages/definitions/guest-management/ExpenseParameter.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.ExpenseParameter',
          requiresAuth: true,
        },
      },
      {
        path: 'chips',
        name: 'chips',
        component: () => import('src/pages/definitions/chip-management/ChipsPage.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.Chips',
          requiresAuth: true,
        },
      },
      {
        path: 'float-sets',
        name: 'floatSets',
        component: () => import('src/pages/definitions/chip-management/FloatSet.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.FloatSets',
          requiresAuth: true,
        },
      },
      {
        path: 'chip-operations',
        name: 'chipOperations',
        component: () => import('src/pages/definitions/chip-management/ChipOperation.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.ChipOperations',
          requiresAuth: true,
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
        },
      },
      {
        path: 'filtered-report',
        name: 'filteredReport',
        component: () => import('pages/reports/inout-reports/FilteredReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetFilteredReport',
          requiresAuth: true,
        },
      },
      {
        path: 'net-cash-report',
        name: 'netCashReport',
        component: () => import('pages/reports/inout-reports/NetCashReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetNetCashReport',
          requiresAuth: true,
        },
      },
      {
        path: 'inout-report-detail',
        name: 'inOutReportDetail',
        component: () => import('pages/reports/inout-reports/InOutReportDetail.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetInOutReportDetail',
          requiresAuth: true,
        },
      },
      {
        path: 'inout-selected-name-report',
        name: 'inOutSelectedNameReport',
        component: () => import('pages/reports/inout-reports/InOutSelectedNameReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetInOutSelectedNameReport',
          requiresAuth: true,
        },
      },
      {
        path: 'player-result-report',
        name: 'playerResultReport',
        component: () => import('pages/reports/reports/GetPlayerResultReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetPlayerResultReport',
          requiresAuth: true,
        },
      },
      {
        path: 'time-inout-report',
        name: 'timeInOutReport',
        component: () => import('pages/reports/reports/GetTimeInOutReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetTimeInOutReport',
          requiresAuth: true,
        },
      },
      {
        path: 'time-inout-report-by-player',
        name: 'timeInOutReportByPlayer',
        component: () => import('pages/reports/reports/GetTimeInOutByPlayerReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetTimeInOutReportByPlayer',
          requiresAuth: true,
        },
      },
      {
        path: 'time-inout-report-by-table',
        name: 'timeInOutReportByTable',
        component: () => import('pages/reports/reports/GetTimeInOutByTableReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetTimeInOutReportByTable',
          requiresAuth: true,
        },
      },
      {
        path: 'table-floats-report',
        name: 'tableFloatsReport',
        component: () => import('pages/reports/reports/GetTableFloatsReport.vue'),
        meta: {
          requiredPermission: 'Addon.Definitions.TableFloats.ShowList',
          requiresAuth: true,
        },
      },
      {
        path: 'active-floor-list-report',
        name: 'activeFloorListReport',
        component: () => import('src/pages/reports/management-reports/ActiveFloorListReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetActiveFloorListReport',
          requiresAuth: true,
        },
      },
      {
        path: 'active-floor-info-report',
        name: 'activeFloorInfoReport',
        component: () => import('src/pages/reports/management-reports/ActiveFloorInfoReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetActiveFloorInfoReport',
          requiresAuth: true,
        },
      },
      {
        path: 'master-report',
        name: 'masterReport',
        component: () => import('src/pages/reports/management-reports/MasterReport.vue'),
        meta: {
          requiredPermission: 'Addon.Reports.MasterReport',
          requiresAuth: true,
        },
      },
      {
        path: 'balance-report',
        name: 'balanceReport',
        component: () => import('src/pages/reports/management-reports/BalanceReport.vue'),
        meta: {
          requiredPermission: 'Addon.InOutReport.GetBalanceReport',
          requiresAuth: true,
        },
      },
      {
        path: 'call-report',
        name: 'callReport',
        component: () => import('src/pages/reports/management-reports/CallReport.vue'),
        meta: {
          requiredPermission: 'Addon.Operations.CallReport',
          requiresAuth: true,
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
