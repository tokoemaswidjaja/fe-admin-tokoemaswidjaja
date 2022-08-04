<template>
  <div class="full">
      <v-card max-width="auto" tile flat class="my-5">
         <v-toolbar color="" flat height="60px" >
         <v-spacer></v-spacer>
         <h2>Mulai Shift</h2>
         <v-spacer></v-spacer>
         </v-toolbar>
      </v-card>
      <v-divider></v-divider>
      <div v-if="!loading">
         <!-- kasir belum mulai shift-->
         <div v-if="mulaiShift === 'Belum' ">                     
            <v-btn
            elevation="2"
            style="margin-top: 20px;"
            @click.prevent="dialog = true"
            >Mulai Shift</v-btn>
            <v-row justify="center">
               <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600px"
               >
                  <v-card>
                  <v-card-title>
                     <span class="text-h5">Form Mulai Shift</span>
                  </v-card-title>
                  <v-card-text>
                     <v-container>
                        <v-row>
                        <v-col
                           cols="12"
                           sm="12"
                        >
                           <v-text-field
                           class="m-5"
                           label="Saldo Awal"
                           v-model="saldoAwal"
                           prefix="Rp"       
                           persistent-hint
                           hint="*isi jumlah uang awal yang ada dikasir"        
                           ></v-text-field> 
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
                           ></v-combobox>
                        </v-col>
                        </v-row>
                     </v-container>
                     <small>*isi saldo awal & pilih cabang !</small>
                  </v-card-text>
                  <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn
                        color="blue darken-1"
                        text
                        @click.prevent="dialog = false"
                     >
                        Close
                     </v-btn>
                     <v-btn
                        color="blue darken-1"
                        text
                        @click="mulaiShiftKasir()"
                     >
                        Mulai
                     </v-btn>
                  </v-card-actions>
                  </v-card>
               </v-dialog>
            </v-row>         
         </div>
         <!-- kasir belum mulai shift-->

         <!-- kasir sudah mulai shift -->
         <div v-if="mulaiShift === 'Sudah'" data-app>
            <v-tabs>
               <v-tab :href="Balen">Balen</v-tab>
               <v-tab :href="KasMasuk">Kas Masuk</v-tab>   
               <v-tab :href="KasKeluar">Kas Keluar</v-tab>               
               <v-tab :href="Selesai">Akhiri Shift</v-tab>               

               <v-tab-item :value="Balen">
                        <Balen />
               </v-tab-item>
               <v-tab-item :value="KasMasuk">
                        <KasMasuk />
               </v-tab-item>        
               <v-tab-item :value="KasKeluar">
                        <KasKeluar />
               </v-tab-item>  
               <v-tab-item :value="Selesai">
                       <AkhiriShift />
               </v-tab-item>                                              
            </v-tabs>    
           
         </div>
         <!-- kasir sudah mulai shift -->
      </div>

      
      <!-- loading -->
      <div class="container" v-if="loading">
         <div>
            <v-row>
            <v-col
               class="text-subtitle-1 text-center"
               cols="12"
            >
               <img src="../assets/6d3cd3e883bfe9d7c7cbecd9b0b5174e.gif" alt="icon">                       
            </v-col>
            </v-row>                
        </div>       
      </div>
      <!-- loading -->
  </div>
</template>

<script>
   import axios from 'axios'
   import { mapGetters, mapActions, mapMutations } from 'vuex'
   import Swal from 'sweetalert2'
   import Balen from '../components/Balen.vue'
   import KasKeluar from '@/components/KasKeluar.vue'
   import KasMasuk from '@/components/KasMasuk.vue'
   import AkhiriShift from '../components/AkhiriShift.vue'

  export default {
    data() {
      return {
         tab:null,
         loading: true,
         mulaiShift: null,

         // form mulai shift
         dialog: false,
         saldoAwal: '',
         cabang: '',
         cabangId: '',
         items: []
      }
    },
    components: {
    Balen,
    KasKeluar,
    KasMasuk,
    AkhiriShift
   },
    watch: {
      cabang: function(){
         this.allCabang.forEach(element => {
            if(element.nama === this.cabang){
               this.cabangId = element._id               
            }
         });         
      },
      allCabang: function(){
         if(this.allCabang.length > 0){
            this.allCabang.forEach(element => {
               this.items.push(element.nama)
            });
            this.findLastShift()
         }
      },         
      saldoAwal: function(){
         if(this.saldoAwal){
               var number_string = this.saldoAwal.replace(/[^,\d]/g, '').toString()
               var sisa 	= number_string.length % 3,
                  rupiah 	= number_string.substr(0, sisa),
                  ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                     
               if (ribuan) {
                  this.saldoAwal = sisa ? '.' : '';
                  rupiah += this.saldoAwal + ribuan.join('.');
               }            
   
               this.saldoAwal = rupiah
         }
      },                     
    },
    computed:{
        ...mapGetters({
            allCabang: 'cabang/getData'
        }),       
    },    
    methods: {   
         ...mapMutations({
            fillSaldoAwal: 'shift/fillSaldoAwal',
            fillBalen: 'shift/fillBalen',
            fillKasMasuk: 'shift/fillKasMasuk',  
            fillKasKeluar: 'shift/fillKasKeluar',
            fillId: 'shift/fillId'        
         }),              
         ...mapActions({
            getCabang: 'cabang/getCabang'
         }),           
        formatRupiahEsc(angka){
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        },
        findLastShift(){
                  this.loading= true
                    axios({
                        url: `${this.$store.state.baseUrl}shift/aktif/kasir`,
                        method: 'get',
                        headers:{
                            token : localStorage.getItem('token')
                        }
                    })      
                            .then(({data})=>{   
                              this.fillSaldoAwal(data[0].saldoAwal)
                              this.fillBalen(data[0].balen)  
                              this.fillKasMasuk(data[0].kasMasuk)
                              this.fillKasKeluar(data[0].kasKeluar) 
                              this.fillId(data[0]._id)
                              this.mulaiShift = 'Sudah'
                              this.loading = false
                            })
                            .catch(err=>{
                               if(err.response.data.errors[0] === "belum memulai shift !"){
                                 this.mulaiShift = 'Belum'
                                 this.dialog = true
                               }                                                  
                                  this.loading = false
                            })   
         },
        mulaiShiftKasir(){
                Swal.fire({
                    title: 'Apakah anda yakin akan memulai shift?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `${this.$store.state.baseUrl}shift/mulai`,
                            method: 'post',
                            headers:{
                                token : localStorage.getItem('token')
                            },
                            data:{
                                saldoAwal:this.formatRupiahEsc(this.saldoAwal),
                                cabang: this.cabangId
                            }
                        })      
                                .then(({data})=>{           
                                    this.fillSaldoAwal(data.saldoAwal)
                                    this.fillBalen(data.balen)  
                                    this.fillKasMasuk(data.kasMasuk)
                                    this.fillKasKeluar(data.kasKeluar) 
                                    this.fillId(data._id)                                                                  
                                   this.mulaiShift = 'Sudah'
                                })
                                .catch(err=>{
                                    if(err.response.status === 401){           
                                        Swal.fire({
                                        icon: 'error',
                                        title: 'anda sudah memulai shift (reload web) !',
                                        text: err.errors,
                                        })
                                    }else{
                                          Swal.fire({
                                        icon: 'error',
                                        title: 'isi saldo awal & cabang',
                                        text: err.errors,
                                        })
                                    }
                                })                            
                    } else if (result.isDenied) {

                    }
                })             
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
        }                       
    },
    created(){    
      this.getCabang(this.$store.state.baseUrl)
    }     
  }
</script>

<style scoped>
.full{
   height: 100%;
}
.container {
   height: 90%;
	align-items: center;
	justify-content: center;
   display: flex;
}
</style>