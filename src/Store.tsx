import { create } from "zustand";

export interface SongQuery {
  categoryId?: number | null;
  notationId?: number | null;
  sortOrder?: string;
  searchText?: string;
}

interface SongQueryStore {
  songQuery: SongQuery;
  setCategoryId: (genreId: number | null) => void;
  setNotationId: (platformId: number | null) => void;
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
  setSortOrder: (sortOrder) =>
    set((store) => ({ songQuery: { ...store.songQuery, sortOrder } })),
}));

export default useSongQueryStore;
