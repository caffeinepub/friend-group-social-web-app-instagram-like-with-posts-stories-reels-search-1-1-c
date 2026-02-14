import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleDownloadAPK = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = '/downloads/caffeine-social.apk';
    link.download = 'caffeine-social.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or download the app
              </span>
            </div>
          </div>

          <Button 
            onClick={handleDownloadAPK}
            variant="outline"
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Android APK
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Install the Android app for a native mobile experience
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
