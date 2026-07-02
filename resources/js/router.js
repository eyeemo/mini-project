import { createRouter, createWebHistory } from 'vue-router';
import { auth } from './store/auth';
import { toast } from './store/toast';

import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Dashboard from './pages/Dashboard.vue';
import Items from './pages/Items.vue';
import ItemDetail from './pages/ItemDetail.vue';
import Users from './pages/Users.vue';

const routes = [
    { path: '/login', name: 'login', component: Login, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, title: 'Dashboard', subtitle: 'Overview and recent activity' },
    },
    {
        path: '/items',
        name: 'items',
        component: Items,
        meta: { requiresAuth: true, title: 'Item Catalog', subtitle: 'Browse and manage all items' },
    },
    {
        path: '/items/:id',
        name: 'items.show',
        component: ItemDetail,
        props: true,
        meta: { requiresAuth: true, title: 'Item Details', subtitle: 'Full specification and history' },
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
        meta: { requiresAuth: true, requiresAdmin: true, title: 'Users', subtitle: 'Manage who can access the system' },
    },
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
