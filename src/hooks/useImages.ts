import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import { IMAGES_ENDPOINT } from "../data/constants";
import PreviewImage from "../entities/PrevievImage";

const apiClient = new APIClient<PreviewImage>(IMAGES_ENDPOINT);

const useImages = () =>
  useQuery({
    queryKey: ["images"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useImages;
