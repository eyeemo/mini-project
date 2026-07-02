<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { itemsStore } from '../store/items';
import { ui } from '../store/ui';
import { itemCode } from '../lib/format';

const router = useRouter();

onMounted(() => itemsStore.load());

const total = computed(() => itemsStore.all.length);
const topCategory = computed(() => itemsStore.categories[0] || null);

const recent = computed(() => {
    // Newest item first — fall back to id when timestamps are missing.
    return [...itemsStore.all].sort((a, b) => {
        const ta = new Date(a.created_at || 0).getTime();
        const tb = new Date(b.created_at || 0).getTime();
        return tb - ta || b.id - a.id;
    })[0] || null;
});

const breakdown = computed(() =>
    itemsStore.categories.map((c) => ({
        ...c,
        percent: total.value ? Math.round((c.count / total.value) * 100) : 0,
    }))
);
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-6">
        <!-- Stat cards -->
        <div class="grid gap-5 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/5 bg-ink-850 p-6">
                <div class="flex items-start justify-between">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Top Category</p>
                    <span class="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>
                    </span>
                </div>
                <p class="mt-4 text-3xl font-bold text-white">{{ topCategory?.label || '—' }}</p>
                <p class="mt-1 font-mono text-sm text-slate-500">{{ topCategory ? `${topCategory.count} items` : 'No items yet' }}</p>
            </div>

            <div class="rounded-2xl border border-white/5 bg-ink-850 p-6">
                <div class="flex items-start justify-between">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Recently Added</p>
                    <span class="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-400">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                    </span>
                </div>
                <p class="mt-4 truncate text-3xl font-bold text-white">{{ recent?.name || '—' }}</p>
                <p class="mt-1 font-mono text-sm text-slate-500">{{ recent ? itemCode(recent.id) : 'No items yet' }}</p>
            </div>
        </div>

        <!-- Category breakdown -->
        <div class="rounded-2xl border border-white/5 bg-ink-850 p-6">
            <h2 class="text-base font-bold text-white">Category Breakdown</h2>

            <div v-if="breakdown.length" class="mt-5 space-y-5">
                <div v-for="c in breakdown" :key="c.label">
                    <div class="flex items-center justify-between text-sm">
                        <span class="flex items-center gap-2 font-medium text-slate-200">
                            <span class="h-2 w-2 rounded-full" :class="c.color.dot"></span>
                            {{ c.label }}
                        </span>
                        <span class="font-mono text-xs text-slate-500">{{ c.count }} items · {{ c.percent }}%</span>
                    </div>
                    <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div class="h-full rounded-full transition-all" :class="c.color.bar" :style="{ width: c.percent + '%' }"></div>
                    </div>
                </div>
            </div>
            <p v-else class="mt-4 text-sm text-slate-500">No categories yet — add your first item to get started.</p>
        </div>

        <!-- Quick actions -->
        <div class="rounded-2xl border border-white/5 bg-ink-850 p-6">
            <h2 class="text-base font-bold text-white">Quick Actions</h2>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                    class="flex items-center gap-3 rounded-xl bg-brand-500/10 px-4 py-4 text-left ring-1 ring-brand-500/20 transition hover:bg-brand-500/20"
                    @click="ui.openItemCreate()"
                >
                    <span class="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                    <span class="text-sm font-semibold text-brand-200">Add New Item</span>
                </button>
                <button
                    class="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-4 text-left ring-1 ring-white/10 transition hover:bg-white/10"
                    @click="ui.category = ''; ui.search = ''; router.push({ name: 'items' })"
                >
                    <span class="grid h-9 w-9 place-items-center rounded-lg bg-ink-700 text-slate-300">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    </span>
                    <span class="text-sm font-semibold text-slate-200">Browse All Items</span>
                </button>
            </div>
        </div>
    </div>
</template>
