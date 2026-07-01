import { createRouter, createWebHistory } from 'vue-router';
import { auth } from './store/auth';
import { toast } from './store/toast';

import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Dashboard from './pages/Dashboard.vue';
import ItemForm from './pages/ItemForm.vue';
import ItemDetail from './pages/ItemDetail.vue';
import Users from './pages/Users.vue';

const routes = [
    { path: '/login', name: 'login', component: Login, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
    { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/items/create', name: 'items.create', component: ItemForm, meta: { requiresAuth: true } },
    { path: '/items/:id', name: 'items.show', component: ItemDetail, props: true, meta: { requiresAuth: true } },
    { path: '/items/:id/edit', name: 'items.edit', component: ItemForm, props: true, meta: { requiresAuth: true } },
    { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

// Resolve the session once, then enforce auth on every navigation.
router.beforeEach(async (to) => {
    if (!auth.ready) {
        await auth.init();
    }

    if (to.meta.requiresAuth && !auth.check) {
        return { name: 'login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : {} };
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        toast.error('Admin access required.');
        return { name: 'dashboard' };
    }

    if (to.meta.guestOnly && auth.check) {
        return { name: 'dashboard' };
    }
});

export default router;
