import Notation from "./Notation";
import Song from "./Song";

export default interface SongMedia {
  _id: string;
  song: Song;
  notation: Notation;
  documentFile: string;
  audioFile: string;
  previewImage: string;
}
