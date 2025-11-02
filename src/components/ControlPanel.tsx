import { Play, Pause, SkipBack, SkipForward, RotateCcw, Download } from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onExport: () => void;
}

export default function ControlPanel({
  isRunning,
  isPaused,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  onExport,
}: ControlPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Simulation Controls</h3>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={onPlay}
          disabled={!isRunning || !isPaused}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <Play size={18} />
          Play
        </button>

        <button
          onClick={onPause}
          disabled={!isRunning || isPaused}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <Pause size={18} />
          Pause
        </button>

        <button
          onClick={onStepForward}
          disabled={!isRunning || !isPaused}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <SkipForward size={18} />
          Step
        </button>

        <button
          onClick={onStepBackward}
          disabled={!isRunning || !isPaused}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <SkipBack size={18} />
          Back
        </button>

        <button
          onClick={onReset}
          disabled={!isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={onExport}
          disabled={!isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speed: {speed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          disabled={!isRunning}
          className="w-full"
        />
      </div>
    </div>
  );
}
