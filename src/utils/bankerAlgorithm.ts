import { ProcessState, SystemState } from '../types';

export class BankerAlgorithm {
  static calculateNeed(allocation: number[], max: number[]): number[] {
    return max.map((m, i) => m - allocation[i]);
  }

  static isSafeState(
    processes: ProcessState[],
    available: number[],
    resourceCount: number
  ): { isSafe: boolean; sequence: number[] } {
    const n = processes.length;
    const work = [...available];
    const finish = new Array(n).fill(false);
    const safeSequence: number[] = [];

    let found = true;
    while (found && safeSequence.length < n) {
      found = false;

      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          const canAllocate = processes[i].need.every((need, j) => need <= work[j]);

          if (canAllocate) {
            work.forEach((_, j) => {
              work[j] += processes[i].allocation[j];
            });
            finish[i] = true;
            safeSequence.push(i);
            found = true;
          }
        }
      }
    }

    const isSafe = finish.every((f) => f);
    return { isSafe, sequence: safeSequence };
  }

  static simulateStep(
    processes: ProcessState[],
    available: number[],
    stepIndex: number
  ): {
    currentProcess: number | null;
    canAllocate: boolean;
    newAvailable: number[];
    newProcesses: ProcessState[];
  } {
    const n = processes.length;
    const work = [...available];
    const finish = new Array(n).fill(false);
    const processedCount: number[] = [];

    for (let i = 0; i < n; i++) {
      if (processedCount.length <= stepIndex && !finish[i]) {
        const canAllocate = processes[i].need.every((need, j) => need <= work[j]);

        if (canAllocate) {
          work.forEach((_, j) => {
            work[j] += processes[i].allocation[j];
          });
          finish[i] = true;
          processedCount.push(i);
        }
      }
    }

    if (stepIndex < processedCount.length) {
      const processId = processedCount[stepIndex];
      const newProcesses = processes.map((p) => ({
        ...p,
        status: finish[p.id] ? 'finished' : 'waiting',
      }));

      return {
        currentProcess: processId,
        canAllocate: true,
        newAvailable: work,
        newProcesses,
      };
    }

    return {
      currentProcess: null,
      canAllocate: false,
      newAvailable: available,
      newProcesses: processes,
    };
  }

  static validateInput(
    allocation: number[][],
    max: number[][],
    available: number[]
  ): { valid: boolean; error?: string } {
    if (allocation.length === 0) {
      return { valid: false, error: 'At least one process required' };
    }

    const resourceCount = allocation[0].length;

    if (resourceCount === 0) {
      return { valid: false, error: 'At least one resource type required' };
    }

    for (let i = 0; i < allocation.length; i++) {
      if (allocation[i].length !== resourceCount) {
        return { valid: false, error: 'Allocation matrix column mismatch' };
      }
      if (max[i].length !== resourceCount) {
        return { valid: false, error: 'Max matrix column mismatch' };
      }

      for (let j = 0; j < resourceCount; j++) {
        if (allocation[i][j] > max[i][j]) {
          return { valid: false, error: `Process ${i}: Allocation > Max for resource ${j}` };
        }
        if (allocation[i][j] < 0 || max[i][j] < 0 || available[j] < 0) {
          return { valid: false, error: 'Negative values not allowed' };
        }
      }
    }

    return { valid: true };
  }
}
