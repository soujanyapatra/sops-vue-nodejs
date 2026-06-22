// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeView from './HomeView.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const vuetify = createVuetify({
  components,
  directives,
});

describe('HomeView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders blogs and secret metadata successfully', async () => {
    const mockBlogsResponse = {
      data: {
        blogs: [
          {
            id: 1,
            title: 'Dynamic Test Blog Post Title',
            description: 'This is a test description of a blog post.',
            cover_image: 'https://example.com/cover.jpg',
            tags: ['testing', 'vitest'],
            author: 'Test Author',
            published_at: 'June 22, 2026',
            read_time: '3 min read'
          }
        ],
        keyLoaded: true,
        fetchedFrom: 'Secure Test Service'
      }
    };
    (axios.get as any).mockResolvedValue(mockBlogsResponse);

    const wrapper = mount(HomeView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Wait for network response and updates
    await new Promise((resolve) => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text).toContain('Dynamic Test Blog Post Title');
    expect(text).toContain('This is a test description of a blog post.');
    expect(text).toContain('Test Author');
    expect(text).toContain('Yes (Backend Only)');
    expect(text).toContain('Secure Test Service');
  });

  it('renders connection error alert when backend request fails', async () => {
    (axios.get as any).mockRejectedValue(new Error('Connection failed'));

    const wrapper = mount(HomeView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Wait for network response and updates
    await new Promise((resolve) => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text).toContain('Failed to Load Blog Feed');
  });
});
