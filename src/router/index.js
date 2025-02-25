import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import {useAuthStore} from "stores/auth-store.js";
//import {store} from "quasar/wrappers";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

    //Глобальный перехватчик маршрутов для защиты страниц
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    console.log('authStoreToken: ',authStore.token)
    const token = authStore.token || localStorage.getItem('authToken');
    if (to.meta.requiresAuth && !token) {
      console.log('Redirecting to login');
      next('/login')
    } else {
      next()
    }
  })

  return Router
})
