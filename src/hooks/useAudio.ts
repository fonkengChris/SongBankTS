import useAudios from "./useAudios";

const useAudio = (id?: string | null) => {
  const { data: audios } = useAudios();
  console.log(audios);
  return audios!.find((c) => c._id === id);
};

export default useAudio;
