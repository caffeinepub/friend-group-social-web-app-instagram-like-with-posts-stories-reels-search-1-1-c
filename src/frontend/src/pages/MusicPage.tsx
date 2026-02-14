import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, SkipForward, SkipBack, Upload, Loader2 } from 'lucide-react';
import { musicLibrary, type Track } from '../music/library';
import { useGetUserTracks, useUploadTrack } from '../hooks/queries/useUserTracks';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const audioRef = useRef<HTMLAudioElement>(null);

  // User uploads
  const { data: userTracks, isLoading: tracksLoading } = useGetUserTracks();
  const uploadTrack = useUploadTrack();
  const [uploadTitle, setUploadTitle] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredTracks = filter === 'all' 
    ? musicLibrary 
    : musicLibrary.filter(t => t.tags.includes(filter));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextTrack = filteredTracks[(currentIndex + 1) % filteredTracks.length];
    playTrack(nextTrack);
  };

  const playPrev = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prevTrack = filteredTracks[(currentIndex - 1 + filteredTracks.length) % filteredTracks.length];
    playTrack(prevTrack);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadTitle.trim()) {
      toast.error('Please enter a track title');
      return;
    }

    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }

    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const audioBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadTrack.mutateAsync({
        title: uploadTitle.trim(),
        audio: audioBlob
      });

      setUploadTitle('');
      setAudioFile(null);
      setUploadProgress(0);
      toast.success('Track uploaded successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to upload track';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div className="container max-w-4xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Upload Your Music</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <form onSubmit={handleUpload} className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackTitle">Track Title</Label>
              <Input
                id="trackTitle"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="My awesome track..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioFile">Audio File</Label>
              <Input
                id="audioFile"
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <Button type="submit" disabled={uploadTrack.isPending} className="w-full min-h-[44px]">
              {uploadTrack.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Track
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {userTracks && userTracks.length > 0 && (
        <Card>
          <CardHeader className="px-4 md:px-6 py-4 md:py-6">
            <CardTitle className="text-lg md:text-xl">Your Uploaded Tracks</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
            {userTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => {
                  const trackData: Track = {
                    id: track.id,
                    title: track.title,
                    artist: 'You',
                    path: track.audio.getDirectURL(),
                    tags: []
                  };
                  playTrack(trackData);
                }}
                className="p-3 rounded-lg border cursor-pointer transition-colors min-h-[60px] flex items-center bg-card hover:bg-accent"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">{track.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    Uploaded {new Date(Number(track.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Music Library</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
              className="min-h-[44px] md:min-h-0"
            >
              All
            </Button>
            <Button 
              variant={filter === 'India' ? 'default' : 'outline'}
              onClick={() => setFilter('India')}
              size="sm"
              className="min-h-[44px] md:min-h-0"
            >
              India
            </Button>
            <Button 
              variant={filter === 'Pakistan' ? 'default' : 'outline'}
              onClick={() => setFilter('Pakistan')}
              size="sm"
              className="min-h-[44px] md:min-h-0"
            >
              Pakistan
            </Button>
          </div>

          <div className="space-y-2">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors min-h-[60px] flex items-center ${
                  currentTrack?.id === track.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card hover:bg-accent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">{track.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentTrack && (
        <Card>
          <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6 px-4 md:px-6 space-y-4">
            <div className="text-center">
              <p className="font-semibold text-base md:text-lg truncate">{currentTrack.title}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>

            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 md:gap-4">
              <Button variant="outline" size="icon" onClick={playPrev} className="min-w-[44px] min-h-[44px]">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="icon" onClick={togglePlay} className="min-w-[44px] min-h-[44px]">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={playNext} className="min-w-[44px] min-h-[44px]">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <audio ref={audioRef} src={currentTrack?.path} />
    </div>
  );
}
