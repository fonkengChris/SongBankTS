import Category from "./Category";
import Language from "./Language";

interface Video {
  _id: string;
  title: string;
  description: string;
  level: "regular" | "admin";
  url: string; // YouTube URL (e.g., https://youtube.com/watch?v=...)
  thumbnailUrl?: string;
  duration?: number; // in seconds
  createdAt?: string;
  updatedAt?: string;
}

export default Video;
