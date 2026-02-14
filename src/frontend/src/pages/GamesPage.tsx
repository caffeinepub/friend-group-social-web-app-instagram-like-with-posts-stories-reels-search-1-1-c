import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import TicTacToe from '../games/tic-tac-toe/TicTacToe';
import MemoryMatch from '../games/memory-match/MemoryMatch';
import Snake from '../games/snake/Snake';
import Game2048 from '../games/2048/Game2048';
import Quiz from '../games/quiz/Quiz';

export default function GamesPage() {
  return (
    <div className="container max-w-4xl py-4 md:py-8 px-3 md:px-4">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-xl md:text-3xl">Games</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <Tabs defaultValue="tictactoe">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-auto md:grid md:w-full md:grid-cols-5">
                <TabsTrigger value="tictactoe" className="px-3 md:px-4">Tic-Tac-Toe</TabsTrigger>
                <TabsTrigger value="memory" className="px-3 md:px-4">Memory</TabsTrigger>
                <TabsTrigger value="snake" className="px-3 md:px-4">Snake</TabsTrigger>
                <TabsTrigger value="2048" className="px-3 md:px-4">2048</TabsTrigger>
                <TabsTrigger value="quiz" className="px-3 md:px-4">Quiz</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="md:hidden" />
            </ScrollArea>
            <TabsContent value="tictactoe">
              <TicTacToe />
            </TabsContent>
            <TabsContent value="memory">
              <MemoryMatch />
            </TabsContent>
            <TabsContent value="snake">
              <Snake />
            </TabsContent>
            <TabsContent value="2048">
              <Game2048 />
            </TabsContent>
            <TabsContent value="quiz">
              <Quiz />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
