import { create } from 'zustand';

export const useBikeStore = create((set) => ({
    scale: 2,
    zoom: 1,
    setScale: (scale) => set({ scale }),
    setZoom: (zoom) => set({ zoom }),
}));
