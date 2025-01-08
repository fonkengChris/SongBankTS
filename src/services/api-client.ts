import axios, { AxiosRequestConfig } from "axios";

// Make sure we're using the same format consistently
const BASE_URL = "http://127.0.0.1:3000";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor with logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request Config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        "x-auth-token": token,
      };
    }
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
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

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

  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };

  put = (id: string, data: Partial<T>) => {
    return axiosInstance
      .put<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);
  };

  patch = (id: string, data: T, config?: AxiosRequestConfig) => {
    const endpoint = this.endpoint.endsWith("/")
      ? this.endpoint.slice(0, -1)
      : this.endpoint;

    return axiosInstance
      .patch<T>(`${endpoint}/${id}`, data, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error("PATCH request error:", error.response || error);
        throw error;
      });
  };

  delete = (id: string) => {
    return axiosInstance.delete(`${this.endpoint}/${id}`);
  };
}

export default APIClient;
