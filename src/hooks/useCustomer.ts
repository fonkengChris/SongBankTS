import { useQuery } from "@tanstack/react-query";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import Customer from "../entities/Customer";
import APIClient from "../services/api-client";
import ms from "ms";
import axios from "axios";

const apiClient = new APIClient<Customer>(CUSTOMERS_ENDPOINT);

const useCustomer = async (id: number) => {
  // const customer = useQuery<Customer[], Error>({
  //   queryKey: ["customers"],
  //   queryFn: () => apiClient.get_by_user_id(id),
  //   cacheTime: 0,
  //   staleTime: ms("24h"),
  // });

  return await axios
    .get<Customer[]>("http://localhost:8000/library/customers/?user_id=" + id)
    .then((res) => res.data);
};

export default useCustomer;
