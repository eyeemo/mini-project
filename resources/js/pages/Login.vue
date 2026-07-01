<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { auth } from '../store/auth';
import { toast } from '../store/toast';

const router = useRouter();
const route = useRoute();

const form = ref({ email: 'admin@example.com', password: 'password', remember: true });
const errors = ref({});
const submitting = ref(false);

async function submit() {
    submitting.value = true;
    errors.value = {};
    try {
        await auth.login(form.value);
        toast.success('Welcome back!');
        router.replace(route.query.redirect || { name: 'dashboard' });
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {};
        } else {
            toast.error('Login failed. Please try again.');
        }
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <div class="min-h-[70vh] flex items-center justify-center">
        <div class="w-full max-w-sm">
            <div class="text-center mb-6">
                <span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-2xl text-white">📦</span>
                <h1 class="mt-3 text-xl font-semibold text-slate-900">Sign in to Item Manager</h1>
                <p class="text-sm text-slate-500">Enter your credentials to continue.</p>
            </div>

            <form class="space-y-4 rounded-xl border border-slate-200 bg-white p-6" @submit.prevent="submit">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        v-model="form.email"
                        type="email"
                        autocomplete="username"
                        class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                        :class="errors.email ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                    />
                    <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email[0] }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        v-model="form.password"
                        type="password"
                        autocomplete="current-password"
                        class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                        :class="errors.password ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                    />
                    <p v-if="errors.password" class="mt-1 text-xs text-rose-600">{{ errors.password[0] }}</p>
                </div>

                <label class="flex items-center gap-2 text-sm text-slate-600">
                    <input v-model="form.remember" type="checkbox" class="rounded border-slate-300" />
                    Remember me
                </label>

                <button
                    type="submit"
                    class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    :disabled="submitting"
                >
                    {{ submitting ? 'Signing in…' : 'Sign in' }}
                </button>

                <p class="text-center text-sm text-slate-500">
                    No account?
                    <RouterLink to="/register" class="font-medium text-indigo-600 hover:underline">Create one</RouterLink>
                </p>

                <p class="text-center text-xs text-slate-400">
                    Demo: <span class="font-medium">admin@example.com</span> / <span class="font-medium">password</span>
                </p>
            </form>
        </div>
    </div>
</template>
