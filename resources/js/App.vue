<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import ToastHost from './components/ToastHost.vue';
import { auth } from './store/auth';
import { toast } from './store/toast';

const route = useRoute();
const router = useRouter();

const showChrome = computed(() => route.name !== 'login');

async function handleLogout() {
    await auth.logout();
    toast.info('You have been signed out.');
    router.replace({ name: 'login' });
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 text-slate-800">
        <header v-if="showChrome" class="bg-white border-b border-slate-200 sticky top-0 z-20">
            <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                <RouterLink to="/" class="flex items-center gap-2 font-semibold text-slate-900">
                    <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">📦</span>
                    <span>Item Manager</span>
                </RouterLink>
                <span class="text-xs text-slate-400 hidden sm:inline">Laravel · Vue · PostgreSQL</span>

                <div v-if="auth.check" class="ml-auto flex items-center gap-3">
                    <RouterLink
                        to="/"
                        class="text-sm font-medium text-slate-600 hover:text-indigo-600"
                        active-class="text-indigo-600"
                    >
                        Items
                    </RouterLink>
                    <RouterLink
                        v-if="auth.isAdmin"
                        to="/users"
                        class="text-sm font-medium text-slate-600 hover:text-indigo-600"
                        active-class="text-indigo-600"
                    >
                        Users
                    </RouterLink>
                    <span class="text-sm text-slate-600 hidden sm:inline">
                        👤 {{ auth.user?.name }}
                    </span>
                    <button
                        class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        @click="handleLogout"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-6">
            <RouterView v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </main>

        <ToastHost />
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
