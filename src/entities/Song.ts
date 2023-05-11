import Category from "./Category";
import Notation from "./Notation";

export default interface Song {
  id: number;
  title: string;
  slug: string;
  description: string;
  likes_count: number;
  lyrics: string;
  language: string;
  views: number;
  notation: Notation;
  category: Category;
  document_files: { id: number; document_file: string }[];
  audio_files: { id: number; audio_file: string }[];
  author_name: string;
  preview_image: { id: number; preview_image: string }[];
  metacritic: number;
}
