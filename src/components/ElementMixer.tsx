import React, { useState } from 'react';
import { FlaskRound as Flask, Plus } from 'lucide-react';

interface Element {
  symbol: string;
  name: string;
  category: string;
}

const ELEMENTS: Element[] = [
  { symbol: 'H', name: 'Hydrogen', category: 'Nonmetal' },
  { symbol: 'O', name: 'Oxygen', category: 'Nonmetal' },
  { symbol: 'C', name: 'Carbon', category: 'Nonmetal' },
  { symbol: 'N', name: 'Nitrogen', category: 'Nonmetal' },
  { symbol: 'Na', name: 'Sodium', category: 'Metal' },
  { symbol: 'Cl', name: 'Chlorine', category: 'Halogen' },
  { symbol: 'Fe', name: 'Iron', category: 'Metal' },
  { symbol: 'Au', name: 'Gold', category: 'Metal' },
];

const COMBINATIONS: Record<string, string> = {
  'H2O': 'Water',
  'NaCl': 'Table Salt',
  'CO2': 'Carbon Dioxide',
  'NH3': 'Ammonia',
  'Fe2O3': 'Iron Oxide (Rust)',
};

export default function ElementMixer() {
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [result, setResult] = useState<string>('');

  const addElement = (element: Element) => {
    setSelectedElements(prev => [...prev, element]);
  };

  const mix = () => {
    const formula = selectedElements
      .map(e => e.symbol)
      .sort()
      .join('');

    setResult(COMBINATIONS[formula] || 'Unknown Combination');
    setSelectedElements([]);
  };

  const clearSelection = () => {
    setSelectedElements([]);
    setResult('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Element Mixer</h2>

        {/* Element Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {ELEMENTS.map(element => (
            <button
              key={element.symbol}
              onClick={() => addElement(element)}
              className="bg-black/30 hover:bg-black/40 p-4 rounded-lg transition text-center"
            >
              <div className="text-2xl font-bold">{element.symbol}</div>
              <div className="text-sm text-white/70">{element.name}</div>
              <div className="text-xs text-purple-300">{element.category}</div>
            </button>
          ))}
        </div>

        {/* Current Mix */}
        <div className="bg-black/30 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Current Mix:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedElements.map((element, index) => (
              <span
                key={index}
                className="bg-purple-500 px-3 py-1 rounded-full text-sm"
              >
                {element.symbol}
              </span>
            ))}
            {selectedElements.length === 0 && (
              <span className="text-white/70 italic">Select elements to mix</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={mix}
            disabled={selectedElements.length < 2}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
          >
            <Flask className="w-5 h-5" />
            Mix Elements
          </button>
          <button
            onClick={clearSelection}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white/10 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Result</h3>
          <div className="bg-black/30 p-4 rounded-lg">
            <p className="text-xl">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}