export interface ProcessState {
  id: number;
  status: 'waiting' | 'executing' | 'finished' | 'unsafe';
  allocation: number[];
  max: number[];
  need: number[];
}

export interface SystemState {
  processes: ProcessState[];
  available: number[];
  work: number[];
  finish: boolean[];
  safeSequence: number[];
  isSafe: boolean;
}

export interface SimulationStep {
  stepNumber: number;
  checkingProcess: number;
  action: string;
  systemState: SystemState;
  timestamp: number;
}
