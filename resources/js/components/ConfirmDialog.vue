<script setup>
defineProps({
    open: Boolean,
    title: { type: String, default: 'Are you sure?' },
    message: { type: String, default: '' },
    confirmText: { type: String, default: 'Confirm' },
    busy: Boolean,
});
const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
    <transition name="fade">
        <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" @click.self="emit('cancel')">
            <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-2xl shadow-black/50">
                <div class="flex items-start gap-3">
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-500/15 text-rose-400">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </span>
                    <div class="min-w-0">
                        <h3 class="text-base font-bold text-white">{{ title }}</h3>
                        <p class="mt-1 text-sm text-slate-400">{{ message }}</p>
                    </div>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                    <button
                        class="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-60"
                        :disabled="busy"
                        @click="emit('cancel')"
                    >
                        Cancel
                    </button>
                    <button
                        class="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-400 disabled:opacity-60"
                        :disabled="busy"
                        @click="emit('confirm')"
                    >
                        {{ busy ? 'Working…' : confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>
