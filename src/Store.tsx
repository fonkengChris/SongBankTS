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
}

const useSongQueryStore = create<SongQueryStore>((set) => ({
  songQuery: {},
  setSearchText: (searchText) => set(() => ({ songQuery: { searchText } })),
  setCategoryId: (categoryId?) =>
    set((store) => ({ songQuery: { ...store.songQuery, categoryId } })),
  setLanguageId: (languageId) =>
    set((store) => ({ songQuery: { ...store.songQuery, languageId } })),
  setNotationId: (notationId) =>
    set((store) => ({ songQuery: { ...store.songQuery, notationId } })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ songQuery: { ...store.songQuery, sortOrder } })),
}));

export default useSongQueryStore;
