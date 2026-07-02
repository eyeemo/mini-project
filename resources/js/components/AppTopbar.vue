<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '../store/auth';
import { toast } from '../store/toast';
import { ui } from '../store/ui';

const route = useRoute();
const router = useRouter();

const heading = computed(() => ({
    title: route.meta.title || 'Dashboard',
    subtitle: route.meta.subtitle || '',
}));

const initials = computed(() => {
    const name = auth.user?.name || '?';
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
});

// Typing in the top bar search always lands the user on the catalog.
function onSearch() {
    if (route.name !== 'items') router.push({ name: 'items' });
}

const menuOpen = ref(false);

async function logout() {
    menuOpen.value = false;
    await auth.logout();
    toast.info('You have been signed out.');
    router.replace({ name: 'login' });
}
</script>

<template>
    <header class="sticky top-0 z-20 border-b border-white/5 bg-ink-900/80 backdrop-blur">
        <div class="flex items-center gap-4 px-4 py-3.5 sm:px-6">
            <!-- Mobile menu toggle -->
            <button
                class="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 md:hidden"
                @click="ui.sidebarOpen = true"
                aria-label="Open menu"
            >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <div class="min-w-0 flex-1">
                <h1 class="truncate text-lg font-bold text-white">{{ heading.title }}</h1>
                <p v-if="heading.subtitle" class="truncate text-sm text-slate-500">{{ heading.subtitle }}</p>
            </div>

            <!-- Search -->
            <div class="relative hidden w-72 max-w-[40vw] sm:block">
                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                    v-model="ui.search"
                    type="text"
                    placeholder="Search items…"
                    class="w-full rounded-xl border border-white/10 bg-ink-800 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                    @focus="onSearch"
                    @input="onSearch"
                />
            </div>

            <!-- Avatar / menu -->
            <div class="relative">
                <button
                    class="grid h-10 w-10 place-items-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-200 ring-1 ring-brand-500/30 transition hover:bg-brand-500/25"
                    @click="menuOpen = !menuOpen"
                >
                    {{ initials }}
                </button>

                <div v-if="menuOpen" class="fixed inset-0 z-10" @click="menuOpen = false"></div>
                <transition name="fade">
                    <div v-if="menuOpen" class="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-850 shadow-xl shadow-black/40">
                        <div class="border-b border-white/5 px-4 py-3">
                            <p class="truncate text-sm font-semibold text-white">{{ auth.user?.name }}</p>
                            <p class="truncate text-xs text-slate-500">{{ auth.user?.email }}</p>
                        </div>
                        <button
                            class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/5"
                            @click="logout"
                        >
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
                            Sign out
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </header>
</template>
