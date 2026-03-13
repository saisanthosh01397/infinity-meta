import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Pencil, Square, Circle, Download, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00d4ff');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'rect' | 'circle'>('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = tool === 'eraser' ? lineWidth * 5 : lineWidth;
    
    // Use a CSS variable for the surface background if erasing
    if (tool === 'eraser') {
      const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-surface').trim() || '#080810';
      ctx.strokeStyle = surfaceColor;
    } else {
      ctx.strokeStyle = color;
    }

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'whiteboard-capture.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-2xl overflow-hidden border border-border shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTool('pencil')}
            className={clsx("p-2 rounded-lg transition-colors", tool === 'pencil' ? "bg-brand-primary text-brand-bg" : "hover:bg-white/5 text-text-primary")}
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={clsx("p-2 rounded-lg transition-colors", tool === 'eraser' ? "bg-brand-primary text-brand-bg" : "hover:bg-white/5 text-text-primary")}
          >
            <Eraser size={20} />
          </button>
          <div className="w-px h-6 bg-border mx-2" />
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
          />
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-24 accent-brand-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadImage}
            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
            title="Download Capture"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={clearCanvas}
            className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair bg-surface">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="absolute inset-0"
        />
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
          <span className="text-xs font-mono uppercase tracking-widest text-text-primary">Live Interactive Canvas</span>
        </div>
      </div>
    </div>
  );
}
