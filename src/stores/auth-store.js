import {defineStore} from "pinia";

export const useAuthStore = defineStore('auth',
  {
    state: () => ({
      token: localStorage.getItem('authToken') || null
    }),
    actions: {
      setToken(token){
        this.token = token;
        localStorage.setItem('authToken', token)
      },
      logout(){
        this.token = null
        localStorage.removeItem('authToken')
      }
    }
  })
