import axios from 'axios'

const state = {
    allCabang : null
}
const mutations = {  
    fillData(state,payload){
        state.allCabang = payload
        },         
}
const actions = {
    getCabang(context,payload) {              
        axios({
            url: `${payload}cabang`,
            method: 'get'
        })      
                .then(({data})=>{                       
                    if(data.length > 0){
                    context.commit('fillData',data)             
                }else{
                    context.commit('fillData',null)
                }
                })
                .catch(err=>{
                    console.log(err)
                })
  }
}
const getters = {  
    getData : (state) => {
      return  state.allCabang
    },  
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}