// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SecretStatusView from './SecretStatusView.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock ResizeObserver which is used by Vuetify but not present in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const vuetify = createVuetify({
  components,
  directives,
});

describe('SecretStatusView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders API data correctly after successful fetch', async () => {
    const mockResponse = {
      data: {
        secretLoaded: true,
        environment: 'staging',
        buildVersion: '2.5.4',
        deploymentTime: '2026-06-22T12:00:00Z',
      }
    };
    (axios.get as any).mockResolvedValue(mockResponse);

    const wrapper = mount(SecretStatusView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Wait for the axios request and Vue rendering updates
    await new Promise((resolve) => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text).toContain('Yes (Encrypted & Loaded)');
    expect(text).toContain('staging');
    expect(text).toContain('v2.5.4');
  });

  it('renders error message when backend connection fails', async () => {
    (axios.get as any).mockRejectedValue(new Error('Connection refused'));

    const wrapper = mount(SecretStatusView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Wait for request and rendering updates
    await new Promise((resolve) => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text).toContain('Backend Connection Error');
  });
});
