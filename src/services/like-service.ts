import { axiosInstance } from "./api-client";
import { LIKES_ENDPOINT, SONGS_ENDPOINT } from "../data/constants";

export interface LikeStatus {
  isLiked: boolean;
  songId: string;
  likesCount: number;
}

export interface LikedSong {
  _id: string;
  title: string;
  slug: string;
  authorName: string;
  likesCount: number;
  views: number;
  language: { name: string; code: string };
  category: { title: string };
  likedAt: string;
  mediaFiles: MediaFile[];
}

export interface MediaFile {
  _id: string;
  song: string;
  name: string;
  notation: {
    _id: string;
    title: string;
  };
  documentFile: string;
  audioFile: string;
  previewImage: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

export interface LikedSongsResponse {
  songs: LikedSong[];
  pagination: Pagination;
}

export interface LikeResponse {
  message: string;
  like: {
    _id: string;
    user: any;
    song: any;
    createdAt: string;
  };
}

export interface UnlikeResponse {
  message: string;
  songId: string;
}

export interface LikeCountResponse {
  songId: string;
  likesCount: number;
}

export interface SongWithLikeStatus {
  _id: string;
  title: string;
  slug: string;
  authorName: string;
  description: string;
  lastUpdate: string;
  lyrics: string;
  language: any;
  category: any;
  mediaFiles: any[];
  price: number;
  youtubeUrl: string;
  likesCount: number;
  views: number;
  isLiked: boolean;
}

class LikeService {
  // Like a song
  async likeSong(songId: string): Promise<LikeResponse> {
    if (!songId || songId.trim() === "") {
      throw new Error("Invalid song ID");
    }
    const response = await axiosInstance.post(LIKES_ENDPOINT, {
      song: songId,
    });
    return response.data;
  }

  // Unlike a song
  async unlikeSong(songId: string): Promise<UnlikeResponse> {
    if (!songId || songId.trim() === "") {
      throw new Error("Invalid song ID");
    }
    const response = await axiosInstance.delete(`${LIKES_ENDPOINT}/${songId}`);
    return response.data;
  }

  // Check if user has liked a specific song
  async getLikeStatus(songId: string): Promise<LikeStatus> {
    if (!songId || songId.trim() === "") {
      throw new Error("Invalid song ID");
    }
    const response = await axiosInstance.get(`${LIKES_ENDPOINT}/${songId}`);
    return response.data;
  }

  // Get like count for a song
  async getLikeCount(songId: string): Promise<LikeCountResponse> {
    if (!songId || songId.trim() === "") {
      throw new Error("Invalid song ID");
    }
    const response = await axiosInstance.get(
      `${LIKES_ENDPOINT}/song/${songId}/count`
    );
    return response.data;
  }

  // Get all songs liked by the current user with media files
  async getLikedSongs(
    page: number = 1,
    limit: number = 10
  ): Promise<LikedSongsResponse> {
    const response = await axiosInstance.get(
      `${LIKES_ENDPOINT}/user/liked?page=${page}&limit=${limit}&includeMediaFiles=true`
    );
    return response.data;
  }

  // Get song with like status
  async getSongWithLikeStatus(songId: string): Promise<SongWithLikeStatus> {
    if (!songId || songId.trim() === "") {
      throw new Error("Invalid song ID");
    }
    const response = await axiosInstance.get(
      `${SONGS_ENDPOINT}/${songId}/with-like-status`
    );
    return response.data;
  }
}

export const likeService = new LikeService();
export default likeService;
