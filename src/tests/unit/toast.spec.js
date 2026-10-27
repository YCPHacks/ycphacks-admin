import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createStore } from 'vuex';
import toasts from '@/store/toasts.js';
import ToastContainer from '@/components/ToastContainer.vue';

// Swap the app store for one with only the toasts module, so the toast helper uses it
const testStore = vi.hoisted(() => ({ current: null }));
vi.mock('@/store/store.js', () => ({
    default: { dispatch: (...args) => testStore.current.dispatch(...args) }
}));

import { toast } from '@/utils/toast.js';

describe('Toast notifications (toasts module, toast helper, ToastContainer)', () => {
    let wrapper;

    beforeEach(() => {
        vi.useFakeTimers();
        testStore.current = createStore({ modules: { toasts } });
        wrapper = mount(ToastContainer, {
            global: { plugins: [testStore.current] },
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it.each(['success', 'error', 'info', 'warning'])('toast.%s() shows a toast with its message', async (type) => {
        toast[type](`A ${type} message`);
        await nextTick();

        const shown = wrapper.findAll('.app-toast');
        expect(shown).toHaveLength(1);
        expect(shown[0].text()).toContain(`A ${type} message`);
    });

    it('dismisses the toast after its timeout', async () => {
        toast.success('Saved', 3000);
        await nextTick();
        expect(wrapper.findAll('.app-toast')).toHaveLength(1);

        vi.advanceTimersByTime(3000);
        await nextTick();
        expect(testStore.current.getters['toasts/getToasts']).toHaveLength(0);
    });

    it('uses a longer default timeout for errors', async () => {
        toast.success('Saved');
        toast.error('Failed');
        vi.advanceTimersByTime(5000);
        await nextTick();

        const remaining = testStore.current.getters['toasts/getToasts'];
        expect(remaining).toHaveLength(1);
        expect(remaining[0].type).toBe('error');

        vi.advanceTimersByTime(3000);
        expect(testStore.current.getters['toasts/getToasts']).toHaveLength(0);
    });

    it('removes a toast when it is clicked', async () => {
        toast.info('Click me');
        await nextTick();

        await wrapper.find('.app-toast').trigger('click');
        expect(testStore.current.getters['toasts/getToasts']).toHaveLength(0);
    });

    it('keeps at most 5 toasts, dropping the oldest', async () => {
        for (let i = 1; i <= 6; i++) toast.info(`Toast ${i}`);

        const messages = testStore.current.getters['toasts/getToasts'].map(t => t.message);
        expect(messages).toHaveLength(5);
        expect(messages[0]).toBe('Toast 2');
    });

    it('marks error toasts as alerts for screen readers', async () => {
        toast.error('Failed');
        await nextTick();

        expect(wrapper.find('.app-toast').attributes('role')).toBe('alert');
    });
});
