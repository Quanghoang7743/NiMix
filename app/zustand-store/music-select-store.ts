import {create} from 'zustand'

export const enum MUSIC_ACTION {
    SELECT = "SELECT",
    PLAYLIST = "PLAYLIST",
    
}

interface MusicFilterState { 
    selected: { [key: string]: any } | null; // Hoặc thay 'any' bằng kiểu cụ thể
    action: MUSIC_ACTION | null;
    isLoading: boolean;
    playlistRefreshToken: number;
    setSelected: (music: { [key: string]: any }) => void;
    setAction: (value: MUSIC_ACTION) => void;
    setIsLoading: (value: boolean) => void;
    requestAction: (action: MUSIC_ACTION, music: { [key: string]: any }) => void;
    triggerPlaylistRefresh: () => void;
    clear: () => void;
}

const useMusicSelectedStore = create<MusicFilterState>((set, get) => ({
    isLoading: false,
    setIsLoading: (value) => set({ isLoading: value }),
    selected: null,
    setSelected: (value: { [key: string]: any }) => set(() => ({ selected: value })),
    action: null,
    setAction: (value: MUSIC_ACTION) => set(() => ({ action: value })),
    playlistRefreshToken: 0,
    triggerPlaylistRefresh: () => set((state) => ({ playlistRefreshToken: state.playlistRefreshToken + 1 })),
    requestAction: (action: MUSIC_ACTION, music: { [key: string]: any }) => {
        set(() => ({ selected: music }));
        set(() => ({ action: action }));
    },
    clear: () => {
        set(() => ({ selected: null }));
        set(() => ({ action: null }));
    },
}));

export default useMusicSelectedStore;
