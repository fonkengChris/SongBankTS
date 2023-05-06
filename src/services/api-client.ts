import axios, { AxiosRequestConfig } from "axios";
const BASE_URL = "http://localhost:8000/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
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

  getAll = (config: AxiosRequestConfig) => {
    console.log("get all fxn called");
    return axiosInstance
      .get<T[]>(this.endpoint, config)
      .then((res) => res.data);
  };

  get = (id: number | string) => {
    return axiosInstance
      .get<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  };

  get_by_user_id = (id: number | string) => {
    return axiosInstance
      .get<T[]>(this.endpoint + "?user_id=" + id)
      .then((res) => res.data);
  };

  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };

  put = (id: number, data: T) => {
    return axiosInstance
      .put<T>(this.endpoint + "?user_id=" + id, data)
      .then((res) => res.data);
  };

  patch = <T, E>(id: number, data: { entity: E }): Promise<T> => {
    return axiosInstance
      .patch<T>(this.endpoint + "?user_id=" + id, data)
      .then((res) => res.data);
  };
}

export default APIClient;
