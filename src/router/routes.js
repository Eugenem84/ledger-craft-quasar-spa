const routes = [
  {
    path: '/',
    redirect: '/orders',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'orders', component: () => import('pages/OrdersPage.vue')},
      { path: 'analytic', component: () => import('pages/AnalyticPage.vue')},
      { path: 'other', component: () => import('pages/OtherPage.vue')},
      { path: 'catalog', component: () => import('pages/CatalogPage.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
