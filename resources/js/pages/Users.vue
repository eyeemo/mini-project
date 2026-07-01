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
    <div>
        <div class="flex items-center justify-between gap-4 mb-5">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Users</h1>
                <p class="text-sm text-slate-500">Manage who can access the system.</p>
            </div>
            <button
                class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                @click="openCreate"
            >
                <span class="text-lg leading-none">+</span> Add user
            </button>
        </div>

        <div v-if="loading" class="text-center py-12 text-slate-400 text-sm">Loading…</div>

        <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-sm">
                <thead class="bg-slate-50 text-left text-slate-500">
                    <tr>
                        <th class="px-4 py-3 font-medium">Name</th>
                        <th class="px-4 py-3 font-medium">Email</th>
                        <th class="px-4 py-3 font-medium">Role</th>
                        <th class="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50">
                        <td class="px-4 py-3 font-medium text-slate-800">
                            {{ u.name }}
                            <span v-if="u.id === auth.user?.id" class="ml-1 text-xs text-slate-400">(you)</span>
                        </td>
                        <td class="px-4 py-3 text-slate-600">{{ u.email }}</td>
                        <td class="px-4 py-3">
                            <span
                                class="rounded-full px-2 py-0.5 text-xs font-medium"
                                :class="u.is_admin ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'"
                            >
                                {{ u.is_admin ? 'Admin' : 'User' }}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex justify-end gap-1">
                                <button class="rounded-md p-1.5 text-amber-600 hover:bg-amber-50" title="Edit" @click="openEdit(u)">✎</button>
                                <button
                                    v-if="u.id !== auth.user?.id"
                                    class="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"
                                    title="Delete"
                                    @click="askDelete(u)"
                                >🗑</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Create / edit modal -->
        <transition name="fade">
            <div v-if="formOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4" @click.self="formOpen = false">
                <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                    <h3 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit user' : 'Add user' }}</h3>
                    <form class="mt-4 space-y-4" @submit.prevent="save">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                v-model="form.name"
                                type="text"
                                class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                :class="errors.name ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                            />
                            <p v-if="errors.name" class="mt-1 text-xs text-rose-600">{{ errors.name[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                v-model="form.email"
                                type="email"
                                class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                :class="errors.email ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                            />
                            <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">
                                Password
                                <span v-if="editing" class="text-xs font-normal text-slate-400">(leave blank to keep current)</span>
                            </label>
                            <input
                                v-model="form.password"
                                type="password"
                                autocomplete="new-password"
                                class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                :class="errors.password ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                            />
                            <p v-if="errors.password" class="mt-1 text-xs text-rose-600">{{ errors.password[0] }}</p>
                        </div>
                        <label class="flex items-center gap-2 text-sm text-slate-700">
                            <input v-model="form.is_admin" type="checkbox" class="rounded border-slate-300" />
                            Administrator
                        </label>

                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" @click="formOpen = false">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                :disabled="saving"
                            >
                                {{ saving ? 'Saving…' : 'Save' }}
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
