// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Applicants from '../views/Applicants.vue';

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/applicants', component: Applicants },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
