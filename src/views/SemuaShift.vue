<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Shift</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
        <v-row class="m-4">
            <v-col
            cols="12"
            sm="5"
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
                        label="Tanggal Mulai"
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
            sm="5"
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
                        label="Tanggal Akhir"
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
            sm="2"
            >
                <v-btn
                rounded
                color="primary"
                small
                dark
                @click.prevent="fetchAllShift()"
                >
                Cari
                </v-btn>  
            </v-col>        
        </v-row>            

        <v-data-table
            :headers="headers1"
            :items="allShift"
            class="elevation-1"
            :items-per-page="10"                              
        >  
            <template v-slot:item.cabang="{ item }">
            <p>{{item.cabang.nama}}</p>
            </template>  

            <template v-slot:item.saldoAwal="{ item }">
            <p>Rp {{getRupiah( item.saldoAwal)}}</p>
            </template>  
 
             <template v-slot:item.totalLaku="{ item }">
            <p>Rp {{getRupiah( item.totalLaku)}}</p>
            </template>  

             <template v-slot:item.totalLakuTransfer="{ item }">
            <p>Rp {{getRupiah( item.totalLakuTransfer)}}</p>
            </template>  

             <template v-slot:item.totalBalen="{ item }">
            <p>Rp {{getRupiah( item.totalBalen)}}</p>
            </template>  

            <template v-slot:item.saldoAkhir="{ item }">
            <p>Rp {{getRupiah( item.saldoAkhir)}}</p>
            </template>  

            <template v-slot:item.stok="{ item }">
                <a @click="showStok(item.laporanStok)">
                    <v-chip
                    class="ma-2"
                    color="success"
                    label
                    text-color="white"
                    x-small
                    >
                    Buka
                    </v-chip>                                           
                </a> 
            </template>  

            <template v-slot:item.actions="{ item }">
                <a @click="showKas(item)">
                    <v-chip
                    class="ma-2"
                    color="success"
                    label
                    text-color="white"
                    x-small
                    >
                    Buka
                    </v-chip>                                           
                </a> 
            </template>                                                 
        </v-data-table> 

    <!-- stok -->
    <v-dialog v-model="dialog2">
        <v-simple-table
            fixed-header
            height="500px"
        >
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Kategori
                </th>
                <th class="text-left">
                    Stok
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in dataStok"
                :key="item.kategori"
                >
                    <td>{{ item.kategori }}</td>
                    <td>{{ item.stok }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </v-dialog>
    <!-- stok -->

    <!-- kas  -->
    <v-dialog
        v-model="dialog"
        max-width="350"
      >
        <v-card>
            <v-tabs color="red accent-4" right>
                <v-tab :href="kasKeluar2">Kas Keluar</v-tab>
                <v-tab :href="kasMasuk2">Kas Masuk</v-tab>

                <!-- Kas Keluar -->
                <v-tab-item :value="kasKeluar2">
                    <v-data-table
                        :headers="headers3"
                        :items="dataKeluar"
                        class="elevation-1"
                    >
                        <template v-slot:item.jumlah="{ item }">
                        Rp {{ getRupiah(item.jumlah) }}
                        </template>  
                    </v-data-table>
                </v-tab-item>
                <!-- Kas Keluar -->

                <!-- Kas Masuk -->
                <v-tab-item :value="kasMasuk2">
                    <v-data-table
                        :headers="headers2"
                        :items="dataMasuk"
                        class="elevation-1"
                    >
                        <template v-slot:item.jumlah="{ item }">
                        Rp {{ getRupiah(item.jumlah) }}
                        </template>  
                    </v-data-table>
                </v-tab-item>
                <!-- Kas Masuk -->

            </v-tabs>
        </v-card>
    </v-dialog>
    <!--kas  -->

  </div>
</template>

<script>
  import axios from 'axios'
  import Swal from 'sweetalert2'


  export default {
    data() {
      return {
        allShift:[],
        headers1:[
            { text: 'Tanggal', value: 'tanggal'},
            { text: 'Cabang', value: 'cabang'},
            { text: 'Saldo Awal', value: 'saldoAwal' },
            { text: 'Total Laku (Tunai)', value: 'totalLaku' },
            { text: 'Total Laku (Transfer)', value: 'totalLakuTransfer' },
            { text: 'Total Balen', value: 'totalBalen' },
            { text: 'Saldo Akhir', value: 'saldoAkhir' },
            { text: 'Stok', value: 'stok', sortable: false},
            { text: 'Kas', value: 'actions', sortable: false },],

        // stok
        dialog2: false,
        dataStok:[],

        // kas masuk & keluar 
        dialog: false,  
        dataKeluar: [],
        headers3:[
            { text: 'Jumlah', value: 'jumlah'},
            { text: 'Keterangan', value: 'keterangan' }],         
        dataMasuk: [],        
        headers2:[
            { text: 'Jumlah', value: 'jumlah'},
            { text: 'Keterangan', value: 'keterangan' }],    

        // search
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu1: false,
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false
      }
    },
    components: {
        
    },
    watch: {

    },
    computed:{
             
    },    
    methods: {   
        fetchAllShift(){
            this.allShift = []
            axios({
                url: `${this.$store.state.baseUrl}shift/all/kasir?mulai=${this.date1}&akhir=${this.date2}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                    .then(({data})=>{                              
                        this.allShift = data                        
                    })
                    .catch(err=>{
                        console.log(err)
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
        getDate(str){
            if(str){
                let arr =  str.split('T')

                return arr[0]
            }
        },        
        getTime(str){
            if(str){
                let arr =  str.split('T')
                let arr2 =  arr[1].split('.')
                let arr3 =  arr2[0].split(':')

                return arr3[0]+':'+arr3[1]
            }
        },
        showStok(data){
            this.dialog2 = true
            this.dataStok = data
        },
        showKas(data){
            this.dialog = true
            this.dataKeluar = data.kasKeluar
            this.dataMasuk = data.kasMasuk
        },         
    },
    watch:{

    },
        created(){
            this.fetchAllShift()
    }    
  }
</script>