// Vuex module for toast notifications. Pages should use utils/toast.js instead of dispatching directly.
const DEFAULT_TIMEOUT = 5000;
const ERROR_TIMEOUT = 8000;
const MAX_TOASTS = 5;

let nextId = 1;

export default {
    namespaced: true,
    state: () => ({
        toasts: []
    }),
    getters: {
        getToasts: (state) => state.toasts
    },
    mutations: {
        ADD_TOAST(state, toast) {
            state.toasts.push(toast);
        },
        REMOVE_TOAST(state, id) {
            state.toasts = state.toasts.filter(t => t.id !== id);
        }
    },
    actions: {
        notify({ commit, dispatch, state }, { type = 'info', message, timeout }) {
            const id = nextId++;
            commit('ADD_TOAST', { id, type, message });

            // Drop the oldest toasts so the stack doesn't cover the page
            while (state.toasts.length > MAX_TOASTS) {
                commit('REMOVE_TOAST', state.toasts[0].id);
            }

            const duration = timeout ?? (type === 'error' ? ERROR_TIMEOUT : DEFAULT_TIMEOUT);
            setTimeout(() => dispatch('dismiss', id), duration);

            return id;
        },
        dismiss({ commit }, id) {
            // No-op if the toast was already clicked away
            commit('REMOVE_TOAST', id);
        }
    }
};
