export interface Track {
  id: string;
  title: string;
  artist: string;
  path: string;
  tags: string[];
}

export const musicLibrary: Track[] = [
  {
    id: '1',
    title: 'Demo Track India 1',
    artist: 'Demo Artist',
    path: '/assets/audio/demo-india-1.dim_0x0.ogg',
    tags: ['India']
  },
  {
    id: '2',
    title: 'Demo Track Pakistan 1',
    artist: 'Demo Artist',
    path: '/assets/audio/demo-pakistan-1.dim_0x0.ogg',
    tags: ['Pakistan']
  }
];
