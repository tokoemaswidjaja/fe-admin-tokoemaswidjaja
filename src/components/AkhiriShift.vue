<template>
  <div class="overflow-auto" style="margin-top: 25px;"> 
    <!-- laporan uang -->
    <v-container>
        <v-row>
            <v-col
                cols="12"
                sm="4"
            >
                <v-text-field
                class="m-5"
                label="Total Laku Tunai"
                v-model="totalLaku"
                prefix="Rp"       
                persistent-hint
                hint="*isi total dari penjualan tunai"        
                ></v-text-field> 
            </v-col>
            <v-col
                cols="12"
                sm="4"
            >
                <v-text-field
                class="m-5"
                label="Total Laku Transfer"
                v-model="totalLakuTransfer"
                prefix="Rp"       
                persistent-hint
                hint="*isi total dari penjualan transfer"        
                ></v-text-field> 
            </v-col>            
            <v-col
                cols="12"
                sm="4"
            >
                <v-text-field
                class="m-5"
                label="Total Balen"
                v-model="totalBalen"
                prefix="Rp"       
                persistent-hint
                hint="*isi total dari balen"        
                ></v-text-field> 
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12"
                sm="6"
            >
                <v-text-field
                class="m-5"
                label="Saldo Akhir"
                v-model="saldoAkhir"
                prefix="Rp"       
                persistent-hint
                hint="*isi total dari penjualan tunai"        
                ></v-text-field> 
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
                <h3>Selisih: {{this.tempMinus}} Rp  {{this.selisih}}</h3>
            </v-col>
        </v-row>        
    </v-container>
    <!-- laporan uang -->

    <!-- data stok -->
    <v-simple-table
        fixed-header
        height="240px"
    >
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">
                Kategori
            </th>
            <th class="text-left">
                Stok Awal
            </th>
            <th class="text-left">
                Laku
            </th>
            <th class="text-left">
                Stok Akhir
            </th>
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="item in stokBarang"
            :key="item.kategori"
            >
                <td>{{ item.kategori }}</td>
                <td>{{ item.stokAwal }}</td>
                <td>
                    <v-edit-dialog
                    :return-value.sync="item.laku"
                    large
                    persistent
                    @save="save"
                    @cancel="cancel"
                    @open="item.laku = ''"
                    @close="close"
                    >
                    <div>{{ item.laku }}</div>
                    <template v-slot:input>
                        <div class="mt-4 text-h6">
                        Update Stok
                        </div>
                        <v-text-field
                        v-model="item.laku"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                        ></v-text-field>
                    </template>
                    </v-edit-dialog>                
                </td>
                <td>{{ item.stokAkhir = item.stokAwal - item.laku }}</td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>
    <!-- data stok -->

    <!-- button akhri -->
    <v-btn block @click.prevent="akhiriShift()" style="margin-top: 15px;">
        Akhiri Shift
    </v-btn>
    <!-- button akhri -->

  </div>

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'

  export default {
    data() {
      return {
        snack: false,
        snackColor: '',
        snackText: '',
        max25chars: v => v.length <= 25 || 'Input too long!',
        pagination: {},
        headers: [
          {
            text: 'KategoriBarang',
            align: 'start',
            sortable: false,
            value: 'kategori',
          },
          { text: 'JumlahStok', value: 'stok' },
          { text: 'JumlahStok', value: 'stok' },
          { text: 'JumlahStok', value: 'stok' },

        ],

        // laporan
        totalLaku: '',
        totalLakuTransfer: '',
        totalBalen:'',
        saldoAkhir: '0',
        tempMinus: '',
        // stokBarang: [
        //   {
        //     kategori: 'K',
        //     stok: '0',
        //   },
        //   {
        //     kategori: 'L',
        //     stok: '0',
        //   },
        //   {
        //     kategori: 'G',
        //     stok: '0',
        //   },
        //   {
        //     kategori: 'C',
        //     stok: '0',
        //   },
        //   {
        //     kategori: 'T',
        //     stok: '0',
        //   },                              
        //   {
        //     kategori: 'A',
        //     stok: '0',
        //   },          
        //   {kategori:'L-DN',stok:'0'},{kategori:'G-DN',stok:'0'},{kategori:'C-DN',stok:'0'},{kategori:'T-DN',stok:'0'},{kategori:'A-DN',stok:'0'}
        //   ],
        stokBarang: []


      }
    },
    computed:{
        ...mapGetters({
            shiftId: 'shift/getId',
            balen: 'shift/getBalen',
            saldoAwal: 'shift/getSaldoAwal',
            kasKeluar: 'shift/getKasKeluar',
            kasMasuk: 'shift/getKasMasuk',
            cabang: 'shift/getCabang',
        }),   
        saldo: function(){
            if(this.shiftId !== null){
                let totalKasKeluar = 0
                this.kasKeluar.forEach(element => {
                    totalKasKeluar += element.jumlah
                });
                
                let totalKasMasuk = 0
                this.kasMasuk.forEach(element => {
                    totalKasMasuk += Number(element.jumlah)
                });            
                     

                let num = Number(this.saldoAwal) + Number(totalKasMasuk) + this.formatRupiahEsc(this.totalLaku) - Number(totalKasKeluar) - this.formatRupiahEsc(this.totalBalen)     
    
                var number_string = num.toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    num = sisa ? '.' : '';
                    rupiah += num + ribuan.join('.');
                }            
          
                return rupiah
            }else{
                return '0'
            }
        },        
        selisih: function(){       
                let temp = this.formatRupiahEsc(this.saldoAkhir) - this.formatRupiahEsc(this.saldo)
                if(temp < 0){
                    this.tempMinus = '-'
                }else{
                    this.tempMinus = ''
                }
                temp = temp.toString()
                var number_string = temp.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    temp = sisa ? '.' : '';
                    rupiah += temp + ribuan.join('.');
                }            
                      
                return rupiah
        }
    },    
    methods:{        
        getAllStok(){
            console.log(this.cabang)
            axios({
            url: `${this.$store.state.baseUrl}stok/cabang/${this.cabang}`,
            method: 'get'
            })      
                .then(({data})=>{                      
                   for(let i = 0 ; i < data.length ; i++){
                        let temp = {
                            kategori:data[i].kategori.kode,
                            idStokBarang:data[i]._id,
                            stokAwal:data[i].totalItem,
                            laku:0,
                            stokAkhir:0
                        }
                        this.stokBarang.push(temp)
                   }
                })
                .catch(err=>{
                    console.log(err)
                })
        }   , 
        save () {
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Data saved'
        },
        cancel () {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = 'Canceled'
        },
        open () {
            this.snack = true
            this.snackColor = 'info'
            this.snackText = 'Dialog opened'
        },
        close () {
            
        },                   
        ...mapActions({
            fetchShift: 'shift/getLastShift'
        }),   
        getRp(text){
            if(text){
                var number_string = text.toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    text = sisa ? '.' : '';
                    rupiah += text + ribuan.join('.');
                }            
    
                return rupiah
            }
        },             
        formatRupiahEsc(angka){
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        }      ,         
        //  akhiri Shift
        akhiriShift(){       
                Swal.fire({
                    title: 'Apakah anda yakin akan akhiri shift?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `${this.$store.state.baseUrl}shift/selesai/${this.shiftId}`,
                            method: 'put',
                            headers:{
                                token : localStorage.getItem('token')
                            },
                            data:{
                                saldoAkhir: this.formatRupiahEsc(this.saldoAkhir),
                                totalLaku: this.formatRupiahEsc(this.totalLaku),
                                totalLakuTransfer: this.formatRupiahEsc(this.totalLakuTransfer),
                                totalBalen: this.formatRupiahEsc(this.totalBalen),
                                selisih: this.formatRupiahEsc(this.selisih),
                                laporanStok: this.stokBarang
                            }
                        })      
                                .then(({data})=>{      
                                    this.$router.push('/shift')                                  
                                })
                                .catch(err=>{
                                    Swal.fire({
                                    icon: 'error',
                                    title: 'internal server error',
                                    text: err.errors,
                                    })
                                    console.log(err)
                                })                            
                    } else if (result.isDenied) {

                    }
                })      
        },
    },
    watch:{
        balen: function(){
            let tempTotalBalen = 0
            this.balen.forEach(element => {
                tempTotalBalen += Number(element.jumlah)
            })

            this.totalBalen = tempTotalBalen.toString()
        },          
        totalLaku: function(){
            if(this.totalLaku){
                var number_string = this.totalLaku.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.totalLaku = sisa ? '.' : '';
                    rupiah += this.totalLaku + ribuan.join('.');
                }            
    
                this.totalLaku = rupiah
            }
        },  
        totalLakuTransfer: function(){
            if(this.totalLakuTransfer){
                var number_string = this.totalLakuTransfer.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.totalLakuTransfer = sisa ? '.' : '';
                    rupiah += this.totalLakuTransfer + ribuan.join('.');
                }            
    
                this.totalLakuTransfer = rupiah
            }
        },          
        totalBalen: function(){
            if(this.totalBalen){
                var number_string = this.totalBalen.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.totalBalen = sisa ? '.' : '';
                    rupiah += this.totalBalen + ribuan.join('.');
                }            
    
                this.totalBalen = rupiah
            }
        }, 
        saldoAkhir: function(){
            if(this.saldoAkhir){
                var number_string = this.saldoAkhir.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.saldoAkhir = sisa ? '.' : '';
                    rupiah += this.saldoAkhir + ribuan.join('.');
                }            
    
                this.saldoAkhir = rupiah
            }
        },                   
    },
    created(){
            this.getAllStok()
            let tempTotalBalen = 0
            this.balen.forEach(element => {
                tempTotalBalen += Number(element.jumlah)
            })

            this.totalBalen = tempTotalBalen.toString()
    }
  }
</script>