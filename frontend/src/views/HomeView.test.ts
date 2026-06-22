// @vitest-environment happy-dom
import HomeView from './HomeView.vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    const mockNewsResponse = {
      data: {
        articles: [
          {
            id: 'news-id-1',
            title: 'Dynamic Test News Article Title',
            description: 'This is a test description of a news article.',
            content: 'Full content of news article.',
            url: 'https://example.com/test',
            image: 'https://example.com/image.jpg',
            source: 'Test Source',
            author: 'Test Writer',
            published_at: '2026-06-22T10:00:00Z',
            category: 'World'
          }
        ],
        fetchedFrom: 'Mock news proxy service',
        secretLoaded: true
      }
    };
    (axios.get as any).mockResolvedValue(mockNewsResponse);

    const wrapper = mount(HomeView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Wait for network response and updates
    await new Promise((resolve) => setTimeout(resolve, 80));
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text).toContain('Dynamic Test News Article Title');
    expect(text).toContain('This is a test description of a news article.');
    expect(text).toContain('Test Writer');
  });

  it('renders connection error alert when backend request fails', async () => {
    (axios.get as any).mockRejectedValue(new Error('Connection failed'));

    const wrapper = mount(HomeView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Wait for network response and updates
    await new Promise((resolve) => setTimeout(resolve, 80));
    await wrapper.vm.$nextTick();

    const text = wrapper.text();
    expect(text).toContain('News Retrieval Error');
  });
});
