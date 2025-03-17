import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dna, FlaskRound as Flask, Atom, Book } from 'lucide-react';
import DNABuilder from './components/DNABuilder';
import SpeciesCrossing from './components/SpeciesCrossing';
import ElementMixer from './components/ElementMixer';
import ResearchAssistant from './components/ResearchAssistant';
import SplashScreen from './components/SplashScreen';

function App() {
  const [activeTab, setActiveTab] = useState<'dna' | 'species' | 'elements' | 'research'>('dna');

  return (
    <>
      <Helmet>
        <title>BioSim Lab - Like Look Solutions</title>
        <meta name="description" content="Simulador de DNA, Espécies e Elementos Químicos desenvolvido pela Like Look Solutions" />
      </Helmet>

      <SplashScreen />

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <header className="bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Dna className="w-8 h-8" />
              BioSim Lab
            </h1>
            <p className="mt-2 text-purple-200">Explore DNA, Espécies e Elementos Químicos</p>
            <div className="mt-2 text-sm text-purple-300">
              <p>Desenvolvido por Julio Campos Machado</p>
              <p>Like Look Solutions - <a href="https://likelook.wixsite.com/solutions" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">Visite nosso site</a></p>
              <p>WhatsApp: <a href="https://wa.me/5511992946628" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">+55 11 99294-6628</a></p>
            </div>
          </div>
        </header>

        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('dna')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'dna' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Dna className="w-5 h-5" />
                Construtor de DNA
              </button>
              <button
                onClick={() => setActiveTab('species')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'species' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Flask className="w-5 h-5" />
                Cruzamento de Espécies
              </button>
              <button
                onClick={() => setActiveTab('elements')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'elements' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Atom className="w-5 h-5" />
                Misturador de Elementos
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'research' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Book className="w-5 h-5" />
                Pesquisa Científica
              </button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {activeTab === 'dna' && <DNABuilder />}
          {activeTab === 'species' && <SpeciesCrossing />}
          {activeTab === 'elements' && <ElementMixer />}
          {activeTab === 'research' && <ResearchAssistant />}
        </main>
      </div>
    </>
  );
}

export default App;