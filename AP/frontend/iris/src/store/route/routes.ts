/** IRISルート */
export const IrisRoutes = {
  AP_IRIS_HOME: { path: '/home' },
  AP_SERVER_MANAGEMENT: { path: '/management', label: '管理AP' },
  AP_IRIS_SQAS: { path: '/qas/sqas', label: 'SQAS' },
} as const;
