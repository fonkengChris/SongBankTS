import useMediaFiles from "./useMediaFiles";
import SongMedia from "../entities/SongMedia";

const useAudio = (id?: string | null) => {
  const { mediaFiles } = useMediaFiles();
  return mediaFiles.find(
    (media: SongMedia) => media._id === id && media.audioFile
  );
};

export default useAudio;
