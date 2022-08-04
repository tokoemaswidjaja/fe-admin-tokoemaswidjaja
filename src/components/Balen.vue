<template>
  <div class="overflow-auto" style="margin-top: 25px;"> 
    <!-- form tambah balen  -->
    <v-row>
        <v-col
            cols="12"
            sm="6"
        >    
            <v-text-field
            class="m-5"
            label="Tambah Balen"
            v-model="jumlah"
            prefix="Rp"       
            persistent-hint
            hint="*isi jumlah total Balen"    
            outlined
            v-on:keyup.enter="tambahBalen()"    
            ></v-text-field> 
        </v-col>
        <v-col
            cols="12"
            sm="6"
        >    
            <h1>Total Balen: Rp {{getRp(this.totalBalen)}}</h1>
        </v-col>        
    </v-row>
    <!-- form tambah balen  -->

    <!-- tabel balen  -->
    <v-simple-table
        fixed-header
        height="370px"
    >
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">
                No
            </th>
            <th class="text-left">
                Jumlah
            </th>
            <th class="text-left">
                Action
            </th>
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="(item,index) in balen"
            :key="item._id"
            >
                <td>{{ index += 1 }}</td>
                <td>{{ item.jumlah }}</td>
                <td>
                    <v-icon
                        small
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                    <v-icon
                        small
                        @click="formEdit(item)"
                        v-b-popover.hover.top="'Delete'"
                    >
                        mdi-pencil
                    </v-icon>   
                </td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>
    <!-- tabel balen  -->

    <!-- form edit balen -->
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
                    label="Tambah Balen"
                    v-model="jumlah"
                    prefix="Rp"       
                    persistent-hint
                    hint="*isi jumlah total Balen"    
                    outlined
                    v-on:keyup.enter="editItem()"    
                    ></v-text-field> 
                </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
            >
                Close
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="editItem()"
            >
                Edit
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>    
    <!-- form edit balen -->
    <v-overlay :value="loading2"></v-overlay>
  </div>

</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'

  export default {
    data() {
      return {
        totalBalen: 0,
        headers:[
            { text: 'No', value: 'index' },
            { text: 'Jumlah', value: 'jumlah'},
            { text: 'Actions', value: 'actions', sortable: false }],
        // form
        loading2:false,
        jumlah: null,

        // form edit
        dialog: false,
        tempId: ''
      }
    },
    computed:{
        ...mapGetters({
            balen: 'shift/getBalen',
            shiftId: 'shift/getId'
        }),   
     
    },    
    methods:{                         
        ...mapActions({
            getLastShift: 'shift/getLastShift'
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
        },         
        //  tambah balen
        tambahBalen(){                       
                this.balen.push({jumlah:this.formatRupiahEsc(this.jumlah)})
                this.loading2 = true     
                axios({
                    url: `${this.$store.state.baseUrl}shift/${this.shiftId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        balen:this.balen
                    }
                    })
                    .then(({data}) =>{
                        this.jumlah = null
                        this.loading2 = false
                        this.getLastShift(this.$store.state.baseUrl)
                    })
                    .catch(err=>{
                            this.loading2 = false
                            console.log(err)
                            Swal.fire({
                            icon: 'error',
                            title: 'gagal !',
                            text: err.errors,
                            })                        
                    }) 
        },
        deleteItem(data){
                Swal.fire({
                        title: 'Apakah anda yakin akan menghapus?',
                        showDenyButton: true,
                        confirmButtonText: `Batal`,
                        denyButtonText: `Ya,Hapus`,
                        }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                                
                        } else if (result.isDenied) {
                                this.loading2 = true
                                const temp = this.balen.filter(item => String(item._id) !== String(data._id))
                                    axios({
                                        url: `${this.$store.state.baseUrl}shift/${this.shiftId}`,
                                        method: 'put',
                                        headers:{
                                            token : localStorage.getItem('token')
                                        },
                                        data:{
                                            balen:temp
                                        }
                                        })
                                        .then(({data}) =>{
                                            this.loading2 = false
                                            this.getLastShift(this.$store.state.baseUrl)
                                        })
                                        .catch(err=>{
                                                this.loading2 = false
                                                console.log(err)
                                                Swal.fire({
                                                icon: 'error',
                                                title: 'gagal !',
                                                text: err.errors,
                                                })                        
                                        })                   
                        }
                    })   
 
        },
        formEdit(item){
                this.jumlah = this.getRp(item.jumlah)
                this.tempId = item._id
                this.dialog = true
        },
        editItem(){
            this.loading2 = true
            this.balen.forEach(element => {
                if(element._id === this.tempId){
                    element.jumlah = this.formatRupiahEsc(this.jumlah)
                }
            });
                axios({
                    url: `${this.$store.state.baseUrl}shift/${this.shiftId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        balen:this.balen
                    }
                    })
                    .then(({data}) =>{
                        this.getLastShift(this.$store.state.baseUrl)
                        this.jumlah = null
                        this.loading2 = false
                        this.dialog = false
                    })
                    .catch(err=>{
                            this.loading2 = false
                            console.log(err)
                            Swal.fire({
                            icon: 'error',
                            title: 'gagal !',
                            text: err.errors,
                            })                        
                    })  
        }
    },
    watch:{
        jumlah: function(){
            if(this.jumlah){
                var number_string = this.jumlah.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.jumlah = sisa ? '.' : '';
                    rupiah += this.jumlah + ribuan.join('.');
                }            
    
                this.jumlah = rupiah
            }
        },
        balen: function(){
            this.totalBalen = 0
            this.balen.forEach(element => {
                this.totalBalen += Number(element.jumlah)
            });
        }  
    },
    created(){
            this.totalBalen = 0
            this.balen.forEach(element => {
                this.totalBalen += Number(element.jumlah)
            });
    }
  }
</script>