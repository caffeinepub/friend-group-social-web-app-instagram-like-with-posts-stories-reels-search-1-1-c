import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Whiteboard from '../components/study/Whiteboard';
import SlidesTool from '../components/study/SlidesTool';

export default function StudyToolsPage() {
  return (
    <div className="container max-w-6xl py-4 md:py-8 px-3 md:px-4">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-xl md:text-3xl">Study Tools</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <Tabs defaultValue="whiteboard">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="whiteboard" className="text-sm md:text-base">Whiteboard</TabsTrigger>
              <TabsTrigger value="slides" className="text-sm md:text-base">Slides</TabsTrigger>
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
