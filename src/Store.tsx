import { create } from "zustand";

export interface SongQuery {
  categoryId?: number | null;
  notationId?: number | null;
  languageId?: number | null;
  sortOrder?: string;
  searchText?: string;
}

interface SongQueryStore {
  songQuery: SongQuery;
  setCategoryId: (categoryId: number | null) => void;
  setNotationId: (notationId: number | null) => void;
  setLanguageId: (languageId: number | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setSearchText: (searchText: string) => void;
}

const useSongQueryStore = create<SongQueryStore>((set) => ({
  songQuery: {},
  setSearchText: (searchText) => set(() => ({ songQuery: { searchText } })),
  setCategoryId: (categoryId?) =>
    set((store) => ({ songQuery: { ...store.songQuery, categoryId } })),
  setNotationId: (notationId) =>
    set((store) => ({ songQuery: { ...store.songQuery, notationId } })),
  setLanguageId: (languageId) =>
    set((store) => ({ songQuery: { ...store.songQuery, languageId } })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ songQuery: { ...store.songQuery, sortOrder } })),
}));

export default useSongQueryStore;
