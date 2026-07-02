// Deterministic colour assignment for item labels/categories.
// Each distinct label always maps to the same swatch so the sidebar,
// dashboard breakdown and catalog badges stay visually consistent.

const PALETTE = [
    { key: 'violet', dot: 'bg-violet-500', text: 'text-violet-300', bar: 'bg-violet-500', badge: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25' },
    { key: 'amber', dot: 'bg-amber-500', text: 'text-amber-300', bar: 'bg-amber-500', badge: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25' },
    { key: 'emerald', dot: 'bg-emerald-500', text: 'text-emerald-300', bar: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25' },
    { key: 'rose', dot: 'bg-rose-500', text: 'text-rose-300', bar: 'bg-rose-500', badge: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/25' },
    { key: 'sky', dot: 'bg-sky-500', text: 'text-sky-300', bar: 'bg-sky-500', badge: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25' },
    { key: 'orange', dot: 'bg-orange-500', text: 'text-orange-300', bar: 'bg-orange-500', badge: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/25' },
    { key: 'teal', dot: 'bg-teal-500', text: 'text-teal-300', bar: 'bg-teal-500', badge: 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/25' },
    { key: 'fuchsia', dot: 'bg-fuchsia-500', text: 'text-fuchsia-300', bar: 'bg-fuchsia-500', badge: 'bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/25' },
];

const NEUTRAL = { key: 'slate', dot: 'bg-slate-500', text: 'text-slate-300', bar: 'bg-slate-500', badge: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/25' };

function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

export function categoryColor(label) {
    if (!label) return NEUTRAL;
    return PALETTE[hash(label) % PALETTE.length];
}
