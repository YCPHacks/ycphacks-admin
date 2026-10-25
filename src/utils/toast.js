import store from '@/store/store.js';

// Show a toast from anywhere: toast.success('Saved'), toast.error(result.message), etc.
// Vuex actions should call dispatch('toasts/notify', ...) instead, since store.js can't import this file.
const show = (type) => (message, timeout) =>
    store.dispatch('toasts/notify', { type, message, timeout });

export const toast = {
    success: show('success'),
    error: show('error'),
    info: show('info'),
    warning: show('warning')
};
