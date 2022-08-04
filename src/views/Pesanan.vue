<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Pesanan</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>

    <!-- seacrh & button tambah pesanan -->
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
            @click.prevent="dialog = true"
            >Buat Pesanan</v-btn>        
        </v-col>                
    </v-row>            
    <!-- seacrh & button tambah pesanan -->

    <!-- form + pesanan -->
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            persistent
            max-width="1000px"
        >
            <v-card>
            <v-card-title>
                <span>Tambah Pesanan</span>
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
                    <v-stepper v-model="e1">
                        <v-stepper-header>
                        <v-stepper-step
                            :complete="e1 > 1"
                            step="1"
                        >
                            Data Pemesanan
                        </v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step
                            :complete="e1 > 2"
                            step="2"
                        >
                            Pesanan
                        </v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step step="3">
                            Tanggal
                        </v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-row>
                                <v-col
                                cols="12"
                                md="4"
                                >
                                <v-text-field
                                    v-model="nama"
                                    :rules="nameRules"
                                    :counter="10"
                                    label="Nama"
                                    required
                                ></v-text-field>
                                </v-col>

                                <v-col
                                cols="12"
                                md="4"
                                >
                                <v-text-field
                                    v-model="email"
                                    :rules="emailRules"
                                    label="E-mail"                
                                ></v-text-field>
                                </v-col>

                                <v-col
                                cols="12"
                                md="4"
                                >
                                <v-text-field
                                    v-model="phoneNumber"
                                    label="Nomor HP"
                                    required
                                ></v-text-field>
                                </v-col>                            
                            </v-row>
                            <v-row>
                                <v-col
                                    cols="12"
                                    md="12"
                                >
                                    <v-textarea
                                    outlined
                                    name="input-7-4"
                                    label="Alamat"
                                    v-model="alamat"
                                    required
                                    ></v-textarea>
                                </v-col>
                            </v-row>                            

                            <v-btn                         
                            @click="e1 = 2"
                            >
                            Lanjut
                            </v-btn>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                            <v-row>
                                <v-col
                                cols="12"
                                md="12"
                                >
                                <v-text-field
                                    v-model="namaBarang"
                                    :rules="nameRules"
                                    label="Nama Barang"
                                    hint="Contoh: (2) cincin"           
                                    required
                                ></v-text-field>
                                </v-col>

                                <v-col
                                cols="12"
                                md="6"
                                >
                                <v-text-field
                                    v-model="kadarCap"
                                    label="Kadar / Cap"     
                                    hint="Contoh: 8K"     
                                    required
                                ></v-text-field>
                                </v-col>

                                <v-col
                                cols="12"
                                md="6"
                                >
                                <v-text-field
                                    v-model="berat"
                                    label="Berat"        
                                    suffix="Gram"             
                                    required
                                ></v-text-field>
                                </v-col>    
                                
                                <v-col
                                cols="12"
                                md="4"
                                >
                                <v-text-field
                                    v-model="harga"
                                    label="Harga" 
                                    prefix="Rp"       
                                    suffix="/gram"       
                                    required
                                ></v-text-field>
                                </v-col>             
                                <v-col
                                cols="12"
                                md="4"
                                >
                                    <v-text-field
                                    class="m-5"
                                    label="Ongkos"
                                    v-model="ongkos"
                                    prefix="Rp"       
                                    persistent-hint       
                                    required
                                    ></v-text-field> 
                                </v-col>   
                                <v-col
                                cols="12"
                                md="4"
                                >
                                    <v-text-field
                                    class="m-5"
                                    label="Voorschot"
                                    v-model="vc"
                                    prefix="Rp"       
                                    persistent-hint     
                                    ></v-text-field> 
                                </v-col>                                    
                                <v-col
                                    cols="12"
                                    md="8"
                                >
                                    <v-textarea
                                    outlined
                                    label="Deskripsi Barang"
                                    :value="deskripsi"
                                    ></v-textarea>
                                </v-col>    
                                <v-col
                                cols="12"
                                md="4"
                                >
                                <h3>
                                    TOTAL HARGA
                                </h3>
                                <p>
                                    Rp  {{this.getRupiah(Number(this.berat) * this.formatRupiahEsc(this.harga) + this.formatRupiahEsc(this.ongkos))}}
                                </p>
                                </v-col>                                                                                                                                               
                            </v-row>

                            <v-btn                            
                            @click="e1 = 3"
                            >
                            Lanjut
                            </v-btn>                                 
                            <v-btn         
                            style="margin-left: 10px;"                    
                            @click="e1 = 1"                            
                            >
                            Kembali
                            </v-btn>
                        </v-stepper-content>

                        <v-stepper-content step="3">
                            <v-row>
                                <v-col
                                cols="12"
                                sm="6"
                                >
                                    <v-menu
                                        v-model="menu1"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="date1"
                                            label="Tanggal Masuk"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker
                                        v-model="date1"
                                        @input="menu1 = false"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-col>            
                                <v-col
                                cols="12"
                                sm="6"
                                >
                                    <v-menu
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="date2"
                                            label="Tanggal Selesai"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker
                                        v-model="date2"
                                        @input="menu2 = false"
                                        ></v-date-picker>
                                    </v-menu>              
                                </v-col>  
                                <v-col
                                cols="12"
                                sm="12"
                                >
                                    <v-combobox
                                        v-model="cabang"
                                        :items="items"
                                        label="Cabang"
                                        dense
                                        required
                                    ></v-combobox>
                                </v-col>                                   
                            </v-row>    


                            <v-btn 
                            @click="e1 = 2"
                            >
                            Kembali
                            </v-btn>
                        </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>                    
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="blue darken-1"
                text
                @click="tambahPesanan()"
                >
                Buat Pesanan
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>      
    <!-- form + pesanan -->

    <!-- tabel pesanan -->
    <v-data-table
        :headers="headers"
        :items="allPesanan"
        class="elevation-1"
        :items-per-page="10"      
        :loading ="loading1"                        
    >  
        <template v-slot:item.diterima="{ item }">
            <p>{{item.tanggal.diterima}}</p>
        </template>      
        <template v-slot:item.selesai="{ item }">
            <p>{{item.tanggal.selesai}}</p>
        </template>       
        <template v-slot:item.customer="{ item }">
            <p>{{item.customer.nama}}</p>
        </template>       
        <template v-slot:item.status="{ item }">
            <v-chip
            v-if="item.status !== 'Disetorkan' & item.status !== 'Diterima'"
            class="ma-2"
            >
            {{item.status}}
            </v-chip>  
            <v-chip
            v-if="item.status === 'Disetorkan'"
            color="red"
            class="ma-2"
            @click="ubahStatus(item._id,'Diterima')"
            >
            {{item.status}}
            </v-chip>       
            <v-chip
            v-if="item.status === 'Diterima'"
            color="green"
            class="ma-2"
            @click="ubahStatus(item._id,'Selesai')"
            >
            {{item.status}}
            </v-chip>                    
        </template>                          
        <template v-slot:item.actions="{ item }">
                <v-chip
                class="ma-2"
                color="primary"
                label
                text-color="white"
                @click="showDetail(item)"
                >
                detail
                </v-chip>                                           
        </template>                                                 
    </v-data-table> 
    <!-- tabel pesanan -->

  </div>
</template>

<script>
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import { mapGetters, mapActions } from 'vuex'


  export default {
    data() {
      return {
        // form + pesanan
        dialog: false,
        e1: 1,
        nama: '',
        email:'',
        phoneNumber:'',
        alamat:'',
        namaBarang: '',
        kadarCap:'',
        berat:'',
        harga:null,
        ongkos:null,
        vc:null,
        deskripsi:'',
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu1: false,
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false,

        loading1:false,
        allPesanan:[],
        headers:[
            { text: 'Tanggal Diterima', value: 'diterima'},
            { text: 'Tanggal Selesai', value: 'selesai'},
            { text: 'Nama Barang', value: 'nama' },
            { text: 'Kadar/Cap', value: 'kadarCap' },
            { text: 'Customer', value: 'customer' },
            { text: 'Status', value: 'status' },
            { text: 'Action', value: 'actions', sortable: false },],
         cabang: '',
         cabangId: '',
         items: []            
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
            this.fetchAllPesanan()
        }
      },
      allCabang: function(){
         if(this.allCabang.length > 0){
            this.allCabang.forEach(element => {
               this.items.push(element.nama)
            })
         }
      },
      harga: function(){
         if(this.harga){
               var number_string = this.harga.replace(/[^,\d]/g, '').toString()
               var sisa 	= number_string.length % 3,
                  rupiah 	= number_string.substr(0, sisa),
                  ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                     
               if (ribuan) {
                  this.harga = sisa ? '.' : '';
                  rupiah += this.harga + ribuan.join('.');
               }            
   
               this.harga = rupiah
         } 
      },
      ongkos: function(){
         if(this.ongkos){
               var number_string = this.ongkos.replace(/[^,\d]/g, '').toString()
               var sisa 	= number_string.length % 3,
                  rupiah 	= number_string.substr(0, sisa),
                  ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                     
               if (ribuan) {
                  this.ongkos = sisa ? '.' : '';
                  rupiah += this.ongkos + ribuan.join('.');
               }            
   
               this.ongkos = rupiah
         } 
      },
      vc: function(){
         if(this.vc){
               var number_string = this.vc.replace(/[^,\d]/g, '').toString()
               var sisa 	= number_string.length % 3,
                  rupiah 	= number_string.substr(0, sisa),
                  ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                     
               if (ribuan) {
                  this.vc = sisa ? '.' : '';
                  rupiah += this.vc + ribuan.join('.');
               }            
   
               this.vc = rupiah
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
        fetchAllPesanan(){
            this.loading1 = true
            this.allPesanan = []
            axios({
                url: `${this.$store.state.baseUrl}pesanan/cabang/${this.cabangId}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                    .then(({data})=>{                 
                        this.allPesanan = data.results         
                        this.loading1 = false               
                    })
                    .catch(err=>{
                        console.log(err)
                        this.loading1 = false               
                    })            
        },        
        formatRupiahEsc(angka){
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        },  
        getRupiah(uang){
            if(uang){
                var number_string = uang.toString().replace(/[^,\d]/g, '')
                
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    uang = sisa ? '.' : '';
                    rupiah += uang + ribuan.join('.');
                }            

                return rupiah
            }else{
                return '-'
            }
        },        
        tambahPesanan(){
                Swal.fire({
                    title: 'Apakah anda yakin akan membuat pesanan?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `${this.$store.state.baseUrl}pesanan`,
                            method: 'post',
                            headers:{
                                token : localStorage.getItem('token')
                            },
                            data:{
                                customer:{
                                    nama: this.nama,
                                    email: this.email,
                                    phoneNumber: this.phoneNumber,
                                    alamat: this.alamat
                                },
                                nama : this.namaBarang,        
                                harga: this.formatRupiahEsc(this.harga),           
                                ongkos : this.formatRupiahEsc(this.ongkos),  
                                vc: this.formatRupiahEsc(this.vc), 
                                kadarCap : this.kadarCap,
                                berat : this.berat,    
                                deskripsi : this.deskripsi,                                                            
                                tanggal:{
                                    diterima: this.date1,
                                    selesai: this.date2
                                },
                                cabang: this.cabangId,
                                admin: this.$store.state.userId
                            }
                        })      
                                .then(({data})=>{           
                                    this.dialog = false
                                    this.fetchAllPesanan()
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
        }, 
        ubahStatus(id,status){
                Swal.fire({
                    title: 'Akan mengubah status?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `${this.$store.state.baseUrl}pesanan/${id}`,
                            method: 'put',
                            headers:{
                                token : localStorage.getItem('token')
                            },
                            data:{
                                status: status
                            }
                        })      
                                .then(({data})=>{           
                                    this.fetchAllPesanan()
                                })
                                .catch(err=>{
                                        Swal.fire({
                                        icon: 'error',
                                        title: 'Internal Server Error !',
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