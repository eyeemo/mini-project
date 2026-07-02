<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ItemsApi } from '../api';
import { itemsStore } from '../store/items';
import { ui } from '../store/ui';
import { toast } from '../store/toast';
import { categoryColor } from '../lib/categories';
import { itemCode } from '../lib/format';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const router = useRouter();

onMounted(() => itemsStore.load());

const filtered = computed(() => {
    const q = ui.search.trim().toLowerCase();
    return itemsStore.all.filter((item) => {
        if (ui.category && (item.label || 'Uncategorised') !== ui.category) return false;
        if (!q) return true;
        return [item.name, item.specification, item.label]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q));
    });
});

function openItem(item) {
    router.push({ name: 'items.show', params: { id: item.id } });
}

// ── Delete flow ──
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
        await itemsStore.load(true);
    } catch (e) {
        toast.error('Failed to delete item.');
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-5">
        <!-- Filter pills + add -->
        <div class="flex flex-wrap items-center gap-2">
            <button
                class="pill"
                :class="ui.category === '' ? 'pill-active' : 'pill-idle'"
                @click="ui.category = ''"
            >
                All <span class="font-mono opacity-70">({{ itemsStore.all.length }})</span>
            </button>
            <button
                v-for="cat in itemsStore.categories"
                :key="cat.label"
                class="pill"
                :class="ui.category === cat.label ? 'pill-active' : 'pill-idle'"
                @click="ui.category = cat.label"
            >
                <span class="h-1.5 w-1.5 rounded-full" :class="cat.color.dot"></span>
                {{ cat.label }} <span class="font-mono opacity-70">({{ cat.count }})</span>
            </button>

            <button
                class="ml-auto flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
                @click="ui.openItemCreate()"
            >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Add Item
            </button>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-2xl border border-white/5 bg-ink-850">
            <div v-if="itemsStore.loading && !itemsStore.loaded" class="px-6 py-16 text-center text-sm text-slate-500">Loading…</div>

            <div v-else-if="filtered.length === 0" class="px-6 py-16 text-center">
                <p class="text-sm text-slate-400">No items match your filters.</p>
                <button class="mt-2 text-sm font-medium text-brand-400 hover:underline" @click="ui.openItemCreate()">
                    Add your first item →
                </button>
            </div>

            <table v-else class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th class="px-5 py-3.5">ID</th>
                        <th class="px-5 py-3.5">Name</th>
                        <th class="hidden px-5 py-3.5 md:table-cell">Specification</th>
                        <th class="px-5 py-3.5">Category</th>
                        <th class="px-5 py-3.5"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    <tr
                        v-for="item in filtered"
                        :key="item.id"
                        class="group cursor-pointer transition hover:bg-white/3"
                        @click="openItem(item)"
                    >
                        <td class="px-5 py-4 align-top font-mono text-xs text-slate-500">{{ itemCode(item.id) }}</td>
                        <td class="px-5 py-4 align-top font-semibold text-white">{{ item.name }}</td>
                        <td class="hidden max-w-xs px-5 py-4 align-top text-slate-400 md:table-cell">
                            <span class="line-clamp-2">{{ item.specification || '—' }}</span>
                        </td>
                        <td class="px-5 py-4 align-top">
                            <span
                                v-if="item.label"
                                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="categoryColor(item.label).badge"
                            >
                                <span class="h-1.5 w-1.5 rounded-full" :class="categoryColor(item.label).dot"></span>
                                {{ item.label }}
                            </span>
                            <span v-else class="text-xs text-slate-600">—</span>
                        </td>
                        <td class="px-5 py-4 align-top text-right" @click.stop>
                            <div class="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                                <button class="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-brand-300" title="Edit" @click="ui.openItemEdit(item.id)">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                </button>
                                <button class="rounded-md p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400" title="Delete" @click="askDelete(item)">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
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

<style scoped>
.pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 9999px;
    padding: 0.4rem 0.85rem;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.15s ease;
}
.pill-idle {
    background-color: var(--color-ink-800);
    color: var(--color-slate-300);
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.06);
}
.pill-idle:hover {
    background-color: var(--color-ink-700);
}
.pill-active {
    background-color: rgb(99 102 241 / 0.15);
    color: var(--color-brand-200);
    box-shadow: inset 0 0 0 1px rgb(99 102 241 / 0.35);
}
</style>
