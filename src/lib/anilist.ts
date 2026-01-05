import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://graphql.anilist.co', {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const MANGA_SEARCH_QUERY = `
  query ($search: String, $genres: [String], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: MANGA,
        genre_in: $genres,
        search: $search,
        sort: [POPULARITY_DESC, SCORE_DESC],
        isAdult: false
      ) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        description
        genres
        averageScore
        popularity
        status
        startDate {
          year
        }
      }
    }
  }
`;

const MANGA_INFO_QUERY = `
  query ($search: String) {
    Media(type: MANGA, search: $search) {
      id
      description
      averageScore
      genres
      status
      startDate {
        year
      }
      coverImage {
        large
      }
    }
  }
`;

const GENRES_QUERY = `
  {
    GenreCollection
  }
`;

const DEFAULT_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithDelay = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retryWithDelay(fn, retries - 1, delay * 1.5);
  }
};

export const anilist = {
  searchManga: async (search?: string, genre?: string, page: number = 1) => {
    try {
      const variables = {
        page,
        perPage: 24,
        search: search || undefined,
        genres: genre ? [genre] : undefined
      };

      const data = await retryWithDelay(
        () => client.request(MANGA_SEARCH_QUERY, variables),
        3,
        1000
      );
      
      const results = data.Page.media.map((manga: any) => ({
        anime_name: manga.title.english || manga.title.romaji,
        image_src: manga.coverImage.large || manga.coverImage.medium,
        source_id: `anilist-${manga.id}`,
        description: manga.description,
        genres: manga.genres,
        score: manga.averageScore,
        popularity: manga.popularity,
        status: manga.status,
        year: manga.startDate.year
      }));

      return {
        results,
        pageInfo: data.Page.pageInfo
      };
    } catch (error) {
      console.error('Error fetching manga:', error);
      return { 
        results: [], 
        pageInfo: {
          hasNextPage: false,
          currentPage: page,
          lastPage: page,
          total: 0
        }
      };
    }
  },

  getMangaInfo: async (title: string) => {
    try {
      const variables = {
        search: title
      };

      const data = await retryWithDelay(
        () => client.request(MANGA_INFO_QUERY, variables),
        3,
        1000
      );

      if (!data.Media) {
        return null;
      }

      return {
        description: data.Media.description,
        averageScore: data.Media.averageScore,
        genres: data.Media.genres,
        status: data.Media.status,
        startDate: data.Media.startDate,
        coverImage: data.Media.coverImage
      };
    } catch (error) {
      console.error('Error fetching manga info:', error);
      return null;
    }
  },

  getGenres: async () => {
    try {
      const data = await retryWithDelay(
        () => client.request(GENRES_QUERY),
        3,
        1000
      );
      return data.GenreCollection;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return DEFAULT_GENRES;
    }
  }
};