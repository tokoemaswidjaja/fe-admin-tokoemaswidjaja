<template>
  <div id="app">
    <div v-if="!isLogin">
      <Login />
    </div>  
    <div v-if="isLogin" style="height: 100%;" data-app>
      <v-navigation-drawer absolute permanent left dark>  

        <img src="./assets/logoToko.png" style="margin-left:47px;" width="150" alt="icon">              

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item link @click="$router.push('/')" v-if="getRole === 'Kasir'">
            <v-list-item-icon>
              <v-icon>mdi-form-select</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Mulai Shift</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="$router.push('/shift')">
            <v-list-item-icon>
              <v-icon>mdi-cash-register</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Semua Shift</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="$router.push('/stok')">
            <v-list-item-icon>
              <v-icon>mdi-cart</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Stok</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="$router.push('/pesanan')">
            <v-list-item-icon>
              <v-icon>mdi-basket-unfill</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Pesanan</v-list-item-title>
          </v-list-item>                
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn @click.prevent="logOut" block>
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>   

      <div class="page-content-wrapper" data-app>
        <v-app>
          <router-view/>  
        </v-app>
      </div>    
    </div>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import { mapActions } from 'vuex'

export default {
  name: 'app',
  data(){
    return{

    }
  },
  components: {
    Login
  },  
  computed:{
    isLogin(){
      return this.$store.state.isLogin
    },
    userName(){
      return this.$store.state.user
    }, 
    getRole(){
      return this.$store.state.userRole
    }  
  },
  methods:{    
    ...mapActions({
        getCabang: 'cabang/getCabang'
    }),        
    logOut(){
      localStorage.clear()
      this.$store.commit('setLogin', false)
      this.$store.commit('setRole', '')
      this.$router.push('/')
    },  
  },
  created () {
    if(localStorage.getItem('token')){
      this.getCabang(this.$store.state.baseUrl)
      this.$store.commit('setUser',localStorage.getItem('user'))
      this.$store.commit('setRole',localStorage.getItem('role'))
      this.$store.commit('setEmail',localStorage.getItem('email'))
      this.$store.commit('setUserId',localStorage.getItem('userId'))  
      this.$store.commit('setLogin', true)
    }else{
      this.$store.commit('setLogin', false)
    }
  }
}
</script>

<style>
body {
  font-family: "Saira", sans-serif;
  height: 100vh;
}
.page-content-wrapper{
  margin-left: 265px;
  height: 100%;
}
</style>
