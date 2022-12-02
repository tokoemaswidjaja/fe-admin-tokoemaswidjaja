import Vue from 'vue'
import Vuex from 'vuex'
import cabang from './module/cabang'
import shift from './module/shift'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: "https://toko-widjaja.herokuapp.com/",
    // baseUrl: "http://localhost:3000/",
    isLogin: false,
    user: "kasir1",
    email: null,
    userId:null,
    userRole:'Kasir'
  },
  getters: {
  },
  mutations: {
    setLogin(state,payload){
      state.isLogin = payload
    },
    setUser(state,payload){
      state.user = payload
    },
    setEmail(state,payload){
      state.email = payload
    },    
    setUserId(state,payload){
      state.userId = payload
    },
    setRole(state,payload){
      state.userRole = payload
    }
  },
  actions: {
  },
  modules: {
    cabang,
    shift
  }
})
