import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StartupErrorScreenProps {
  error: unknown;
  onRetry: () => void;
}

export default function StartupErrorScreen({ error, onRetry }: StartupErrorScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      // Keep the button disabled for a moment to prevent rapid clicking
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Unable to Load App</CardTitle>
          <CardDescription className="text-base">
            We encountered an issue while starting the application. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry
              </>
            )}
          </Button>

          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full text-sm">
                {showDetails ? 'Hide' : 'Show'} technical details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="p-3 bg-muted rounded-md text-xs font-mono break-all">
                {errorMessage}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <p className="text-xs text-center text-muted-foreground">
            If the problem persists, try refreshing the page or clearing your browser cache.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
