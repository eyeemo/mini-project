<script setup>
import { toastState, dismissToast } from '../store/toast';

const styles = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    info: 'border-white/10 bg-ink-800 text-slate-200',
};
const icons = { success: '✓', error: '✕', info: 'ℹ' };
const iconTints = {
    success: 'bg-emerald-500/20 text-emerald-300',
    error: 'bg-rose-500/20 text-rose-300',
    info: 'bg-white/10 text-slate-300',
};
</script>

<template>
    <div class="fixed bottom-4 right-4 z-60 flex w-80 max-w-[90vw] flex-col gap-2">
        <transition-group name="toast">
            <div
                v-for="t in toastState.items"
                :key="t.id"
                class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/30 backdrop-blur"
                :class="styles[t.type]"
                @click="dismissToast(t.id)"
            >
                <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold" :class="iconTints[t.type]">{{ icons[t.type] }}</span>
                <span class="flex-1 text-sm text-slate-100">{{ t.message }}</span>
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
