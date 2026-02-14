import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useDeletePost } from '../../hooks/queries/usePosts';
import { toast } from 'sonner';
import type { Data__4 } from '../../backend';

interface PostCardProps {
  post: Data__4;
}

export default function PostCard({ post }: PostCardProps) {
  const { identity } = useInternetIdentity();
  const deletePost = useDeletePost();
  const timestamp = new Date(Number(post.timestamp) / 1000000);
  const authorInitial = post.author.toString().charAt(0).toUpperCase();

  const isOwner = identity && post.author.toString() === identity.getPrincipal().toString();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost.mutateAsync(post.id);
      toast.success('Post deleted successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete post';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('not authorized')) {
        toast.error('You are not authorized to delete this post');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 md:gap-3 space-y-0 px-4 md:px-6 py-3 md:py-4">
        <Avatar className="w-8 h-8 md:w-10 md:h-10">
          <AvatarFallback>{authorInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs md:text-sm truncate">{post.author.toString().slice(0, 8)}...</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString()}
          </p>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="flex-shrink-0"
          >
            {deletePost.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 text-destructive" />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 px-4 md:px-6 pb-4 md:pb-6">
        <p className="whitespace-pre-wrap text-sm md:text-base break-words">{post.caption}</p>
        {post.image && (
          <img 
            src={post.image.getDirectURL()} 
            alt="Post" 
            className="w-full rounded-lg"
          />
        )}
      </CardContent>
    </Card>
  );
}
