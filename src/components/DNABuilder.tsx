import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import AIChat from './AIChat';

const NUCLEOTIDES = ['A', 'T', 'C', 'G'];

interface DNASequence {
  id: string;
  sequence: string;
}

export default function DNABuilder() {
  const [sequences, setSequences] = useState<DNASequence[]>([]);
  const [currentSequence, setCurrentSequence] = useState('');
  const [showHelp, setShowHelp] = useState(false);

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
    Atue como um especialista em sequências de DNA. O usuário precisa de ajuda com sequências de DNA.
    Forneça informações detalhadas sobre sequências de DNA, incluindo:
    1. Explicação do padrão ou estrutura de DNA solicitado
    2. Sequência sugerida usando as bases A, T, C, G
    3. Explicação científica das propriedades da sequência
    
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Construtor de DNA</h2>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-purple-300 hover:text-purple-200 transition"
            title="Ajuda"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar o Construtor de DNA:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Clique nos botões A, T, C, G para construir sua sequência de DNA</li>
              <li>Cada botão representa uma base nitrogenada do DNA</li>
              <li>Use o botão "Salvar Sequência" para guardar sua sequência</li>
              <li>Você pode criar várias sequências diferentes</li>
              <li>Use o assistente IA para tirar dúvidas sobre DNA</li>
            </ul>
          </div>
        )}
        
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
          <p className="text-xl tracking-wider">{currentSequence || 'Comece a construir sua sequência...'}</p>
        </div>

        <button
          onClick={saveSequence}
          disabled={!currentSequence}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Salvar Sequência
        </button>
      </div>

      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Sequências Salvas</h3>
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
            <p className="text-white/70 italic">Nenhuma sequência salva ainda</p>
          )}
        </div>
      </div>

      <AIChat
        initialMessage="Olá! Eu sou seu especialista em DNA. Posso ajudar você a entender padrões de DNA, sugerir sequências e explicar suas propriedades. O que você gostaria de saber sobre DNA?"
        generatePrompt={generateDNAPrompt}
        autoSpeak={true}
      />
    </div>
  );
}