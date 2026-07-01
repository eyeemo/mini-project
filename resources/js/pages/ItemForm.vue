<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ItemsApi } from '../api';
import { toast } from '../store/toast';

const props = defineProps({
    id: { type: [String, Number], default: null },
});

const router = useRouter();
const isEdit = computed(() => props.id != null);

const form = ref({ name: '', specification: '', label: '' });
const errors = ref({});
const saving = ref(false);
const loading = ref(false);

onMounted(async () => {
    if (!isEdit.value) return;
    loading.value = true;
    try {
        const { data } = await ItemsApi.get(props.id);
        form.value = {
            name: data.name ?? '',
            specification: data.specification ?? '',
            label: data.label ?? '',
        };
    } catch (e) {
        toast.error('Item not found.');
        router.replace({ name: 'dashboard' });
    } finally {
        loading.value = false;
    }
});

async function save() {
    saving.value = true;
    errors.value = {};
    try {
        if (isEdit.value) {
            await ItemsApi.update(props.id, form.value);
            toast.success('Changes saved.');
            router.push({ name: 'items.show', params: { id: props.id } });
        } else {
            const { data } = await ItemsApi.create(form.value);
            toast.success('Item created.');
            router.push({ name: 'items.show', params: { id: data.id } });
        }
    } catch (e) {
        // Validate input -> Invalid -> Show error
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
    <div class="max-w-xl mx-auto">
        <RouterLink to="/" class="text-sm text-slate-500 hover:text-slate-700">← Back to dashboard</RouterLink>

        <h1 class="mt-3 text-2xl font-semibold text-slate-900">
            {{ isEdit ? 'Edit item' : 'Add item' }}
        </h1>
        <p class="text-sm text-slate-500 mb-6">
            {{ isEdit ? 'Update the details below and save your changes.' : 'Fill in the item details below.' }}
        </p>

        <div v-if="loading" class="text-slate-400 text-sm">Loading…</div>

        <form v-else class="space-y-5 rounded-xl border border-slate-200 bg-white p-6" @submit.prevent="save">
            <!-- Name — item identifier -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                    Name <span class="text-rose-500">*</span>
                </label>
                <input
                    v-model="form.name"
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                    :class="errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'"
                    placeholder="e.g. Dell Latitude 5440"
                />
                <p v-if="errors.name" class="mt-1 text-xs text-rose-600">{{ errors.name[0] }}</p>
            </div>

            <!-- Specification — details / attributes -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Specification</label>
                <textarea
                    v-model="form.specification"
                    rows="4"
                    class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                    :class="errors.specification ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                    placeholder="Details and attributes…"
                ></textarea>
                <p v-if="errors.specification" class="mt-1 text-xs text-rose-600">{{ errors.specification[0] }}</p>
            </div>

            <!-- Label / category — grouping tag -->
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Label / category</label>
                <input
                    v-model="form.label"
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                    :class="errors.label ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                    placeholder="e.g. Laptop"
                />
                <p v-if="errors.label" class="mt-1 text-xs text-rose-600">{{ errors.label[0] }}</p>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <RouterLink to="/" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                    Cancel
                </RouterLink>
                <button
                    type="submit"
                    class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    :disabled="saving"
                >
                    {{ saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save item' }}
                </button>
            </div>
        </form>
    </div>
</template>
