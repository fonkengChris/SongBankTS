import Category from "./Category";
import SongAudio from "./SongAudio";
import SongDocument from "./SongDocument";

export default interface Song {
  _id: string;
  title: string;
  slug: string;
  description: string;
  likes_count: number;
  lyrics: string;
  language: string;
  views: number;
  category: Category;
  documentFiles: SongDocument[];
  audioFile: SongAudio;
  author_name: string;
  metacritic: number;
}
