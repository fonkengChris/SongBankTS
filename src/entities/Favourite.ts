export interface Favourite {
  _id: string;
  user: string;
  song: Song;
  createdAt: string;
}

export interface Song {
  _id: string;
  title: string;
  slug: string;
  authorName: string;
  description: string;
  lastUpdate: string;
  likesCount: number;
  lyrics: string;
  metacritic: number;
  views: number;
  favouritesCount: number;
  language: {
    _id: string;
    name: string;
    code: string;
  };
  category: {
    _id: string;
    title: string;
  };
  mediaFiles: MediaFile[];
  price: number;
  youtubeUrl?: string;
  trendingScore: number;
  tags: string[];
}

export interface MediaFile {
  _id: string;
  name: string;
  song: Song;
  notation: {
    _id: string;
    title: string;
    slug: string;
  };
  previewImage: string;
  documentFile: string;
  audioFile: string;
}

export interface FavouriteResponse {
  songs: Song[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

export interface FavouriteStatus {
  isFavourited: boolean;
  songId: string;
  favouritesCount: number;
}
