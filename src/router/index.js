import Vue from 'vue'
import VueRouter from 'vue-router'
import MulaiShift from '../views/MulaiShift.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: MulaiShift
  },
  {
    path: '/shift',
    name: 'shift',
    component: () => import('../views/SemuaShift.vue')
  },
  {
    path: '/pesanan',
    name: 'pesanan',
    component: () => import('../views/Pesanan.vue')
  },  
  {
    path: '/stok',
    name: 'stok',
    component: () => import('../views/Stok.vue')
  }    
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
