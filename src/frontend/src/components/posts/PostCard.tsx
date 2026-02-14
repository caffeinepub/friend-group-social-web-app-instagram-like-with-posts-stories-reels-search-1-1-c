import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Data__3 } from '../../backend';

interface PostCardProps {
  post: Data__3;
}

export default function PostCard({ post }: PostCardProps) {
  const timestamp = new Date(Number(post.timestamp) / 1000000);
  const authorInitial = post.author.toString().charAt(0).toUpperCase();

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
