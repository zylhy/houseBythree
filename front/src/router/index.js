
import { createWebHistory, createRouter } from 'vue-router'
let routes = [{ path: '/', component: () => import('../views/index.vue') }]
const router = new createRouter({
    history: createWebHistory(),
    routes
})
export default router