import { create } from "zustand";

export interface SongQuery {
  categoryId?: string | null;
  languageId?: string | null;
  notationId?: string | null;
  sortOrder?: string;
  searchText?: string;
}

interface SongQueryStore {
  songQuery: SongQuery;
  setCategoryId: (categoryId: string | null) => void;
  setLanguageId: (languageId: string | null) => void;
  setNotationId: (notationId: string | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setSearchText: (searchText: string) => void;
  buildQueryUrl: () => string;
}

const useSongQueryStore = create<SongQueryStore>((set, get) => ({
  songQuery: {},

  setSearchText: (searchText) =>
    set((store) => ({ songQuery: { ...store.songQuery, searchText } })),

  setCategoryId: (categoryId) =>
    set((store) => ({ songQuery: { ...store.songQuery, categoryId } })),

  setLanguageId: (languageId) =>
    set((store) => ({ songQuery: { ...store.songQuery, languageId } })),

  setNotationId: (notationId) =>
    set((store) => ({ songQuery: { ...store.songQuery, notationId } })),

  setSortOrder: (sortOrder) =>
    set((store) => ({ songQuery: { ...store.songQuery, sortOrder } })),

  buildQueryUrl: () => {
    const { songQuery } = get();
    const params = new URLSearchParams();

    if (songQuery.categoryId) params.append("categoryId", songQuery.categoryId);
    if (songQuery.languageId) params.append("languageId", songQuery.languageId);
    if (songQuery.notationId) params.append("notationId", songQuery.notationId);
    if (songQuery.sortOrder) params.append("sortOrder", songQuery.sortOrder);
    if (songQuery.searchText) params.append("searchText", songQuery.searchText);

    return `/api/songs?${params.toString()}`;
  },
}));



export default useSongQueryStore;
