import { reactive } from 'vue';

// Cross-component UI state for the app shell:
//  - search  : text typed in the top bar, consumed by the catalog page
//  - category: label selected from the sidebar, pre-filters the catalog
//  - sidebarOpen : mobile drawer visibility
//  - itemModal   : global add/edit item modal ({ open, id })
export const ui = reactive({
    search: '',
    category: '',
    sidebarOpen: false,
    itemModal: { open: false, id: null },

    openItemCreate() {
        this.itemModal = { open: true, id: null };
    },
    openItemEdit(id) {
        this.itemModal = { open: true, id };
    },
    closeItemModal() {
        this.itemModal = { open: false, id: null };
    },
});
