import store from '@/store/store.js';

// Show a toast from anywhere: toast.success('Saved'), toast.error(result.message), etc.
// Vuex actions should call dispatch('toasts/notify', ...) instead, since store.js can't import this file.
const show = (type, always = false) => (message, timeout) =>
    store.dispatch('toasts/notify', { type, message, timeout, always });

export const toast = {
    success: show('success'),
    error: show('error'),
    info: show('info'),
    warning: show('warning'),
    // For feedback staff can't work without, even with toasts turned off
    always: {
        success: show('success', true),
        warning: show('warning', true)
    }
};
