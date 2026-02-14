import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Whiteboard from '../components/study/Whiteboard';
import SlidesTool from '../components/study/SlidesTool';

export default function StudyToolsPage() {
  return (
    <div className="container max-w-6xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Study Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="whiteboard">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
              <TabsTrigger value="slides">Slides</TabsTrigger>
            </TabsList>
            <TabsContent value="whiteboard">
              <Whiteboard />
            </TabsContent>
            <TabsContent value="slides">
              <SlidesTool />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
