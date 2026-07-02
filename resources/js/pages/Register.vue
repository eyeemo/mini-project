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
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        <div class="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"></div>

        <div class="relative w-full max-w-sm">
            <div class="mb-6 text-center">
                <span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 shadow-lg shadow-brand-500/30">
                    <svg class="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                </span>
                <h1 class="mt-4 text-xl font-bold text-white">Create your account</h1>
                <p class="text-sm text-slate-500">Sign up to start managing inventory.</p>
            </div>

            <form class="space-y-4 rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-xl shadow-black/30" @submit.prevent="submit">
                <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
                    <input v-model="form.name" type="text" autocomplete="name" class="auth-field" :class="errors.name ? 'auth-field-error' : ''" />
                    <p v-if="errors.name" class="mt-1 text-xs text-rose-400">{{ errors.name[0] }}</p>
                </div>

                <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                    <input v-model="form.email" type="email" autocomplete="username" class="auth-field" :class="errors.email ? 'auth-field-error' : ''" />
                    <p v-if="errors.email" class="mt-1 text-xs text-rose-400">{{ errors.email[0] }}</p>
                </div>

                <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
                    <input v-model="form.password" type="password" autocomplete="new-password" class="auth-field" :class="errors.password ? 'auth-field-error' : ''" />
                    <p v-if="errors.password" class="mt-1 text-xs text-rose-400">{{ errors.password[0] }}</p>
                </div>

                <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-300">Confirm password</label>
                    <input v-model="form.password_confirmation" type="password" autocomplete="new-password" class="auth-field" />
                </div>

                <button
                    type="submit"
                    class="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400 disabled:opacity-60"
                    :disabled="submitting"
                >
                    {{ submitting ? 'Creating…' : 'Create account' }}
                </button>

                <p class="text-center text-sm text-slate-500">
                    Already have an account?
                    <RouterLink to="/login" class="font-medium text-brand-400 hover:underline">Sign in</RouterLink>
                </p>
            </form>
        </div>
    </div>
</template>

<style scoped>
.auth-field {
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
.auth-field:focus {
    border-color: rgb(99 102 241 / 0.6);
    box-shadow: 0 0 0 3px rgb(99 102 241 / 0.15);
}
.auth-field-error {
    border-color: rgb(244 63 94 / 0.6);
}
</style>
