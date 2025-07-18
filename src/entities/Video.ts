import Category from "./Category";
import Language from "./Language";

interface Video {
  _id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  url: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  category: Category;
  language: Language;
  instructor: string;
  tags?: string[];
  views?: number;
  likesCount?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default Video;
