<script setup>
import { onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { auth } from '../store/auth';
import { itemsStore } from '../store/items';
import { ui } from '../store/ui';

const router = useRouter();

onMounted(() => itemsStore.load());

function pickCategory(label) {
    ui.category = label;
    ui.search = '';
    ui.sidebarOpen = false;
    router.push({ name: 'items' });
}

function newItem() {
    ui.sidebarOpen = false;
    ui.openItemCreate();
}
</script>

<template>
    <!-- Mobile backdrop -->
    <div
        v-if="ui.sidebarOpen"
        class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        @click="ui.sidebarOpen = false"
    ></div>

    <aside
        class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-ink-900 transition-transform duration-200 md:translate-x-0"
        :class="ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
        <!-- Brand -->
        <div class="flex items-center gap-3 px-5 py-5">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/30">
                <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                </svg>
            </span>
            <div class="leading-tight">
                <p class="font-semibold text-white">NexaCorp</p>
                <p class="font-mono text-xs text-slate-500">Inventory v2</p>
            </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 pb-4">
            <!-- Workspace -->
            <p class="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</p>

            <RouterLink :to="{ name: 'dashboard' }" class="nav-link" active-class="nav-link-active" @click="ui.sidebarOpen = false">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
                Dashboard
            </RouterLink>

            <RouterLink :to="{ name: 'items' }" class="nav-link" active-class="nav-link-active" @click="ui.category = ''; ui.sidebarOpen = false">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                </svg>
                All Items
            </RouterLink>

            <RouterLink v-if="auth.isAdmin" :to="{ name: 'users' }" class="nav-link" active-class="nav-link-active" @click="ui.sidebarOpen = false">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Users
            </RouterLink>

            <!-- Categories -->
            <template v-if="itemsStore.categories.length">
                <p class="px-3 pb-2 pt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</p>
                <button
                    v-for="cat in itemsStore.categories"
                    :key="cat.label"
                    class="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                    @click="pickCategory(cat.label)"
                >
                    <span class="h-2 w-2 rounded-full" :class="cat.color.dot"></span>
                    <span class="flex-1 text-left truncate">{{ cat.label }}</span>
                    <span class="font-mono text-xs text-slate-500">{{ cat.count }}</span>
                </button>
            </template>
        </nav>

        <!-- New item CTA -->
        <div class="border-t border-white/5 p-3">
            <button
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
                @click="newItem"
            >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                New Item
            </button>
        </div>
    </aside>
</template>

<style scoped>
.nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: 0.5rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-slate-400);
    transition: all 0.15s ease;
}
.nav-link:hover {
    background-color: rgb(255 255 255 / 0.05);
    color: var(--color-slate-200);
}
.nav-link-active {
    background-color: rgb(99 102 241 / 0.15);
    color: var(--color-brand-200);
    box-shadow: inset 0 0 0 1px rgb(99 102 241 / 0.25);
}
</style>
