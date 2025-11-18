import {create} from 'zustand'

export const enum MUSIC_ACTION {
    SELECT = "SELECT",
    PLAYLIST = "PLAYLIST",
}

interface MusicFilterState { 
    selected: { [key: string]: any } | null;
    action: MUSIC_ACTION | null;
    isLoading: boolean;
    playlistRefreshToken: number;
    currentTrack: { [key: string]: any } | null;
    playlist: Array<{ [key: string]: any }>;
    currentIndex: number;

    // Actions cơ bản
    setSelected: (music: { [key: string]: any }) => void;
    setAction: (value: MUSIC_ACTION) => void;
    setIsLoading: (value: boolean) => void;
    requestAction: (action: MUSIC_ACTION, music: { [key: string]: any }) => void;
    triggerPlaylistRefresh: () => void;
    setCurrentTrack: (track: { [key: string]: any } | null) => void;
    clear: () => void;
    playTrack: (track: { [key: string]: any }, playlist?: Array<{ [key: string]: any }>) => void;

    // Actions mới cho phát nhạc
    setPlaylist: (playlist: Array<{ [key: string]: any }>, startIndex?: number) => void;
    updateTime: (currentTime: number, duration: number) => void;
    nextTrack: () => void;
    previousTrack: () => void;
    randomTrack: () => void;
    goToTrack: (index: number) => void;
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
    
    currentTrack: null,
    setCurrentTrack: (track) => set(() => ({ currentTrack: track })),
    
    playlist: [],
    currentIndex: 0,
    setPlaylist: (playlist, startIndex = 0) => {
        set(() => ({
            playlist,
            currentIndex: startIndex,
            currentTrack: playlist[startIndex] ?? null,
        }));
    },
    playTrack: (track, playlist) => {
        set((state) => {
            const playlistData = Array.isArray(playlist) && playlist.length
                ? {
                    playlist,
                    currentIndex: Math.max(
                        0,
                        playlist.findIndex((item) => String(item?.id) === String(track?.id))
                    ),
                }
                : {
                    playlist: state.playlist,
                    currentIndex: state.currentIndex,
                };

            const currentIndex = playlistData.currentIndex ?? state.currentIndex;
            const normalizedPlaylist = playlistData.playlist ?? state.playlist;

            const resolvedIndex = normalizedPlaylist.length
                ? currentIndex
                : 0;

            return {
                ...playlistData,
                currentTrack: track,
                selected: {
                    ...track,
                    currentTime: 0,
                    duration: 0,
                },
                action: MUSIC_ACTION.SELECT,
                currentIndex: resolvedIndex,
            };
        });
    },
    
    requestAction: (action: MUSIC_ACTION, music: { [key: string]: any }) => {
        set(() => ({ selected: music }));
        set(() => ({ action: action }));
    },
    
    clear: () => {
        set(() => ({ 
            selected: null,
            action: null,
        }));
    },
    
    // Cập nhật thời gian phát
    updateTime: (currentTime: number, duration: number) => {
        set((state) => ({
            selected: state.selected 
                ? { ...state.selected, currentTime, duration }
                : { currentTime, duration }
        }));
    },
    
    // Chuyển bài tiếp theo
    nextTrack: () => {
        const { playlist, currentIndex } = get();
        
        if (playlist.length === 0) return;
        
        const nextIndex = (currentIndex + 1) % playlist.length;
        const nextTrack = playlist[nextIndex];
        
        set(() => ({
            currentIndex: nextIndex,
            currentTrack: nextTrack,
            selected: { 
                ...nextTrack,
                currentTime: 0,
                duration: 0
            }
        }));
    },
    
    // Chuyển bài trước
    previousTrack: () => {
        const { playlist, currentIndex } = get();
        
        if (playlist.length === 0) return;
        
        const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
        const prevTrack = playlist[prevIndex];
        
        set(() => ({
            currentIndex: prevIndex,
            currentTrack: prevTrack,
            selected: { 
                ...prevTrack,
                currentTime: 0,
                duration: 0
            }
        }));
    },
    
    // Phát ngẫu nhiên
    randomTrack: () => {
        const { playlist, currentIndex } = get();
        
        if (playlist.length <= 1) {
            // Nếu chỉ có 1 bài hoặc không có bài, gọi next bình thường
            get().nextTrack();
            return;
        }
        
        // Chọn index ngẫu nhiên khác với index hiện tại
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentIndex);
        
        const randomTrack = playlist[randomIndex];
        
        set(() => ({
            currentIndex: randomIndex,
            currentTrack: randomTrack,
            selected: { 
                ...randomTrack,
                currentTime: 0,
                duration: 0
            }
        }));
    },
    
    // Chuyển đến bài cụ thể
    goToTrack: (index: number) => {
        const { playlist } = get();
        
        if (index < 0 || index >= playlist.length) return;
        
        const track = playlist[index];
        
        set(() => ({
            currentIndex: index,
            currentTrack: track,
            selected: { 
                ...track,
                currentTime: 0,
                duration: 0
            }
        }));
    },
}));

export default useMusicSelectedStore;