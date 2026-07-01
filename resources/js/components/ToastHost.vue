<script setup>
import { toastState, dismissToast } from '../store/toast';

const styles = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-slate-700',
};
const icons = { success: '✓', error: '✕', info: 'ℹ' };
</script>

<template>
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[90vw]">
        <transition-group name="toast">
            <div
                v-for="t in toastState.items"
                :key="t.id"
                class="flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg cursor-pointer"
                :class="styles[t.type]"
                @click="dismissToast(t.id)"
            >
                <span class="font-bold">{{ icons[t.type] }}</span>
                <span class="text-sm flex-1">{{ t.message }}</span>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
