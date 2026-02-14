import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ChevronLeft, ChevronRight, Presentation } from 'lucide-react';

interface Slide {
  id: string;
  content: string;
}

export default function SlidesTool() {
  const [slides, setSlides] = useState<Slide[]>([{ id: '1', content: 'Slide 1' }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPresentMode, setIsPresentMode] = useState(false);

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      content: `Slide ${slides.length + 1}`
    };
    setSlides([...slides, newSlide]);
    setCurrentIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentIndex >= newSlides.length) {
      setCurrentIndex(newSlides.length - 1);
    }
  };

  const updateSlide = (index: number, content: string) => {
    const newSlides = [...slides];
    newSlides[index].content = content;
    setSlides(newSlides);
  };

  const moveSlide = (from: number, to: number) => {
    if (to < 0 || to >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(from, 1);
    newSlides.splice(to, 0, moved);
    setSlides(newSlides);
    setCurrentIndex(to);
  };

  if (isPresentMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-4xl">
            <CardContent className="p-12">
              <p className="text-3xl whitespace-pre-wrap">{slides[currentIndex].content}</p>
            </CardContent>
          </Card>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {slides.length}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.min(slides.length - 1, currentIndex + 1))}
            disabled={currentIndex === slides.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="p-4 border-t text-center">
          <Button onClick={() => setIsPresentMode(false)}>Exit Presentation</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-2">
        <Button onClick={addSlide} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
        <Button onClick={() => setIsPresentMode(true)} size="sm" variant="outline">
          <Presentation className="w-4 h-4 mr-2" />
          Present
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Slides</h3>
          <div className="space-y-2">
            {slides.map((slide, i) => (
              <Card
                key={slide.id}
                className={`cursor-pointer transition-colors ${
                  i === currentIndex ? 'border-primary' : ''
                }`}
                onClick={() => setCurrentIndex(i)}
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <span className="text-sm">Slide {i + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(i, i - 1);
                      }}
                      disabled={i === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(i, i + 1);
                      }}
                      disabled={i === slides.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(i);
                      }}
                      disabled={slides.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Edit Slide {currentIndex + 1}</h3>
          <Textarea
            value={slides[currentIndex].content}
            onChange={(e) => updateSlide(currentIndex, e.target.value)}
            rows={15}
            placeholder="Enter slide content..."
          />
        </div>
      </div>
    </div>
  );
}
