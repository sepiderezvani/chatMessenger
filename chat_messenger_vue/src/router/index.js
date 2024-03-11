import {createRouter, createWebHistory} from "vue-router";
import home from '@/components/home.vue';
import login from '@/components/login.vue';
import singUp from '@/components/signUp.vue';
import chatBody from '@/components/chatBody.vue';
import sideBar from '@/components/sideBar.vue';
import {useChatStore} from "@/store/chat-store.js";
import {toRefs} from "vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: home,
        children: [
            {
                path: 'chatBody',
                name: 'chatBody',
                component: () => import('@/components/chatBody.vue')
            },
            {
                path: 'sideBar',
                name: 'sideBar',
                component: () => import('@/components/sideBar.vue')
            },
            {
                path: 'user/:roomId',
                name: "user",
                component: () => import('@/components/user.vue')
            }
        ]
    },
    {
        path: "/auth",
        component: () => import('@/views/Auth.vue'),
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/components/login.vue')
            },
            {
                path: 'register',
                name: 'signup',
                component: () => import('@/components/signUp.vue')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach(async (to, from, next) => {
    const publicPages = ['/auth/login', '/auth/register']
    const authRequired = !publicPages.includes(to.path)
    const chatStore = useChatStore()
    const {returnUrl} = toRefs(chatStore)
    const token = localStorage.getItem('token')
    if (authRequired && !token) {
        returnUrl.value = to.fullPath;
        next('/auth/login');
    } else {
        next()
    }
})
export default router
