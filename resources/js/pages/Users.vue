<script setup>
import { ref, onMounted } from 'vue';
import { UsersApi } from '../api';
import { auth } from '../store/auth';
import { toast } from '../store/toast';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const users = ref([]);
const loading = ref(false);

async function load() {
    loading.value = true;
    try {
        const { data } = await UsersApi.list();
        users.value = data;
    } catch (e) {
        toast.error('Failed to load users.');
    } finally {
        loading.value = false;
    }
}

onMounted(load);

// ── Create / edit modal ──
const formOpen = ref(false);
const editing = ref(null);
const saving = ref(false);
const errors = ref({});
const form = ref({ name: '', email: '', password: '', is_admin: false });

function openCreate() {
    editing.value = null;
    form.value = { name: '', email: '', password: '', is_admin: false };
    errors.value = {};
    formOpen.value = true;
}

function openEdit(user) {
    editing.value = user;
    form.value = { name: user.name, email: user.email, password: '', is_admin: user.is_admin };
    errors.value = {};
    formOpen.value = true;
}

async function save() {
    saving.value = true;
    errors.value = {};
    try {
        if (editing.value) {
            await UsersApi.update(editing.value.id, form.value);
            toast.success('User updated.');
        } else {
            await UsersApi.create(form.value);
            toast.success('User created.');
        }
        formOpen.value = false;
        await load();
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {};
        } else {
            toast.error('Failed to save user.');
        }
    } finally {
        saving.value = false;
    }
}

// ── Delete ──
const confirmOpen = ref(false);
const deleting = ref(false);
const target = ref(null);

function askDelete(user) {
    target.value = user;
    confirmOpen.value = true;
}

async function doDelete() {
    deleting.value = true;
    try {
        await UsersApi.remove(target.value.id);
        toast.success('User deleted.');
        confirmOpen.value = false;
        await load();
    } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to delete user.');
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <div class="mx-auto max-w-4xl space-y-5">
        <div class="flex justify-end">
            <button
                class="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
                @click="openCreate"
            >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Add User
            </button>
        </div>

        <div class="overflow-hidden rounded-2xl border border-white/5 bg-ink-850">
            <div v-if="loading" class="px-6 py-16 text-center text-sm text-slate-500">Loading…</div>
            <table v-else class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th class="px-5 py-3.5">Name</th>
                        <th class="px-5 py-3.5">Email</th>
                        <th class="px-5 py-3.5">Role</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    <tr v-for="u in users" :key="u.id" class="group transition hover:bg-white/3">
                        <td class="px-5 py-4 font-semibold text-white">
                            {{ u.name }}
                            <span v-if="u.id === auth.user?.id" class="ml-1 text-xs font-normal text-slate-500">(you)</span>
                        </td>
                        <td class="px-5 py-4 text-slate-400">{{ u.email }}</td>
                        <td class="px-5 py-4">
                            <span
                                class="rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="u.is_admin ? 'bg-brand-500/15 text-brand-200 ring-1 ring-brand-500/25' : 'bg-white/5 text-slate-300 ring-1 ring-white/10'"
                            >
                                {{ u.is_admin ? 'Admin' : 'User' }}
                            </span>
                        </td>
                        <td class="px-5 py-4">
                            <div class="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                                <button class="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-brand-300" title="Edit" @click="openEdit(u)">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                </button>
                                <button
                                    v-if="u.id !== auth.user?.id"
                                    class="rounded-md p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                                    title="Delete"
                                    @click="askDelete(u)"
                                >
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Create / edit modal -->
        <transition name="fade">
            <div v-if="formOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" @click.self="formOpen = false">
                <div class="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/50">
                    <div class="border-b border-white/5 px-6 py-5">
                        <h3 class="text-lg font-bold text-white">{{ editing ? 'Edit User' : 'Add User' }}</h3>
                    </div>
                    <form class="space-y-4 px-6 py-6" @submit.prevent="save">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
                            <input v-model="form.name" type="text" class="ufield" :class="errors.name ? 'ufield-error' : ''" />
                            <p v-if="errors.name" class="mt-1 text-xs text-rose-400">{{ errors.name[0] }}</p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                            <input v-model="form.email" type="email" class="ufield" :class="errors.email ? 'ufield-error' : ''" />
                            <p v-if="errors.email" class="mt-1 text-xs text-rose-400">{{ errors.email[0] }}</p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-slate-300">
                                Password
                                <span v-if="editing" class="text-xs font-normal text-slate-500">(leave blank to keep current)</span>
                            </label>
                            <input v-model="form.password" type="password" autocomplete="new-password" class="ufield" :class="errors.password ? 'ufield-error' : ''" />
                            <p v-if="errors.password" class="mt-1 text-xs text-rose-400">{{ errors.password[0] }}</p>
                        </div>
                        <label class="flex items-center gap-2 text-sm text-slate-300">
                            <input v-model="form.is_admin" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-ink-800 text-brand-500 focus:ring-brand-500/40" />
                            Administrator
                        </label>

                        <div class="flex gap-3 pt-1">
                            <button
                                type="submit"
                                class="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400 disabled:opacity-60"
                                :disabled="saving"
                            >
                                {{ saving ? 'Saving…' : 'Save' }}
                            </button>
                            <button type="button" class="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5" @click="formOpen = false">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>

        <ConfirmDialog
            :open="confirmOpen"
            title="Delete user?"
            :message="target ? `Delete “${target.name}”? This cannot be undone.` : ''"
            confirm-text="Delete"
            :busy="deleting"
            @confirm="doDelete"
            @cancel="confirmOpen = false"
        />
    </div>
</template>

<style scoped>
.ufield {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid rgb(255 255 255 / 0.1);
    background-color: var(--color-ink-800);
    padding: 0.6rem 0.85rem;
    font-size: 0.875rem;
    color: var(--color-slate-100);
    outline: none;
    transition: all 0.15s ease;
}
.ufield:focus {
    border-color: rgb(99 102 241 / 0.6);
    box-shadow: 0 0 0 3px rgb(99 102 241 / 0.15);
}
.ufield-error {
    border-color: rgb(244 63 94 / 0.6);
}
</style>
