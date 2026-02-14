import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AiWritingTool from '../components/ai/AiWritingTool';
import ImageGenerator from '../components/ai/ImageGenerator';
import LocalChatbot from '../components/ai/LocalChatbot';

export default function AiToolsPage() {
  const search = useSearch({ strict: false }) as { tab?: string };
  const [activeTab, setActiveTab] = useState('writing');

  useEffect(() => {
    if (search.tab && ['writing', 'image', 'chatbot'].includes(search.tab)) {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  return (
    <div className="container max-w-6xl py-4 md:py-8 px-3 md:px-4">
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-xl md:text-3xl">AI Tools</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-auto md:grid md:w-full md:grid-cols-3">
                <TabsTrigger value="writing" className="px-4 md:px-6">AI Writing</TabsTrigger>
                <TabsTrigger value="image" className="px-4 md:px-6">Image Generator</TabsTrigger>
                <TabsTrigger value="chatbot" className="px-4 md:px-6">Chatbot</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="md:hidden" />
            </ScrollArea>
            <TabsContent value="writing">
              <AiWritingTool />
            </TabsContent>
            <TabsContent value="image">
              <ImageGenerator />
            </TabsContent>
            <TabsContent value="chatbot">
              <LocalChatbot />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
