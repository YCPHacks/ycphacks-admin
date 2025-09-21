// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Applicants from '../views/Applicants.vue';
import Events from '../views/Events.vue';
import Login from '../views/Login.vue';
import Hardware from '@/views/Hardware.vue';
import store from "@/store/store.js";
import EventEdit from "@/views/EventEdit.vue";
import Sponsors from "@/views/Sponsors.vue";


const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/applicants', component: Applicants },
    { path: '/events', component: Events, name: 'Events' },
    { path: '/login', component: Login},
    { path: '/hardware', component: Hardware},
    {
        path: '/events/edit/:id',
        name: 'EventEdit',
        component: EventEdit,
        props: true
    },
    {path:"/sponsors", component: Sponsors}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const UserRole = store.state.user?.role;
    const isAuthenticated = UserRole === 'staff' || UserRole === 'oscar';
    if (to.path === '/login') {
        next();
    }else if (!isAuthenticated){
        next('/login');
    } else {
        next();
    }
});

export default router;
