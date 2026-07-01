import { reactive } from 'vue';
import { AuthApi, csrf } from '../api';

// Global auth state shared across the SPA.
export const auth = reactive({
    user: null,
    ready: false, // becomes true once the initial session check finishes

    get check() {
        return this.user !== null;
    },

    get isAdmin() {
        return !!this.user?.is_admin;
    },

    async register(payload) {
        await csrf();
        const { data } = await AuthApi.register(payload);
        this.user = data;
        return data;
    },

    // Resolve the current session on app boot.
    async init() {
        try {
            const { data } = await AuthApi.me();
            this.user = data;
        } catch (e) {
            this.user = null;
        } finally {
            this.ready = true;
        }
    },

    async login(credentials) {
        await csrf();
        const { data } = await AuthApi.login(credentials);
        this.user = data;
        return data;
    },

    async logout() {
        try {
            await AuthApi.logout();
        } finally {
            this.user = null;
        }
    },
});
