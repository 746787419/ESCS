import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Watchmsg from '../views/Watchmsg.vue'
import register from '../views/register.vue'
import Login from '../views/Login.vue'
import EmployeesList from '../views/EmployeesList.vue'
import axios from 'axios'
import {$serverUrl} from '../my_config'
import {Toast} from 'mint-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },{
	  path:'/watchmsg',
	  name:'Watchmsg',
	  component:Watchmsg
  },{
	  path:'/register',
	  name:'register',
	  component:register
  },{
	path:'/login',
	name:'Login',
	component:Login
  },{
	  path:'/employeesList',
	  name:"EmployeesList",
	  component:EmployeesList,
	  beforeEnter:(to,from,next)=>{
		  axios.post($serverUrl+'/tokenTest','token='+Vue.$cookies.get('token')).then(res=>{
			  // console.log(res)
			  if(res.data.isLogin){
			  		next()
			  }else{
					Toast('请先登录')
			  		next('/login')
			  }
		  })
	  }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
