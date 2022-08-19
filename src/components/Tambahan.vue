<template>
  <div data-app>
    <!-- seacrh  -->
    <v-row class="m-4">            
        <v-col
        cols="12"
        sm="4"
        >
            <v-combobox
                v-model="cabang"
                :items="items"
                label="Cabang"
                dense
            ></v-combobox>
        </v-col>          
    </v-row>            
    <!-- seacrh  -->


    <!-- tabel retur -->
    <v-simple-table
        fixed-header
        height="280px"
    >
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">
                Kategori
            </th>
            <th class="text-left">
                History
            </th>
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="item in allRetur"
            :key="item.kategori"
            >
                <td>{{ item.kategori.kode }}</td>
                <td>
                    <v-chip
                    class="ma-2"
                    color="success"
                    label
                    text-color="white"                    
                    @click.prevent="bukaHistory(item.history)"
                    >
                    Buka
                    </v-chip>   
                </td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>
    <!-- tabel retur -->

    <!-- tabel history -->
    <v-dialog v-model="dialog2" data-app>
        <v-data-table
            :headers="headers"
            :items="allHistory"
            class="elevation-1"        
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="name"
            show-expand                 
        >     
            <template v-slot:item.BeratBersih="{ item }">
                {{ item.totalBeratBersih }} gr
            </template>
            <template v-slot:item.BeratKotor="{ item }">
                {{ item.totalBeratKotor }} gr
            </template>
            <template v-slot:item.acc="{ item }">     
                <v-chip
                v-if="item.acc === true"
                color="green"
                class="ma-2"
                >
                ACC
                </v-chip>    
                <v-chip
                v-if="item.acc === false"
                color="red"
                class="ma-2"
                @click.prevent="acc(item._id)"
                >
                WAIT
                </v-chip>                                 
            </template>          
            <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                {{ item.deskripsi }}
            </td>
            </template>                                                                                    
        </v-data-table>     
    </v-dialog>    
    <!-- tabel history -->
  </div>
</template>

<script>
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import { mapGetters, mapActions } from 'vuex'


  export default {
    data() {
      return {

        // data
        loading1:false,
        allRetur:[],
        cabang: '',
        cabangId: '',
        items: [],
         
        //  history
        dialog2: false,
        allHistory: [],
        expanded: [],
        singleExpand: false,
        headers:[
            { text: 'Tanggal', value: 'tanggal'},
            { text: 'Total Item', value: 'totalItem'},
            { text: 'Berat Bersih', value: 'BeratBersih'},
            { text: 'Berat Kotor', value: 'BeratKotor'},
            { text: 'ACC', value: 'acc'},
            { text: '', value: 'data-table-expand' },],
      }
    },
    watch: {
      cabang: function(){
         this.allCabang.forEach(element => {
            if(element.nama === this.cabang){
               this.cabangId = element._id               
            }
         });         
        if(!this.dialog){
            this.fetchTamabahan()
        }
      },
      allCabang: function(){
         if(this.allCabang.length > 0){
            this.allCabang.forEach(element => {
               this.items.push(element.nama)
            })
         }
      },
      kategori: function(){
         this.allKategori.forEach(element => {
            if(element.kategori.kode === this.kategori){
               this.idStok = element._id               
            }
         });         
        if(!this.dialog){
            this.fetchTamabahan()
        }
      },
      allKategori: function(){
         if(this.allKategori.length > 0){
            this.allKategori.forEach(element => {
               this.itemKategori.push(element.kategori.kode)
            })
         }
      }      
    },
    computed:{
        ...mapGetters({
            allCabang: 'cabang/getData'
        })             
    },    
    methods: {   
        ...mapActions({
            getCabang: 'cabang/getCabang'
         }),          
        fetchTamabahan(){
            this.loading1 = true
            this.allRetur = []
            axios({
                url: `${this.$store.state.baseUrl}stok/tambahan/kasir/${this.cabangId}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                .then(({data})=>{              
                    this.allRetur = data         
                    this.loading1 = false               
                })
                .catch(err=>{
                    this.loading1 = false               
                })            
        },        
        bukaHistory(data){
            this.allHistory = data
            this.dialog2 = true
        },  
        acc(id){
            axios({
                url: `${this.$store.state.baseUrl}stok/tambahan/acc/${id}`,
                method: 'put',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                .then(({data})=>{   
                    this.fetchTamabahan()             
                    this.dialog2 =false           
                })
                .catch(err=>{
                    console.log(err)              
                })               
        }              
    },
    created(){
        if(this.allCabang.length > 0){
         if(this.allCabang.length > 0){
            this.allCabang.forEach(element => {
               this.items.push(element.nama)
            })
         }
        }else{
            this.getCabang(this.$store.state.baseUrl)
        }
    }    
  }
</script>