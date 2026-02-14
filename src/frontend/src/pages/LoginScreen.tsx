import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <img 
              src="/assets/generated/caffeine-social-logo.dim_256x256.png" 
              alt="Caffeine Social" 
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Caffeine Social</CardTitle>
          <CardDescription className="text-base">
            Connect with your friends, share moments, and explore together
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Share posts, stories, and reels
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Chat with friends in real-time
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Play games and listen to music
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Use AI tools and study features
            </p>
          </div>
          <Button 
            onClick={login} 
            disabled={isLoggingIn}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoggingIn ? 'Connecting...' : 'Sign In with Internet Identity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
