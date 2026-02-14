type ValidRoute = '/' | '/feed' | '/chat' | '/search' | '/stories' | '/reels' | '/games' | '/music' | '/study' | '/ai';

interface NavigateFunction {
  (opts: { to: ValidRoute }): void;
}

const routes: Record<string, ValidRoute> = {
  feed: '/feed',
  chat: '/chat',
  search: '/search',
  stories: '/stories',
  reels: '/reels',
  games: '/games',
  music: '/music',
  study: '/study',
  ai: '/ai'
};

export function chatbotRespond(input: string, navigate: NavigateFunction): string {
  const lower = input.toLowerCase();

  if (lower.includes('help')) {
    return 'I can help you navigate! Try: "go to games", "open music", "show feed", etc. Or ask about features!';
  }

  for (const [key, path] of Object.entries(routes)) {
    if (lower.includes(key) && (lower.includes('go') || lower.includes('open') || lower.includes('show'))) {
      navigate({ to: path });
      return `Opening ${key}...`;
    }
  }

  if (lower.includes('post')) {
    return 'You can create posts in the Feed section. Share photos and captions with your friends!';
  }

  if (lower.includes('story') || lower.includes('stories')) {
    return 'Stories let you share moments that expire after 24 hours. Check the Stories section!';
  }

  if (lower.includes('game')) {
    return 'We have 5 games: Tic-Tac-Toe, Memory Match, Snake, 2048, and Quiz. Visit the Games section!';
  }

  if (lower.includes('music')) {
    return 'Browse and play music from India and Pakistan in the Music section!';
  }

  if (lower.includes('study') || lower.includes('whiteboard') || lower.includes('slide')) {
    return 'Study Tools has a Whiteboard for drawing and a Slides tool for presentations!';
  }

  return "I'm not sure about that. Try asking 'help' to see what I can do!";
}
