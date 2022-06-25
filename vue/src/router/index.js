import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Watchmsg from '../views/Watchmsg.vue'
import register from '../views/register.vue'
import Login from '../views/Login.vue'
import EmployeesList from '../views/EmployeesList.vue'

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
	  component:EmployeesList
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
