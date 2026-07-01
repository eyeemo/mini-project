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
        <div v-if="open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4" @click.self="emit('cancel')">
            <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
                <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
                <div class="mt-6 flex justify-end gap-2">
                    <button
                        class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        :disabled="busy"
                        @click="emit('cancel')"
                    >
                        Cancel
                    </button>
                    <button
                        class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
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
