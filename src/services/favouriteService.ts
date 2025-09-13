import APIClient, { axiosInstance } from "./api-client";
import { Favourite, FavouriteResponse, FavouriteStatus } from "../entities/Favourite";

class FavouriteService {
  private apiClient: APIClient<Favourite>;

  constructor() {
    this.apiClient = new APIClient<Favourite>("/api/favourites");
  }

  async addFavourite(songId: string) {
    return this.apiClient.post({ song: songId });
  }

  async removeFavourite(songId: string) {
    return this.apiClient.delete(songId);
  }

  async getFavouriteStatus(songId: string): Promise<FavouriteStatus> {
    const response = await this.apiClient.get<FavouriteStatus>(songId);
    return response;
  }

  async getFavourites(page: number = 1, limit: number = 50, includeMediaFiles: boolean = false): Promise<FavouriteResponse> {
    const response = await axiosInstance.get<FavouriteResponse>(`/api/favourites/user/favourited?page=${page}&limit=${limit}&includeMediaFiles=${includeMediaFiles}`);
    return response.data;
  }

  async getFavouriteCount(songId: string) {
    const response = await axiosInstance.get(`/api/favourites/song/${songId}/count`);
    return response.data;
  }
}

export default new FavouriteService();
