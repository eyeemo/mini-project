import { reactive } from 'vue';
import { ItemsApi } from '../api';
import { categoryColor } from '../lib/categories';

// Single source of truth for the item catalog. Loaded once, then reused by the
// sidebar (category counts), dashboard (stats) and catalog table (filtering).
export const itemsStore = reactive({
    all: [],
    loading: false,
    loaded: false,

    async load(force = false) {
        if (this.loaded && !force) return;
        this.loading = true;
        try {
            const { data } = await ItemsApi.list();
            this.all = Array.isArray(data) ? data : [];
            this.loaded = true;
        } finally {
            this.loading = false;
        }
    },

    invalidate() {
        this.loaded = false;
    },

    // Distinct categories with counts + colour, sorted by size (desc).
    get categories() {
        const counts = new Map();
        for (const item of this.all) {
            const label = item.label || 'Uncategorised';
            counts.set(label, (counts.get(label) || 0) + 1);
        }
        return [...counts.entries()]
            .map(([label, count]) => ({ label, count, color: categoryColor(label) }))
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    },
});
