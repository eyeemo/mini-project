<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ItemsApi } from '../api';
import { itemsStore } from '../store/items';
import { ui } from '../store/ui';
import { toast } from '../store/toast';
import { categoryColor } from '../lib/categories';
import { itemCode, formatDate } from '../lib/format';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const props = defineProps({
    id: { type: [String, Number], required: true },
});

const router = useRouter();
const item = ref(null);
const loading = ref(true);

onMounted(load);

// Refresh once the edit modal closes so we show the saved values.
watch(
    () => ui.itemModal.open,
    (open, was) => {
        if (was && !open) load();
    }
);

async function load() {
    loading.value = true;
    try {
        const { data } = await ItemsApi.get(props.id);
        item.value = data;
    } catch (e) {
        toast.error('Item not found.');
        router.replace({ name: 'items' });
    } finally {
        loading.value = false;
    }
}

const confirmOpen = ref(false);
const deleting = ref(false);

async function doDelete() {
    deleting.value = true;
    try {
        await ItemsApi.remove(props.id);
        toast.success(`"${item.value.name}" deleted.`);
        await itemsStore.load(true);
        router.push({ name: 'items' });
    } catch (e) {
        toast.error('Failed to delete item.');
        deleting.value = false;
    }
}
</script>

<template>
    <div class="mx-auto max-w-2xl">
        <button class="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-300" @click="router.push({ name: 'items' })">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Back to catalog
        </button>

        <div v-if="loading" class="mt-6 text-sm text-slate-500">Loading…</div>

        <div v-else-if="item" class="mt-4 overflow-hidden rounded-2xl border border-white/5 bg-ink-850">
            <div class="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 p-6">
                <div class="min-w-0">
                    <p class="font-mono text-xs text-slate-500">{{ itemCode(item.id) }}</p>
                    <h1 class="mt-1 text-2xl font-bold text-white">{{ item.name }}</h1>
                    <span
                        v-if="item.label"
                        class="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        :class="categoryColor(item.label).badge"
                    >
                        <span class="h-1.5 w-1.5 rounded-full" :class="categoryColor(item.label).dot"></span>
                        {{ item.label }}
                    </span>
                </div>
                <div class="flex gap-2">
                    <button
                        class="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
                        @click="ui.openItemEdit(item.id)"
                    >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                        Edit
                    </button>
                    <button
                        class="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
                        @click="confirmOpen = true"
                    >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        Delete
                    </button>
                </div>
            </div>

            <dl class="space-y-5 p-6">
                <div>
                    <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Specification</dt>
                    <dd class="mt-1.5 whitespace-pre-line text-sm text-slate-300">{{ item.specification || '—' }}</dd>
                </div>
                <div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                    <div>
                        <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Created</dt>
                        <dd class="mt-1.5 text-sm text-slate-300">{{ formatDate(item.created_at) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Last updated</dt>
                        <dd class="mt-1.5 text-sm text-slate-300">{{ formatDate(item.updated_at) }}</dd>
                    </div>
                </div>
            </dl>
        </div>

        <ConfirmDialog
            :open="confirmOpen"
            title="Delete item?"
            :message="item ? `Are you sure you want to delete “${item.name}”? This cannot be undone.` : ''"
            confirm-text="Delete"
            :busy="deleting"
            @confirm="doDelete"
            @cancel="confirmOpen = false"
        />
    </div>
</template>
