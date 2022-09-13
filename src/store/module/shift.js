import axios from 'axios'

const state = {
    saldoAwal:null,
    balen : [],
    kasMasuk: [],
    kasKeluar: [],
    cabang: '',
    id:null
}
const mutations = {  
    fillSaldoAwal(state,payload){
        state.saldoAwal = payload
        },       
    fillBalen(state,payload){
        state.balen = payload
        },         
    fillKasMasuk(state,payload){
        state.kasMasuk = payload
        },       
    fillKasKeluar(state,payload){
        state.kasKeluar = payload
        },       
    fillCabang(state,payload){
        state.cabang = payload
        },                          
    fillId(state,payload){
        state.id = payload
        },                             
}
const actions = {
    getLastShift(context,payload) {  
        axios({
            url: `${payload}shift/aktif/kasir`,
            method: 'get',
            headers:{
                token : localStorage.getItem('token')
            }
        })      
                .then(({data})=>{                      
                    context.commit('fillSaldoAwal',data[0].saldoAwal)
                    context.commit('fillBalen',data[0].balen)
                    context.commit('fillKasMasuk',data[0].kasMasuk)             
                    context.commit('fillKasKeluar',data[0].kasKeluar)   
                    context.commit('fillCabang',data[0].cabang)   
                    context.commit('fillId',data[0]._id)             
                })
                .catch(err=>{
                    console.log(err)
                })
  }
}
const getters = {  
    getSaldoAwal : (state) => {
        return  state.saldoAwal
    },  
    getBalen : (state) => {
        return  state.balen
    },  
    getKasMasuk : (state) => {
        return  state.kasMasuk
    },  
    getKasKeluar : (state) => {
        return  state.kasKeluar
    },    
    getCabang : (state) => {
        return  state.cabang
    },                        
    getId : (state) => {
        return  state.id
    },            
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}