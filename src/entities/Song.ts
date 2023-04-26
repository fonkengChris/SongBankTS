import Category from "./Category";
import Notation from "./Notation";

export default interface Song {
  id: number;
  title: string;
  slug: string;
  description: string;
  notation: Notation;
  category: Category;
  document_files: { id: number; document_file: URL }[];
  audio_files: { id: number; audio_file: string }[];
  author_name: string;
  preview_image: { preview_image: string }[];
  metacritic: number;
}
