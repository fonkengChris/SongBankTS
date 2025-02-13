import Category from "../entities/Category";
import Language from "../entities/Language";
import SongMedia from "../entities/SongMedia";

export interface CategoryFormData {
  title: string;
  description?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  role?: "regular" | "admin" | "superAdmin";
}

export interface CustomerFormData {
  user?: string;
  country: string;
}

export interface LanguageFormData {
  name: string;
  code: string;
}

export interface MediaFileFormData {
  name: string;
  song?: string;
  notation: string;
  documentFile: string;
  audioFile: string;
  previewImage: string;
}

export interface SongFormData {
  title: string;
  slug: string;
  description?: string;
  lyrics: string;
  language: { _id: string; name: string; code: string };
  authorName: string;
  category?: Category;
  mediaFiles: string[];
  price?: number;
  views?: number;
  likesCount?: number;
  metacritic?: number;
}

export interface NotationFormData {
  title: string;
  slug: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: "regular" | "admin" | "superAdmin";
}

export interface CustomerUpdateFormData {
  country: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  accessToken: string;
}

export interface CustomerPayload {
  user: string;
  country: string;
}
