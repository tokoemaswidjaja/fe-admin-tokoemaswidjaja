<template>
  <v-app>
    <div class="container">
		<div class="screen" v-if="!loading">
			<div class="screen__content">
				<form class="login">		
					<img src="../assets/logoToko.png" width="200" alt="icon">       
					<div class="login__field">
						<i class="login__icon fas fa-user"></i>
						<input v-model="email" type="text" class="login__input" placeholder="Email" v-on:keyup.enter="login()">
					</div>
					<div class="login__field">
						<i class="login__icon fas fa-lock"></i>
						<input v-model="password" :type="type" class="login__input" placeholder="Password" v-on:keyup.enter="login()">
						<v-checkbox
						v-model="checkbox"
						:label="`Show / Hide`"
						></v-checkbox>                    
					</div>
					<button class="button login__submit" @click.prevent="login()">
						<span class="button__text">Log In Now</span>
						<i class="button__icon fas fa-chevron-right"></i>
					</button>				
				</form>
			</div>
			<div class="screen__background">
				<span class="screen__background__shape screen__background__shape4"></span>
				<span class="screen__background__shape screen__background__shape3"></span>		
				<span class="screen__background__shape screen__background__shape2"></span>
				<span class="screen__background__shape screen__background__shape1"></span>
			</div>		
		</div>
        <v-container style="height: 400px;" v-if="loading">
        <v-row
            class="fill-height"
            align-content="center"
            justify="center"
        >
            <v-col
            class="text-subtitle-1 text-center"
            cols="12"
            >
					<img src="../assets/logoToko.png" width="200" alt="icon">                       
            </v-col>
            <v-col cols="6">
            <v-progress-linear
                color="yellow darken-2"
                indeterminate
                rounded
                height="6"
            ></v-progress-linear>
            </v-col>
        </v-row>
        </v-container> 		
    </div>     
</v-app>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'


export default {
  name: 'Login-Admin',
  data(){
    return{
		loading: false,
		email: '',
		password: '',
		type:'password',
		checkbox: false
    }
  },
  computed:{
    getRole(){
      return this.$store.state.userRole
    }      
  },
  methods:{    
    login(){
		this.loading = true
       axios({
            url: `${this.$store.state.baseUrl}admin/login`,
            method: 'post',
            data:{
              email: this.email,
              password: this.password
            }
            })
            .then(({data})=>{
				this.loading = false
                this.email = ''
                this.password = ''
                localStorage.setItem('token',data.token)
                localStorage.setItem('user',data.user.username)  
                localStorage.setItem('email',data.user.email)                
                localStorage.setItem('userId',data.user._id)                
                localStorage.setItem('role',data.user.role)
                this.$store.commit('setUser',data.user.username)
                this.$store.commit('setEmail',data.user.email)
                this.$store.commit('setUserId',data.user._id)    
                this.$store.commit('setRole',data.user.role)    
                        
                this.$router.push('/')
                this.$store.commit('setLogin',true)
            })
            .catch(err=>{
				this.loading = false
				if(err.response.status === 401){
					Swal.fire({
					icon: 'error',
					title: 'password salah !',
					text: err.errors,
					})
				}else{
					Swal.fire({
					icon: 'error',
					title: 'email salah !',
					text: err.errors,
					})
				}
            })
    }
  },
    watch: {
        checkbox: function(){
            if(this.type === 'password'){
                this.type = 'text'
            }else{
                this.type = 'password'
            }
        }
    },  

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


/* new */


* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	font-family: Raleway, sans-serif;
}


.container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
}

.screen {
	background: linear-gradient(90deg, #54a467, #385340);
	position: relative;
	height: 600px;
	width: 360px;
	box-shadow: 0px 0px 24px #333333;
}

.screen__content {
	z-index: 1;
	position: relative;
	height: 100%;
}

.screen__background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	-webkit-clip-path: inset(0 0 0 0);
	clip-path: inset(0 0 0 0);
}

.screen__background__shape {
	transform: rotate(45deg);
	position: absolute;
}

.screen__background__shape1 {
	height: 520px;
	width: 520px;
	background: #fff;
	top: -50px;
	right: 120px;
	border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
	height: 220px;
	width: 220px;
	background: #B7935A;
	top: -172px;
	right: 0;
	border-radius: 32px;
}

.screen__background__shape3 {
	height: 540px;
	width: 190px;
	background: linear-gradient(270deg, #B7935A, #B7935A);
	top: -24px;
	right: 0;
	border-radius: 32px;
}

.screen__background__shape4 {
	height: 400px;
	width: 200px;
	background: #B7935A;
	top: 420px;
	right: 50px;
	border-radius: 60px;
}

.login {
	padding: 30px;
}

.login__field {
	padding: 20px 0px;
	position: relative;
}

.login__icon {
	position: absolute;
	top: 30px;
	color: #B7935A;
}

.login__input {
	border: none;
	border-bottom: 2px solid #d1d1d4;
	background: none;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 75%;
	transition: 0.2s;
}

.login__input:active,
.login__input:focus,
.login__input:hover {
	outline: none;
	border-bottom-color: #B7935A;
}

.login__submit {
	background: #fff;
	font-size: 14px;
	margin-top: 30px;
	padding: 16px 20px;
	border-radius: 26px;
	border: 1px solid #d4d3e8;
	text-transform: uppercase;
	font-weight: 700;
	display: flex;
	align-items: center;
	width: 100%;
	color: #B7935A;
	box-shadow: 0px 2px 2px #333333;
	cursor: pointer;
	transition: 0.2s;
}

.login__submit:active,
.login__submit:focus,
.login__submit:hover {
	border-color: #B7935A;
	outline: none;
}

.button__icon {
	font-size: 24px;
	margin-left: auto;
	color: #B7935A;
}

.social-login {
	position: absolute;
	height: 140px;
	width: 160px;
	text-align: center;
	bottom: 0px;
	right: 0px;
	color: #fff;
}

.social-icons {
	display: flex;
	align-items: center;
	justify-content: center;
}

.social-login__icon {
	padding: 20px 10px;
	color: #fff;
	text-decoration: none;
	text-shadow: 0px 0px 8px #B7935A;
}

.social-login__icon:hover {
	transform: scale(1.5);
}

</style>
