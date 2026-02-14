import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download } from 'lucide-react';

export default function ImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hue, setHue] = useState([180]);
  const [complexity, setComplexity] = useState([5]);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${hue[0]}, 70%, 50%)`);
    gradient.addColorStop(1, `hsl(${(hue[0] + 60) % 360}, 70%, 50%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < complexity[0]; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 100 + 20;
      const color = `hsla(${(hue[0] + Math.random() * 120) % 360}, 70%, 60%, 0.3)`;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'generated-image.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Hue: {hue[0]}°</Label>
          <Slider value={hue} onValueChange={setHue} max={360} step={1} />
        </div>
        <div className="space-y-2">
          <Label>Complexity: {complexity[0]}</Label>
          <Slider value={complexity} onValueChange={setComplexity} max={20} step={1} />
        </div>
      </div>

      <Button onClick={generate} className="w-full">
        Generate Image
      </Button>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border-2 border-border rounded-lg w-full bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Button onClick={exportImage} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Export PNG
      </Button>
    </div>
  );
}
