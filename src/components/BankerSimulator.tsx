import { useState, useEffect, useRef } from 'react';
import { ProcessState, SystemState } from '../types';
import { BankerAlgorithm } from '../utils/bankerAlgorithm';
import { CanvasRenderer } from '../utils/canvasRenderer';
import Header from './Header';
import InputPanel from './InputPanel';
import CanvasVisualization from './CanvasVisualization';
import ControlPanel from './ControlPanel';
import StatisticsPanel from './StatisticsPanel';

export default function BankerSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processes, setProcesses] = useState<ProcessState[]>([]);
  const [available, setAvailable] = useState<number[]>([]);
  const [safeSequence, setSafeSequence] = useState<number[]>([]);
  const [isSafe, setIsSafe] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [highlightProcess, setHighlightProcess] = useState<number>();
  const [resourceCount, setResourceCount] = useState(0);

  const initializeSimulation = (
    allocation: number[][],
    max: number[][],
    availableVec: number[]
  ) => {
    const validation = BankerAlgorithm.validateInput(allocation, max, availableVec);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const procs: ProcessState[] = allocation.map((alloc, i) => ({
      id: i,
      status: 'waiting',
      allocation: alloc,
      max: max[i],
      need: BankerAlgorithm.calculateNeed(alloc, max[i]),
    }));

    setResourceCount(availableVec.length);
    setProcesses(procs);
    setAvailable(availableVec);
    setIsRunning(true);
    setIsPaused(true);
    setCurrentStep(0);
    setLastUpdateTime(Date.now());

    const { isSafe: safe, sequence } = BankerAlgorithm.isSafeState(procs, availableVec, availableVec.length);
    setIsSafe(safe);
    setSafeSequence(sequence);

    if (!safe) {
      alert('Warning: Initial system state is UNSAFE!');
    }
  };

  const handleAddProcess = (allocation: number[], max: number[]) => {
    const newProcess: ProcessState = {
      id: processes.length,
      status: 'waiting',
      allocation,
      max,
      need: BankerAlgorithm.calculateNeed(allocation, max),
    };

    const updatedProcesses = [...processes, newProcess];
    setProcesses(updatedProcesses);

    const { isSafe: safe, sequence } = BankerAlgorithm.isSafeState(
      updatedProcesses,
      available,
      resourceCount
    );
    setIsSafe(safe);
    setSafeSequence(sequence);

    if (!safe) {
      alert('Warning: Adding this process made the system UNSAFE!');
    }
  };

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setProcesses([]);
    setAvailable([]);
    setSafeSequence([]);
    setHighlightProcess(undefined);
  };

  const handleStepForward = () => {
    if (currentStep < safeSequence.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `banker-algorithm-${Date.now()}.png`;
      link.click();
    }
  };

  const handleExport = () => {
    const trace = `
BANKER'S ALGORITHM EXECUTION TRACE
Generated: ${new Date().toLocaleString()}

SYSTEM CONFIGURATION
====================
Processes: ${processes.length}
Resources: ${resourceCount}

ALLOCATION MATRIX
${processes.map((p) => `P${p.id}: [${p.allocation.join(', ')}]`).join('\n')}

MAX MATRIX
${processes.map((p) => `P${p.id}: [${p.max.join(', ')}]`).join('\n')}

INITIAL AVAILABLE VECTOR
[${available.join(', ')}]

EXECUTION RESULT
================
System State: ${isSafe ? 'SAFE' : 'UNSAFE'}
Safe Sequence: ${isSafe ? safeSequence.map((id) => `P${id}`).join(' -> ') : 'N/A'}

PROCESS STATUS
${processes
  .map((p) => {
    const completedAt = safeSequence.indexOf(p.id) + 1 || 'Not completed';
    return `P${p.id}: ${p.status.toUpperCase()} (Completed at step: ${completedAt})`;
  })
  .join('\n')}

NEED MATRIX
${processes.map((p) => `P${p.id}: [${p.need.join(', ')}]`).join('\n')}
    `.trim();

    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(trace);
    link.download = `banker-algorithm-trace-${Date.now()}.txt`;
    link.click();
  };

  useEffect(() => {
    if (!isRunning || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const stepDuration = 1000 / speed;

      if (now - lastUpdateTime > stepDuration) {
        if (currentStep < safeSequence.length) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsPaused(true);
        }
        setLastUpdateTime(now);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, isPaused, currentStep, speed, safeSequence.length, lastUpdateTime]);

  useEffect(() => {
    if (isRunning) {
      const newProcesses = processes.map((p) => {
        const processIndex = safeSequence.indexOf(p.id);

        if (processIndex === -1) {
          return { ...p, status: 'waiting' };
        }

        if (processIndex < currentStep) {
          return { ...p, status: 'finished' };
        }

        if (processIndex === currentStep && currentStep < safeSequence.length) {
          return { ...p, status: 'executing' };
        }

        return { ...p, status: 'waiting' };
      });
      setProcesses(newProcesses);

      if (currentStep < safeSequence.length) {
        setHighlightProcess(safeSequence[currentStep]);
      } else {
        setHighlightProcess(undefined);
      }
    }
  }, [currentStep, isRunning, safeSequence, processes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <InputPanel onStart={initializeSimulation} onAddProcess={handleAddProcess} isRunning={isRunning} />
          </div>

          <div className="lg:col-span-3">
            <CanvasVisualization
              processes={processes}
              highlightProcess={highlightProcess}
              isSafe={isSafe}
              onScreenshot={handleScreenshot}
            />
          </div>
        </div>

        {/* Control and Statistics Section */}
        {isRunning && (
          <div className="space-y-6">
            <div>
              <ControlPanel
                isRunning={isRunning}
                isPaused={isPaused}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                speed={speed}
                onSpeedChange={setSpeed}
                onExport={handleExport}
              />
            </div>

            <div>
              <StatisticsPanel
                processes={processes}
                available={available}
                safeSequence={safeSequence}
                isSafe={isSafe}
                showStats={true}
              />
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} width={800} height={600} style={{ display: 'none' }} />
    </div>
  );
}
