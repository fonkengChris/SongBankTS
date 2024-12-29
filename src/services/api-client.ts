import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3000/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add an interceptor to attach the JWT token dynamically to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosLikeInstance = axios.create({
  baseURL: BASE_URL + "api/songs/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // getAll = (config?: AxiosRequestConfig, queryParams?: string) => {
  //   const url = queryParams ? `${this.endpoint}?${queryParams}` : this.endpoint;
  //   console.log(url);
  //   return axiosInstance.get<T[]>(url, config).then((res) => res.data);
  // };

  getAll = (config?: AxiosRequestConfig, queryParams?: string) => {
    const url = queryParams ? `${this.endpoint}?${queryParams}` : this.endpoint;

    return axiosInstance
      .get<T[]>(url, config)
      .then((res) => {
        return res.data;
      })
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

  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };

  put = (id: string, data: Partial<T>) => {
    return axiosInstance
      .put<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);
  };

  patch = <T, E>(id: string, data: { entity: E }): Promise<T> => {
    return axiosInstance
      .patch<T>(`${this.endpoint}?user_id=${id}`, data)
      .then((res) => res.data);
  };
}

export default APIClient;
