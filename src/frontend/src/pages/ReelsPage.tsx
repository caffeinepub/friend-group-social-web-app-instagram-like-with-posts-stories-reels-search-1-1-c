import { useState } from 'react';
import { useGetReels, useCreateReel } from '../hooks/queries/useReels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Film } from 'lucide-react';
import { toast } from 'sonner';

export default function ReelsPage() {
  const { data: reels, isLoading } = useGetReels();
  const createReel = useCreateReel();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      await createReel.mutateAsync({
        title: title.trim(),
        video: null,
        link: link.trim() || null
      });

      setTitle('');
      setLink('');
      toast.success('Reel created successfully!');
    } catch (error) {
      toast.error('Failed to create reel');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-4xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Create Reel</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Reel title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Video Link (optional)</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button type="submit" disabled={createReel.isPending} className="w-full min-h-[44px]">
              {createReel.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 mr-2" />
                  Create Reel
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3 md:space-y-4">
        <h2 className="text-xl md:text-2xl font-bold px-1">Reels</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reels && reels.length > 0 ? (
          <div className="grid gap-3 md:gap-4">
            {reels.map((reel) => (
              <Card key={reel.id}>
                <CardContent className="py-3 md:py-4 px-4 md:px-6">
                  <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{reel.title}</h3>
                  {reel.link && (
                    <a 
                      href={reel.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm break-all"
                    >
                      View Video →
                    </a>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(Number(reel.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No reels yet. Create one to share!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
