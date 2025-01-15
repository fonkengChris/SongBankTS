import Category from "./Category";
import Language from "./Language";
import SongMedia from "./SongMedia";

export default interface Song {
  _id: string;
  title: string;
  slug: string;
  description: string;
  likesCount: number;
  lyrics: string;
  language: Language;
  views: number;
  category: Category;
  mediaFiles: SongMedia[];
  authorName: string;
  metacritic: number;
}
