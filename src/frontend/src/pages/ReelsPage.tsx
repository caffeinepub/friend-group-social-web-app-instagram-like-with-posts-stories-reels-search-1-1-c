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
    <div className="container max-w-4xl py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Reel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={createReel.isPending}>
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

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reels</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reels && reels.length > 0 ? (
          <div className="grid gap-4">
            {reels.map((reel) => (
              <Card key={reel.id}>
                <CardContent className="py-4">
                  <h3 className="font-semibold text-lg mb-2">{reel.title}</h3>
                  {reel.link && (
                    <a 
                      href={reel.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View Video →
                    </a>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(Number(reel.timestamp) / 1000000).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No reels yet. Create one to share!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
