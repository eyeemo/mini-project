// Human-friendly item code shown across the UI, e.g. 1 -> "ITM-001".
export function itemCode(id) {
    if (id == null) return 'ITM-—';
    return `ITM-${String(id).padStart(3, '0')}`;
}

export function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString();
}
