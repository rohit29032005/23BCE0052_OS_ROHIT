import { Info } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Banker's Algorithm Visual Simulator</h1>
              <p className="text-blue-100 text-sm">
                SCHOOL OF COMPUTER SCIENCE AND ENGINEERING
              </p>
              <p className="text-blue-100 text-sm">
                Operating Systems Lab | Fall Semester 2025-26
              </p>
            </div>
            <button
              onClick={() => setShowAbout(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition"
            >
              <Info size={24} />
            </button>
          </div>
        </div>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                This simulation demonstrates the <strong>Banker's Algorithm</strong>, a fundamental deadlock
                avoidance algorithm in Operating Systems.
              </p>
              <p>
                The algorithm manages resource allocation to processes, ensuring the system never enters an
                unsafe state where deadlock might occur.
              </p>
              <h3 className="font-semibold text-gray-900 mt-4">How to Use:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Configure the Allocation and Max matrices for each process</li>
                <li>Set the Available vector for system resources</li>
                <li>Click "Run Simulation" to start the algorithm visualization</li>
                <li>Use Play/Pause/Step controls to control simulation speed</li>
                <li>Add new processes dynamically while simulation is running</li>
                <li>Export execution traces and screenshots for documentation</li>
              </ul>
              <p className="text-sm italic text-gray-600 mt-4">
                Green processes have completed, yellow are executing, red are unsafe, and gray are waiting.
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
