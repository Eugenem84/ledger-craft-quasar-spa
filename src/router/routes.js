const routes = [
  {
    path: '/',
    redirect: '/orders',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'orders', component: () => import('pages/OrdersPage.vue'), meta: { requiresAuth: true }},
      { path: 'analytic', component: () => import('pages/AnalyticPage.vue'), meta: { requiresAuth: true }},
      { path: 'other', component: () => import('pages/OtherPage.vue'), meta: { requiresAuth: true }},
      { path: 'catalog', component: () => import('pages/CatalogPage.vue'), meta: { requiresAuth: true }},
      { path: 'login', component: () => import('pages/auth/LoginPage.vue'), meta: { hideFooter: true }}
    ]
  },
  {
    path: '/orders/:id',
    component: () => import('pages/OrderDetailsPage.vue'),
    meta: { hideFooter: true, requiredAuth: true}
  },
  {
    path: '/orders/new',
    component: () => import('pages/OrderDetailsPage.vue'),
    meta: { hideFooter: true, requiredAuth: true},
    name: 'new-order'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
