import './bootstrap';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import api from './api';
import { auth } from './store/auth';

// If the session expires mid-use, bounce the user back to the login page.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            auth.user = null;
            if (router.currentRoute.value.name !== 'login') {
                router.replace({ name: 'login' });
            }
        }
        return Promise.reject(error);
    }
);

createApp(App).use(router).mount('#app');
