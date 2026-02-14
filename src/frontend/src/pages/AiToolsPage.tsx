import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AiWritingTool from '../components/ai/AiWritingTool';
import ImageGenerator from '../components/ai/ImageGenerator';
import LocalChatbot from '../components/ai/LocalChatbot';

export default function AiToolsPage() {
  return (
    <div className="container max-w-6xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">AI Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="writing">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="writing">AI Writing</TabsTrigger>
              <TabsTrigger value="image">Image Generator</TabsTrigger>
              <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            </TabsList>
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
