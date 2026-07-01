<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ItemsApi } from '../api';
import { toast } from '../store/toast';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const router = useRouter();

const items = ref([]);
const labels = ref([]);
const loading = ref(false);
const search = ref('');
const activeLabel = ref('');

let debounce = null;

async function load() {
    loading.value = true;
    try {
        const { data } = await ItemsApi.list({
            q: search.value || undefined,
            label: activeLabel.value || undefined,
        });
        items.value = data;
    } catch (e) {
        toast.error('Failed to load items.');
    } finally {
        loading.value = false;
    }
}

async function loadLabels() {
    try {
        const { data } = await ItemsApi.labels();
        labels.value = data;
    } catch (e) {
        /* non-critical */
    }
}

watch(search, () => {
    clearTimeout(debounce);
    debounce = setTimeout(load, 300);
});
watch(activeLabel, load);

onMounted(() => {
    load();
    loadLabels();
});

// Delete flow: Select item -> Confirm dialog -> Delete -> Deleted toast
const confirmOpen = ref(false);
const deleting = ref(false);
const target = ref(null);

function askDelete(item) {
    target.value = item;
    confirmOpen.value = true;
}

async function doDelete() {
    if (!target.value) return;
    deleting.value = true;
    try {
        await ItemsApi.remove(target.value.id);
        toast.success(`"${target.value.name}" deleted.`);
        confirmOpen.value = false;
        target.value = null;
        await Promise.all([load(), loadLabels()]);
    } catch (e) {
        toast.error('Failed to delete item.');
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <div>
        <!-- Dashboard header + Create entry point -->
        <div class="flex items-center justify-between gap-4 mb-5">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p class="text-sm text-slate-500">Browse, search and manage your items.</p>
            </div>
            <RouterLink
                to="/items/create"
                class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
                <span class="text-lg leading-none">+</span> Add item
            </RouterLink>
        </div>

        <!-- Search bar (always visible) + label filter -->
        <div class="rounded-xl border border-slate-200 bg-white p-4 mb-5">
            <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search by name, label or specification…"
                        class="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                </div>
                <select
                    v-model="activeLabel"
                    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                    <option value="">All categories</option>
                    <option v-for="l in labels" :key="l" :value="l">{{ l }}</option>
                </select>
            </div>
        </div>

        <!-- Item list / results -->
        <div v-if="loading" class="text-center py-12 text-slate-400 text-sm">Loading…</div>

        <div v-else-if="items.length === 0" class="text-center py-12">
            <p class="text-slate-500">No items found.</p>
            <RouterLink to="/items/create" class="text-indigo-600 text-sm font-medium hover:underline">
                Add your first item →
            </RouterLink>
        </div>

        <div v-else class="grid gap-3 sm:grid-cols-2">
            <div
                v-for="item in items"
                :key="item.id"
                class="group rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition cursor-pointer"
                @click="router.push({ name: 'items.show', params: { id: item.id } })"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <h3 class="font-semibold text-slate-900 truncate">{{ item.name }}</h3>
                        <span
                            v-if="item.label"
                            class="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                            {{ item.label }}
                        </span>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition" @click.stop>
                        <RouterLink
                            :to="{ name: 'items.edit', params: { id: item.id } }"
                            class="rounded-md p-1.5 text-amber-600 hover:bg-amber-50"
                            title="Edit"
                        >✎</RouterLink>
                        <button
                            class="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"
                            title="Delete"
                            @click="askDelete(item)"
                        >🗑</button>
                    </div>
                </div>
                <p v-if="item.specification" class="mt-2 text-sm text-slate-500 line-clamp-2">
                    {{ item.specification }}
                </p>
            </div>
        </div>

        <ConfirmDialog
            :open="confirmOpen"
            title="Delete item?"
            :message="target ? `Are you sure you want to delete “${target.name}”? This cannot be undone.` : ''"
            confirm-text="Delete"
            :busy="deleting"
            @confirm="doDelete"
            @cancel="confirmOpen = false"
        />
    </div>
</template>
