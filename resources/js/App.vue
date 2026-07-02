<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppSidebar from './components/AppSidebar.vue';
import AppTopbar from './components/AppTopbar.vue';
import ItemFormModal from './components/ItemFormModal.vue';
import ToastHost from './components/ToastHost.vue';
import { auth } from './store/auth';

const route = useRoute();

// Auth pages (login/register) render standalone; everything else gets the shell.
const showShell = computed(() => auth.check && !['login', 'register'].includes(route.name));
</script>

<template>
    <div class="min-h-screen bg-ink-950 text-slate-200">
        <template v-if="showShell">
            <AppSidebar />
            <div class="flex min-h-screen flex-col md:pl-64">
                <AppTopbar />
                <main class="flex-1 px-4 py-6 sm:px-6">
                    <RouterView v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </RouterView>
                </main>
            </div>
            <ItemFormModal />
        </template>

        <template v-else>
            <RouterView v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </template>

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
