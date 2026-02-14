import { useState } from 'react';
import { useGetPosts, useCreatePost } from '../hooks/queries/usePosts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import PostCard from '../components/posts/PostCard';

export default function FeedPage() {
  const { data: posts, isLoading } = useGetPosts();
  const createPost = useCreatePost();
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caption.trim()) {
      toast.error('Please enter a caption');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;
      
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await createPost.mutateAsync({
        caption: caption.trim(),
        image: imageBlob
      });

      setCaption('');
      setImageFile(null);
      setUploadProgress(0);
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-2xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Create Post</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="resize-none"
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
            <Button 
              type="submit" 
              className="w-full min-h-[44px]"
              disabled={createPost.isPending}
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3 md:space-y-4">
        <h2 className="text-xl md:text-2xl font-bold px-1">Feed</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No posts yet. Be the first to share something!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
