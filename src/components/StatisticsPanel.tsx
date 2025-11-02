import { ProcessState } from '../types';

interface StatisticsPanelProps {
  processes: ProcessState[];
  available: number[];
  safeSequence: number[];
  isSafe: boolean;
  showStats: boolean;
}

export default function StatisticsPanel({
  processes,
  available,
  safeSequence,
  isSafe,
  showStats,
}: StatisticsPanelProps) {
  if (!showStats) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Available Vector</h3>
          <div className="flex gap-2 flex-wrap">
            {available.map((val, i) => (
              <div key={`avail-${i}`} className="bg-blue-100 px-3 py-2 rounded-lg">
                <div className="text-xs text-gray-600">R{i}</div>
                <div className="font-semibold text-gray-900">{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Need Matrix</h3>
          <div className="space-y-1 text-sm">
            {processes.map((p) => (
              <div key={`need-${p.id}`} className="flex justify-between">
                <span className="text-gray-600">P{p.id}:</span>
                <span className="font-mono text-gray-900">[{p.need.join(', ')}]</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Process Status</h3>
          <div className="space-y-1 text-sm">
            {processes.map((p) => (
              <div key={`status-${p.id}`} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    p.status === 'finished'
                      ? 'bg-green-500'
                      : p.status === 'executing'
                        ? 'bg-yellow-500'
                        : p.status === 'unsafe'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                  }`}
                ></span>
                <span className="text-gray-600">P{p.id}:</span>
                <span className="font-semibold text-gray-900 capitalize">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Safe Sequence</h3>
        <div
          className={`p-4 rounded-lg ${
            isSafe
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {isSafe ? (
            <div>
              <p className="text-green-800 font-semibold mb-2">System is in Safe State</p>
              <p className="text-green-700 font-mono">
                {safeSequence.length > 0 ? safeSequence.map((id) => `P${id}`).join(' -> ') : 'Sequence pending...'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-red-800 font-semibold">System is in Unsafe State</p>
              <p className="text-red-700 text-sm mt-1">No valid safe sequence exists</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
