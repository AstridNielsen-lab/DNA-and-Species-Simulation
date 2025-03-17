import React, { useState } from 'react';
import { Dna, FlaskRound as Flask, Atom, ArrowRight, Plus, Trash2 } from 'lucide-react';
import DNABuilder from './components/DNABuilder';
import SpeciesCrossing from './components/SpeciesCrossing';
import ElementMixer from './components/ElementMixer';

function App() {
  const [activeTab, setActiveTab] = useState<'dna' | 'species' | 'elements'>('dna');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Dna className="w-8 h-8" />
            BioSim Lab
          </h1>
          <p className="mt-2 text-purple-200">Explore DNA, Species, and Chemical Elements</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('dna')}
              className={`px-4 py-3 flex items-center gap-2 transition
                ${activeTab === 'dna' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
            >
              <Dna className="w-5 h-5" />
              DNA Builder
            </button>
            <button
              onClick={() => setActiveTab('species')}
              className={`px-4 py-3 flex items-center gap-2 transition
                ${activeTab === 'species' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
            >
              <Flask className="w-5 h-5" />
              Species Crossing
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`px-4 py-3 flex items-center gap-2 transition
                ${activeTab === 'elements' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
            >
              <Atom className="w-5 h-5" />
              Element Mixer
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dna' && <DNABuilder />}
        {activeTab === 'species' && <SpeciesCrossing />}
        {activeTab === 'elements' && <ElementMixer />}
      </main>
    </div>
  );
}

export default App;