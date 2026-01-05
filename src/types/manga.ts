import { z } from 'zod';

export interface MangaResult {
  anime_name: string;
  image_src: string;
  source_id: string;
}

export interface Chapter {
  chapter_number: string;
  chapter_id: string;
  chapter_name: string;
}

export interface MangaPage {
  page: number;
  url: string;
}

export interface ApiResponse<T> {
  results: T[];
}

export interface RecentlyViewed {
  id: string;
  title: string;
  coverImage: string;
  lastViewed: number;
  lastChapter?: string;
}

export const categorySchema = z.enum([
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller'
]);

export type Category = z.infer<typeof categorySchema>;