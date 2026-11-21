import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import TopNav from '../../components/TopNav.vue';
import { RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest';

describe('TopNav.vue', () => {
    const mockLogout = vi.fn(() => Promise.resolve());
    const mockRouterPush = vi.fn();

    const setup = (role = 'staff') => {
        //Create a mock Store
        const store = createStore({
            getters: {
                UserRole: () => role,
            },
            actions: {
                logout: mockLogout,
            },
        });

        //Create the TopNav
        return mount(TopNav, {
            global: {
                plugins: [store],
                mocks: {
                    $router: { push: mockRouterPush },
                },
                stubs: {
                    RouterLink: RouterLinkStub
                },
            },
        });
    };

    //Check that all the links are visible
    it('renders main nav links', () => {
        const wrapper = setup();

        const links = wrapper.findAllComponents(RouterLinkStub);
        const routes = links.map(link => link.props('to'));

        expect(routes).toEqual([
            '/dashboard',
            '/events',
            '/activities',
            '/applicants',
            '/teams',
            '/hardware',
            '/sponsors',
            '/prizes'
        ]);
    });

    //Audit logs should only show up for the 'oscar' role
    it('renders Audit Logs link only for oscar', () => {
        const wrapperStaff = setup('staff');
        const staffRoutes = wrapperStaff
            .findAllComponents(RouterLinkStub)
            .map(link => link.props('to'));

        expect(staffRoutes).not.toContain('/audit-logs');

        const wrapperOscar = setup('oscar');
        const oscarRoutes = wrapperOscar
            .findAllComponents(RouterLinkStub)
            .map(link => link.props('to'));

        expect(oscarRoutes).toContain('/audit-logs');
    });

    //Press the logout button and check that the router navigated to /login
    it('calls logout and navigates on Logout button click', async () => {
        const wrapper = setup();
        await wrapper.find('button.logout').trigger('click');

        expect(mockLogout).toHaveBeenCalled();
        // Wait for next tick since logout is async
        await wrapper.vm.$nextTick();
        expect(mockRouterPush).toHaveBeenCalledWith('/login');
    });

    //The hamburger opens and closes the link panel
    it('toggles the panel with the hamburger', async () => {
        const wrapper = setup();
        expect(wrapper.find('.nav-panel').classes()).not.toContain('open');

        await wrapper.find('button.hamburger').trigger('click');
        expect(wrapper.find('.nav-panel').classes()).toContain('open');

        await wrapper.find('button.hamburger').trigger('click');
        expect(wrapper.find('.nav-panel').classes()).not.toContain('open');
    });

    //Picking a page should close the panel so it doesn't cover the new page
    it('closes the panel when a link is clicked', async () => {
        const wrapper = setup();
        await wrapper.find('button.hamburger').trigger('click');

        await wrapper.find('.nav-links a').trigger('click');
        expect(wrapper.find('.nav-panel').classes()).not.toContain('open');
    });

    it('closes the panel and the Menu when clicking outside the navbar', async () => {
        const wrapper = setup();
        await wrapper.find('button.hamburger').trigger('click');
        await wrapper.find('button.menu-button').trigger('click');

        document.body.click();
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.nav-panel').classes()).not.toContain('open');
        expect(wrapper.find('.nav-menu').classes()).not.toContain('open');
        wrapper.unmount();
    });
});