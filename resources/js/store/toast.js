import { reactive } from 'vue';

// Tiny global toast store (Success toast / Deleted toast / error nodes in the flow).
let id = 0;

export const toastState = reactive({
    items: [],
});

export function pushToast(message, type = 'success') {
    const toast = { id: ++id, message, type };
    toastState.items.push(toast);
    setTimeout(() => dismissToast(toast.id), 3200);
}

export function dismissToast(toastId) {
    const idx = toastState.items.findIndex((t) => t.id === toastId);
    if (idx !== -1) toastState.items.splice(idx, 1);
}

export const toast = {
    success: (m) => pushToast(m, 'success'),
    error: (m) => pushToast(m, 'error'),
    info: (m) => pushToast(m, 'info'),
};
