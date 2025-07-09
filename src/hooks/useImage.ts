import useMediaFiles from "./useMediaFiles";
import SongMedia from "../entities/SongMedia";

const useImage = (id?: string | null) => {
  const { mediaFiles } = useMediaFiles();
  return mediaFiles.find(
    (media: SongMedia) => media._id === id && media.previewImage
  );
};

export default useImage;
