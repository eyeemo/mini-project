<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ItemsApi } from '../api';
import { toast } from '../store/toast';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const props = defineProps({
    id: { type: [String, Number], required: true },
});

const router = useRouter();
const item = ref(null);
const loading = ref(true);

onMounted(load);

async function load() {
    loading.value = true;
    try {
        const { data } = await ItemsApi.get(props.id);
        item.value = data;
    } catch (e) {
        toast.error('Item not found.');
        router.replace({ name: 'dashboard' });
    } finally {
        loading.value = false;
    }
}

// Delete flow
const confirmOpen = ref(false);
const deleting = ref(false);

async function doDelete() {
    deleting.value = true;
    try {
        await ItemsApi.remove(props.id);
        toast.success(`"${item.value.name}" deleted.`);
        router.push({ name: 'dashboard' });
    } catch (e) {
        toast.error('Failed to delete item.');
        deleting.value = false;
    }
}

function formatDate(s) {
    if (!s) return '';
    return new Date(s).toLocaleString();
}
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <RouterLink to="/" class="text-sm text-slate-500 hover:text-slate-700">← Back to dashboard</RouterLink>

        <div v-if="loading" class="mt-6 text-slate-400 text-sm">Loading…</div>

        <div v-else-if="item" class="mt-3">
            <div class="rounded-xl border border-slate-200 bg-white p-6">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-semibold text-slate-900">{{ item.name }}</h1>
                        <span
                            v-if="item.label"
                            class="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                        >
                            {{ item.label }}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <RouterLink
                            :to="{ name: 'items.edit', params: { id: item.id } }"
                            class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                        >
                            Edit
                        </RouterLink>
                        <button
                            class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                            @click="confirmOpen = true"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <dl class="mt-6 space-y-4 border-t border-slate-100 pt-5">
                    <div>
                        <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Specification</dt>
                        <dd class="mt-1 whitespace-pre-line text-sm text-slate-700">
                            {{ item.specification || '—' }}
                        </dd>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Created</dt>
                            <dd class="mt-1 text-sm text-slate-700">{{ formatDate(item.created_at) }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Last updated</dt>
                            <dd class="mt-1 text-sm text-slate-700">{{ formatDate(item.updated_at) }}</dd>
                        </div>
                    </div>
                </dl>
            </div>
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
