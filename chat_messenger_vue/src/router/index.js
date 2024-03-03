import {createRouter , createWebHistory} from "vue-router";
import home from '@/components/home.vue';
import login from '@/components/login.vue';
import singUp from '@/components/signUp.vue';
import chatBody from '@/components/chatBody.vue';
import sideBar from '@/components/sideBar.vue';
import {useChatStore} from "@/store/chat-store.js";
import {toRefs} from "vue";
const routes = [
    {
        path :'/',
        name : 'home',
        component :home
    },
    {
        path :'/login',
        name : 'login',
        component : ()=>import('@/components/login.vue')
    },
    {
        path :'/signUp',
        name : 'signup',
        component :()=>import('@/components/signUp.vue')
    },
    {
        path :'/chatBody',
        name : 'chatBody',
        component: chatBody,
        meta : {requiresAuth :true}
    },
    {
        path :'/sideBar',
        name : 'sideBar',
        component :sideBar,
        meta : {requiresAuth: true}
    }
]

const router =createRouter({
    history :createWebHistory(),
    routes
})


router.beforeEach(async (to , from,next)=>{
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    const chatStore =useChatStore()
    const {returnUrl}=toRefs(chatStore)
    const token = localStorage.getItem('token')
  if (authRequired && !token){
  returnUrl.value = to.fullPath;
  next('/login');
  }else{
      next()
  }
})
export default router
