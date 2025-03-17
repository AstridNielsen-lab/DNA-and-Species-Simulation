import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AIChat from './AIChat';

const NUCLEOTIDES = ['A', 'T', 'C', 'G'];

interface DNASequence {
  id: string;
  sequence: string;
}

export default function DNABuilder() {
  const [sequences, setSequences] = useState<DNASequence[]>([]);
  const [currentSequence, setCurrentSequence] = useState('');

  const addNucleotide = (nucleotide: string) => {
    setCurrentSequence(prev => prev + nucleotide);
  };

  const saveSequence = () => {
    if (currentSequence) {
      setSequences(prev => [...prev, { id: Date.now().toString(), sequence: currentSequence }]);
      setCurrentSequence('');
    }
  };

  const deleteSequence = (id: string) => {
    setSequences(prev => prev.filter(seq => seq.id !== id));
  };

  const generateDNAPrompt = (message: string) => `
    Act as a DNA sequence expert. The user wants help with DNA sequences.
    Provide detailed information about DNA sequences, including:
    1. Explanation of the requested DNA pattern or structure
    2. Suggested sequence using A, T, C, G bases
    3. Scientific explanation of the sequence properties
    
    User request: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">DNA Sequence Builder</h2>
        
        <div className="flex gap-2 mb-4">
          {NUCLEOTIDES.map(nucleotide => (
            <button
              key={nucleotide}
              onClick={() => addNucleotide(nucleotide)}
              className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-mono text-lg transition"
            >
              {nucleotide}
            </button>
          ))}
        </div>

        <div className="bg-black/30 p-4 rounded-lg font-mono mb-4">
          <p className="text-xl tracking-wider">{currentSequence || 'Start building your sequence...'}</p>
        </div>

        <button
          onClick={saveSequence}
          disabled={!currentSequence}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Save Sequence
        </button>
      </div>

      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Saved Sequences</h3>
        <div className="space-y-2">
          {sequences.map(seq => (
            <div key={seq.id} className="flex items-center justify-between bg-black/30 p-4 rounded-lg">
              <p className="font-mono">{seq.sequence}</p>
              <button
                onClick={() => deleteSequence(seq.id)}
                className="text-red-400 hover:text-red-300 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {sequences.length === 0 && (
            <p className="text-white/70 italic">No sequences saved yet</p>
          )}
        </div>
      </div>

      <AIChat
        initialMessage="Hello! I'm your DNA sequence expert. I can help you understand DNA patterns, suggest sequences, and explain their properties. What would you like to know about DNA?"
        generatePrompt={generateDNAPrompt}
      />
    </div>
  );
}