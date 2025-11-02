import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface InputPanelProps {
  onStart: (allocation: number[][], max: number[][], available: number[]) => void;
  onAddProcess: (allocation: number[], max: number[]) => void;
  isRunning: boolean;
}

export default function InputPanel({ onStart, onAddProcess, isRunning }: InputPanelProps) {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(3);
  const [allocation, setAllocation] = useState<number[][]>([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
  ]);
  const [max, setMax] = useState<number[][]>([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
  ]);
  const [available, setAvailable] = useState<number[]>([10, 5, 7]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAllocation, setNewAllocation] = useState<number[]>([0, 0, 0]);
  const [newMax, setNewMax] = useState<number[]>([0, 0, 0]);

  const handleStart = () => {
    onStart(allocation, max, available);
  };

  const handleAddProcess = () => {
    onAddProcess(newAllocation, newMax);
    setShowAddModal(false);
    setNewAllocation(new Array(numResources).fill(0));
    setNewMax(new Array(numResources).fill(0));
  };

  const updateAllocation = (row: number, col: number, value: number) => {
    const newAlloc = allocation.map((r) => [...r]);
    newAlloc[row][col] = value;
    setAllocation(newAlloc);
  };

  const updateMax = (row: number, col: number, value: number) => {
    const newMaxVal = max.map((r) => [...r]);
    newMaxVal[row][col] = value;
    setMax(newMaxVal);
  };

  const updateAvailable = (col: number, value: number) => {
    const newAvail = [...available];
    newAvail[col] = value;
    setAvailable(newAvail);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 space-y-6 h-fit">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">System Input</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processes</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numProcesses}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setNumProcesses(val);
                  setAllocation(Array(val).fill([...new Array(numResources).fill(0)]));
                  setMax(Array(val).fill([...new Array(numResources).fill(0)]));
                }}
                disabled={isRunning}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resources</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numResources}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setNumResources(val);
                }}
                disabled={isRunning}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Allocation Matrix</h3>
        <div className="space-y-2 overflow-x-auto">
          <table className="text-xs w-full">
            <tbody>
              {allocation.map((row, i) => (
                <tr key={`alloc-${i}`} className="border-b">
                  <td className="font-medium text-gray-700 pr-2">P{i}</td>
                  {row.map((val, j) => (
                    <td key={`alloc-${i}-${j}`} className="px-1 py-1">
                      <input
                        type="number"
                        min="0"
                        value={val}
                        onChange={(e) => updateAllocation(i, j, parseInt(e.target.value) || 0)}
                        className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-xs"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Max Matrix</h3>
        <div className="space-y-2 overflow-x-auto">
          <table className="text-xs w-full">
            <tbody>
              {max.map((row, i) => (
                <tr key={`max-${i}`} className="border-b">
                  <td className="font-medium text-gray-700 pr-2">P{i}</td>
                  {row.map((val, j) => (
                    <td key={`max-${i}-${j}`} className="px-1 py-1">
                      <input
                        type="number"
                        min="0"
                        value={val}
                        onChange={(e) => updateMax(i, j, parseInt(e.target.value) || 0)}
                        className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-xs"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Vector</h3>
        <div className="flex gap-2">
          {available.map((val, i) => (
            <div key={`avail-${i}`} className="flex-1">
              <label className="text-xs text-gray-600">R{i}</label>
              <input
                type="number"
                min="0"
                value={val}
                onChange={(e) => updateAvailable(i, parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={isRunning}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
      >
        Run Simulation
      </button>

      <button
        onClick={() => setShowAddModal(true)}
        disabled={!isRunning}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add Process
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Process</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allocation</label>
                <div className="flex gap-2 flex-wrap">
                  {newAllocation.map((val, i) => (
                    <input
                      key={`new-alloc-${i}`}
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) => {
                        const arr = [...newAllocation];
                        arr[i] = parseInt(e.target.value) || 0;
                        setNewAllocation(arr);
                      }}
                      placeholder={`R${i}`}
                      className="flex-1 min-w-16 px-3 py-2 border border-gray-300 rounded text-center"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max</label>
                <div className="flex gap-2 flex-wrap">
                  {newMax.map((val, i) => (
                    <input
                      key={`new-max-${i}`}
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) => {
                        const arr = [...newMax];
                        arr[i] = parseInt(e.target.value) || 0;
                        setNewMax(arr);
                      }}
                      placeholder={`R${i}`}
                      className="flex-1 min-w-16 px-3 py-2 border border-gray-300 rounded text-center"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProcess}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
