// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Applicants from '../views/Applicants.vue';
import Events from '../views/Events.vue';
import Login from '../views/Login.vue';
import store from "@/store/store.js";


const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/applicants', component: Applicants },
    { path: '/events', component: Events},
    { path: '/login', component: Login}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.user && store.state.user.role > 1;
    if (to.path !== '/login' && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
