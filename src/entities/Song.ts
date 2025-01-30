import Category from "./Category";
import Language from "./Language";
import SongMedia from "./SongMedia";

interface Song {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  lyrics: string;
  language: Language;
  authorName: string;
  category?: Category;
  mediaFiles: SongMedia[];
  views?: number;
  likesCount?: number;
  metacritic?: number;
  price?: number;
}

export default Song;
