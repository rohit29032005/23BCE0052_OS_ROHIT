import { useEffect, useRef } from 'react';
import { ProcessState } from '../types';
import { CanvasRenderer } from '../utils/canvasRenderer';

interface CanvasVisualizationProps {
  processes: ProcessState[];
  highlightProcess?: number;
  isSafe?: boolean;
  onScreenshot?: () => void;
}

export default function CanvasVisualization({
  processes,
  highlightProcess,
  isSafe,
  onScreenshot,
}: CanvasVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new CanvasRenderer(canvas);

    renderer.clear();
    renderer.drawProcesses(processes, highlightProcess);
    renderer.drawLegend();

    const statusText = isSafe !== undefined ? (isSafe ? 'Safe State' : 'Unsafe State') : '';
    if (statusText) {
      renderer.drawText(
        `Status: ${statusText}`,
        20,
        20,
        16,
        true
      );
    }
  }, [processes, highlightProcess, isSafe]);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full"
        />
      </div>
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={onScreenshot}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          Take Screenshot
        </button>
      </div>
    </div>
  );
}
