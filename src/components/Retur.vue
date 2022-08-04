<template>
  <div data-app>
    <!-- seacrh & button tambah retur -->
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
        <v-col
        cols="12"
        sm="6"
        >
            <v-btn
            elevation="2"
            class="float-right"
            @click.prevent="openForm()"
            >Retur</v-btn>        
        </v-col>                
    </v-row>            
    <!-- seacrh & button tambah retur -->

    <!-- form + retur -->
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            persistent
            max-width="1000px"
        >
            <v-card>
            <v-card-title>
                <span>Tambah Retur</span>
                <v-spacer></v-spacer>
                <v-menu
                bottom
                left
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    text
                    @click.prevent="dialog = false"
                    >
                    <v-icon dark>
                        mdi-close-circle
                    </v-icon>
                    </v-btn>
                </template>
                </v-menu>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col
                    cols="12"
                    sm="3"
                    >
                        <v-combobox
                            v-model="kategori"
                            :items="itemKategori"
                            label="Kategori"
                            dense
                        ></v-combobox>
                    </v-col>                   
                    <v-col
                    cols="12"
                    sm="3"
                    >
                        <v-text-field
                            v-model="totalItem"
                            label="Total Item"        
                            suffix="Pcs"             
                            required
                            type="Number"
                        ></v-text-field>
                    </v-col>           
                    <v-col
                    cols="12"
                    sm="3"
                    >
                        <v-text-field
                            v-model="totalBeratBersih"
                            label="Total Berat Bersih"        
                            suffix="Gr"             
                            required
                        ></v-text-field>
                    </v-col>   
                    <v-col
                    cols="12"
                    sm="3"
                    >
                        <v-text-field
                            v-model="totalBeratKotor"
                            label="Total Berat Kotor"        
                            suffix="Gr"             
                            required
                        ></v-text-field>
                    </v-col>  
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                        outlined
                        name="input-7-4"
                        label="Deskripsi"
                        v-model="desc"
                        required
                        ></v-textarea>
                    </v-col>  
                </v-row>                                                                    
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="blue darken-1"
                text
                @click="tambahReturan()"
                >
                Retur
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>      
    <!-- form + retur -->

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
        // form + retur
        dialog: false,
        allKategori: [],
        kategori: '',
        idStok:'',
        itemKategori:[],
        totalItem: 0,
        totalBeratBersih: '',
        totalBeratKotor: '',
        desc: "",

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
            this.fetchAllRetur()
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
            this.fetchAllRetur()
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
        fetchAllRetur(){
            this.loading1 = true
            this.allRetur = []
            axios({
                url: `${this.$store.state.baseUrl}stok/retur/admin/${this.cabangId}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                .then(({data})=>{              
                    console.log(data)   
                    this.allRetur = data         
                    this.loading1 = false               
                })
                .catch(err=>{
                    this.loading1 = false               
                })            
        },        
        openForm(){
            axios({
                url: `${this.$store.state.baseUrl}stok/cabang/${this.cabangId}`,
                method: 'get'
            })      
                .then(({data})=>{                       
                    this.allKategori = data
                    this.dialog = true
                })
                .catch(err=>{
                       Swal.fire({
                                        icon: 'error',
                                        title: 'pilih cabang terlebih dahulu !',
                                        text: err.errors,
                                        })
                    console.log(err)
                })
        },
        bukaHistory(data){
            this.allHistory = data
            this.dialog2 = true
        },  
        tambahReturan(){
            console.log(this.desc)
                Swal.fire({
                    title: 'Apakah anda yakin akan retur barang?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `${this.$store.state.baseUrl}stok/retur`,
                            method: 'post',
                            headers:{
                                token : localStorage.getItem('token')
                            },
                            data:{
                                idStok: this.idStok,
                                totalItem: Number(this.totalItem),
                                totalBeratBersih: Number(this.totalBeratBersih),
                                totalBeratKotor: Number(this.totalBeratKotor),
                                deskripsi: this.desc
                            }
                        })      
                                .then(({data})=>{           
                                    this.dialog = false
                                    this.fetchAllRetur()
                                })
                                .catch(err=>{
                                        Swal.fire({
                                        icon: 'error',
                                        title: 'isi dengan lengkap !',
                                        text: err.errors,
                                        })
                                    
                                })                            
                    } else if (result.isDenied) {

                    }
                })             
        }              
    },
    created(){
        this.getCabang(this.$store.state.baseUrl)
    }    
  }
</script>