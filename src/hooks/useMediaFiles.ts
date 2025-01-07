import { useState, useEffect } from "react";
import SongMedia from "../entities/SongMedia";
import APIClient from "../services/api-client";

const useMediaFiles = () => {
  const [mediaFiles, setMediaFiles] = useState<SongMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new APIClient<SongMedia>("/api/media_files");

  useEffect(() => {
    const fetchMediaFiles = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getAll();
        setMediaFiles(response);
      } catch (err) {
        console.error("Error fetching media files:", err);
        setError("Failed to load media files. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaFiles();
  }, []);

  return { mediaFiles, loading, error };
};

export default useMediaFiles;
