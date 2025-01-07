import Notation from "./Notation";
import Song from "./Song";

export default interface SongMedia {
  _id: string;
  song: Song;
  name: string;
  notation: Notation;
  documentFile: string;
  audioFile: string;
  previewImage: string;
}
