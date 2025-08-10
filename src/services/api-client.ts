import axios, { AxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import { getValidToken } from "../utils/jwt-validator";

// Use the environment variable for the API URL, with fallback for development
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://sheet-music-library-ad225c202768.herokuapp.com");

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Log the API URL being used
console.log("🔧 API Client Configuration:");
console.log("   API_URL:", API_URL);
console.log("   VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("   DEV mode:", import.meta.env.DEV);

// Add request interceptor with logging
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    if (token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set("x-auth-token", token);
      config.headers = headers;
    }

    console.log("Request Config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor with logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error("Response Error:", {
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  songs?: T[];
  videos?: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

export default class APIClient<T, R = T> {
  constructor(public endpoint: string) {
    // Remove the /api prefix removal
  }

  getAllSongs = (config?: AxiosRequestConfig, queryParams?: string) => {
    const url = queryParams ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return axiosInstance
      .get<PaginatedResponse<T>>(url, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  };

  getAllSongsWithoutPagination = (config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<{ songs: T[] } | { videos: T[] } | T[]>(`${this.endpoint}/all`, config)
      .then((res) => {
        // If the response is an object with a songs or videos property, return that, else return the array directly
        if (Array.isArray(res.data)) return res.data;
        if ('songs' in res.data) return res.data.songs;
        if ('videos' in res.data) return res.data.videos;
        return [];
      })
      .catch((error) => {
        console.error("Error fetching all data:", error);
        throw error;
      });
  };

  getAll = (config?: AxiosRequestConfig, queryParams?: string) => {
    const url = queryParams ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return axiosInstance
      .get<T[]>(url, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error("Error fetching documents:", error);
        throw error;
      });
  };

  get = (id: number | string) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}`)
      .then((res) => res.data);
  };

  get_by_user_id = (id: number | string) => {
    return axiosInstance
      .get<T[]>(`${this.endpoint}?user_id=${id}`)
      .then((res) => res.data);
  };

  post = (data: R) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };

  postFormData = (formData: FormData, onProgress?: (progressEvent: any) => void) => {
    return axiosInstance.post<T>(this.endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    }).then((res) => res.data);
  };

  put = (id: string, data: R) => {
    return axiosInstance
      .put<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);
  };

  patch = (id: string, data: R) => {
    return axiosInstance
      .patch<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);
  };

  delete = (id: string) => {
    return axiosInstance.delete(`${this.endpoint}/${id}`);
  };
}
