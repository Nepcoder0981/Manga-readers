import axios from 'axios';
import type { ApiResponse, Chapter, MangaPage, MangaResult } from '../types/manga';

// Use relative URLs that will be handled by Cloudflare Pages routing
const BASE_URL = '/api';
const IMAGE_PROXY_URL = '/image-proxy';

export const api = {
  getRecentlyAdded: async (page: number = 1) => {
    const responses = await Promise.all([1, 2, 3, 4, 5].map(pageNum => 
      axios.get<ApiResponse<MangaResult>>(`${BASE_URL}/recently-added?page=${pageNum}`)
    ));
    const allResults = responses.flatMap(response => response.data.results);
    return { results: allResults };
  },

  getHotSeries: async () => {
    const response = await axios.get<ApiResponse<MangaResult>>(`${BASE_URL}/hot-series`);
    return response.data;
  },

  searchManga: async (query: string) => {
    const response = await axios.get<ApiResponse<MangaResult>>(`${BASE_URL}/search?text=${encodeURIComponent(query)}`);
    return response.data;
  },

  getChapters: async (sourceId: string) => {
    const response = await axios.get<Chapter[]>(`${BASE_URL}/chapter?id=${sourceId}`);
    return response.data;
  },

  getPages: async (chapterId: string) => {
    const response = await axios.get<MangaPage[]>(`${BASE_URL}/images?id=${chapterId}`);
    // Add proxy URL to each page
    const pagesWithProxy = response.data.map(page => ({
      ...page,
      url: `${IMAGE_PROXY_URL}/?imageurl=${encodeURIComponent(page.url)}`
    }));
    return pagesWithProxy;
  },

  proxyImage: (imageUrl: string) => {
    return `${IMAGE_PROXY_URL}/?imageurl=${encodeURIComponent(imageUrl)}`;
  }
};