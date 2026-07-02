<script setup>
import { ref, computed, watch } from 'vue';
import { ItemsApi } from '../api';
import { itemsStore } from '../store/items';
import { ui } from '../store/ui';
import { toast } from '../store/toast';

const form = ref({ name: '', specification: '', label: '' });
const errors = ref({});
const saving = ref(false);
const loading = ref(false);

const isEdit = computed(() => ui.itemModal.id != null);

// Open/populate whenever the shared modal state flips on.
watch(
    () => ({ open: ui.itemModal.open, id: ui.itemModal.id }),
    async ({ open, id }) => {
        if (!open) return;
        errors.value = {};
        form.value = { name: '', specification: '', label: '' };
        if (id == null) return;
        loading.value = true;
        try {
            const { data } = await ItemsApi.get(id);
            form.value = { name: data.name ?? '', specification: data.specification ?? '', label: data.label ?? '' };
        } catch (e) {
            toast.error('Item not found.');
            ui.closeItemModal();
        } finally {
            loading.value = false;
        }
    }
);

function close() {
    if (saving.value) return;
    ui.closeItemModal();
}

async function save() {
    saving.value = true;
    errors.value = {};
    try {
        if (isEdit.value) {
            await ItemsApi.update(ui.itemModal.id, form.value);
            toast.success('Changes saved.');
        } else {
            await ItemsApi.create(form.value);
            toast.success('Item created.');
        }
        await itemsStore.load(true);
        ui.closeItemModal();
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {};
            toast.error('Please fix the highlighted fields.');
        } else {
            toast.error('Something went wrong while saving.');
        }
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <transition name="fade">
        <div
            v-if="ui.itemModal.open"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            @click.self="close"
        >
            <div class="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/50">
                <!-- Header -->
                <div class="flex items-start justify-between border-b border-white/5 px-6 py-5">
                    <div>
                        <h3 class="text-lg font-bold text-white">{{ isEdit ? 'Edit Item' : 'Add New Item' }}</h3>
                        <p class="text-sm text-slate-500">{{ isEdit ? 'Update the details below.' : 'Fill in the fields to create a catalog entry.' }}</p>
                    </div>
                    <button class="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-300" @click="close">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <form class="space-y-5 px-6 py-6" @submit.prevent="save">
                    <div>
                        <label class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                            Name
                        </label>
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="e.g. Ceramic Pour-Over Dripper"
                            class="field"
                            :class="errors.name ? 'field-error' : ''"
                        />
                        <p v-if="errors.name" class="mt-1 text-xs text-rose-400">{{ errors.name[0] }}</p>
                    </div>

                    <div>
                        <label class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></svg>
                            Specification
                        </label>
                        <input
                            v-model="form.specification"
                            type="text"
                            placeholder="e.g. 400ml · Ceramic · Heat-resistant"
                            class="field"
                            :class="errors.specification ? 'field-error' : ''"
                        />
                        <p v-if="errors.specification" class="mt-1 text-xs text-rose-400">{{ errors.specification[0] }}</p>
                    </div>

                    <div>
                        <label class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg>
                            Label / Category
                        </label>
                        <input
                            v-model="form.label"
                            type="text"
                            placeholder="e.g. Brewing, Equipment, Accessories"
                            class="field"
                            :class="errors.label ? 'field-error' : ''"
                        />
                        <p v-if="errors.label" class="mt-1 text-xs text-rose-400">{{ errors.label[0] }}</p>
                    </div>

                    <div class="flex gap-3 pt-1">
                        <button
                            type="submit"
                            class="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400 disabled:opacity-60"
                            :disabled="saving || loading"
                        >
                            {{ saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Item' }}
                        </button>
                        <button
                            type="button"
                            class="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                            @click="close"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.field {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid rgb(255 255 255 / 0.1);
    background-color: var(--color-ink-800);
    padding: 0.7rem 0.9rem;
    font-size: 0.875rem;
    color: var(--color-slate-100);
    outline: none;
    transition: all 0.15s ease;
}
.field::placeholder {
    color: var(--color-slate-500);
}
.field:focus {
    border-color: rgb(99 102 241 / 0.6);
    box-shadow: 0 0 0 3px rgb(99 102 241 / 0.15);
}
.field-error {
    border-color: rgb(244 63 94 / 0.6);
}
</style>
