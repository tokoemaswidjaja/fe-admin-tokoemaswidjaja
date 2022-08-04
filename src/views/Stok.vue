<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Stok</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>

    <div data-app>
    <v-tabs>
        <v-tab :href="Retur">Retur</v-tab>
        <v-tab :href="Tambahan">Tambahan</v-tab>                 

        <v-tab-item :value="Retur">
                <Retur data-app/>
        </v-tab-item>
        <v-tab-item :value="Tambahan">
 
        </v-tab-item>                                                     
    </v-tabs>        
    </div>

  </div>
</template>

<script>
    import Retur from '@/components/Retur.vue'

    export default {
        data() {
        return {
            
        }
        },
        components: {
            Retur
        },
        methods: {   

        },
        created(){

        }    
    }

</script>