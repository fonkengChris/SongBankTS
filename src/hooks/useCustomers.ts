import { CUSTOMERS_ENDPOINT, MEDIA_BASE_URL } from "../data/constants";
import Customer from "../entities/Customer";
import axios from "axios";

const useCustomers = async () => {
  try {
    const response = await axios.get<Customer[] | undefined>(
      `${MEDIA_BASE_URL}${CUSTOMERS_ENDPOINT}`,
      {
        headers: {
          "x-auth-token": `${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching document:", err);
  }
};

export default useCustomers;
