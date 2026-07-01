<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../store/auth';
import { toast } from '../store/toast';

const router = useRouter();

const form = ref({ name: '', email: '', password: '', password_confirmation: '' });
const errors = ref({});
const submitting = ref(false);

async function submit() {
    submitting.value = true;
    errors.value = {};
    try {
        await auth.register(form.value);
        toast.success('Account created. Welcome!');
        router.replace({ name: 'dashboard' });
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {};
        } else {
            toast.error('Registration failed. Please try again.');
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
                <h1 class="mt-3 text-xl font-semibold text-slate-900">Create your account</h1>
                <p class="text-sm text-slate-500">Sign up to start managing items.</p>
            </div>

            <form class="space-y-4 rounded-xl border border-slate-200 bg-white p-6" @submit.prevent="submit">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                        v-model="form.name"
                        type="text"
                        autocomplete="name"
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
                        autocomplete="new-password"
                        class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                        :class="errors.password ? 'border-rose-400' : 'border-slate-300 focus:border-indigo-500'"
                    />
                    <p v-if="errors.password" class="mt-1 text-xs text-rose-600">{{ errors.password[0] }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
                    <input
                        v-model="form.password_confirmation"
                        type="password"
                        autocomplete="new-password"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <button
                    type="submit"
                    class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    :disabled="submitting"
                >
                    {{ submitting ? 'Creating…' : 'Create account' }}
                </button>

                <p class="text-center text-sm text-slate-500">
                    Already have an account?
                    <RouterLink to="/login" class="font-medium text-indigo-600 hover:underline">Sign in</RouterLink>
                </p>
            </form>
        </div>
    </div>
</template>
