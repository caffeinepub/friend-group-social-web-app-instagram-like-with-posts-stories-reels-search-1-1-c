import { useState } from 'react';
import { useSearchUsers } from '../hooks/queries/useUserSearch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function SearchPage() {
  const [searchText, setSearchText] = useState('');
  const { data: usernames, isLoading } = useSearchUsers(searchText);
  const navigate = useNavigate();

  const handleStartChat = (username: string) => {
    navigate({ to: '/chat', search: { user: username } });
  };

  return (
    <div className="container max-w-2xl py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl">Search Users</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by username..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 md:space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : usernames && usernames.length > 0 ? (
          usernames.map((username) => (
            <Card key={username}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-4 md:px-6">
                <div className="min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">@{username}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleStartChat(username)}
                  className="gap-2 w-full sm:w-auto min-h-[44px] sm:min-h-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </CardContent>
            </Card>
          ))
        ) : searchText ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No users found matching "{searchText}"
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              Start typing to search for users
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
