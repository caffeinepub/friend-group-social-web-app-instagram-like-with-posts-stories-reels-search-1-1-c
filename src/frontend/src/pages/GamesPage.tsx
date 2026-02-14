import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TicTacToe from '../games/tic-tac-toe/TicTacToe';
import MemoryMatch from '../games/memory-match/MemoryMatch';
import Snake from '../games/snake/Snake';
import Game2048 from '../games/2048/Game2048';
import Quiz from '../games/quiz/Quiz';

export default function GamesPage() {
  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Games</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tictactoe">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="tictactoe">Tic-Tac-Toe</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="snake">Snake</TabsTrigger>
              <TabsTrigger value="2048">2048</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>
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
