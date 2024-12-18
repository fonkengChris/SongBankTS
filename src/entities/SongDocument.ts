import Notation from "./Notation";

export default interface SongDocument {
  _id: string;
  documentFile: string;
  notation: Notation;
  previewImage: string;
}
