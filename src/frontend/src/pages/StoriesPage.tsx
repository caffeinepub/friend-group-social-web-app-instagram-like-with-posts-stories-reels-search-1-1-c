import { useState } from 'react';
import { useGetStories, useCreateStory } from '../hooks/queries/useStories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function StoriesPage() {
  const { data: stories, isLoading } = useGetStories();
  const createStory = useCreateStory();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;
      
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array);
      }

      await createStory.mutateAsync({
        text: text.trim(),
        image: imageBlob
      });

      setText('');
      setImageFile(null);
      toast.success('Story created successfully!');
    } catch (error) {
      toast.error('Failed to create story');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-4xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Create Story</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share a moment..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit" disabled={createStory.isPending} className="w-full min-h-[44px]">
              {createStory.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Story
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3 md:space-y-4">
        <h2 className="text-xl md:text-2xl font-bold px-1">Active Stories</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                {story.image && (
                  <img 
                    src={story.image.getDirectURL()} 
                    alt="Story" 
                    className="w-full h-40 md:h-48 object-cover"
                  />
                )}
                <CardContent className="p-2.5 md:p-3">
                  <p className="text-xs md:text-sm line-clamp-2 break-words">{story.text}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 md:mt-2">
                    {new Date(Number(story.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No active stories. Create one to share!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
