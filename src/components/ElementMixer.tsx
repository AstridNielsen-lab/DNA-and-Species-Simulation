import React, { useState } from 'react';
import { FlaskRound as Flask, Plus, HelpCircle } from 'lucide-react';
import AIChat from './AIChat';

interface Element {
  symbol: string;
  name: string;
  category: string;
}

const ELEMENTS: Element[] = [
  { symbol: 'H', name: 'Hidrogênio', category: 'Não-metal' },
  { symbol: 'O', name: 'Oxigênio', category: 'Não-metal' },
  { symbol: 'C', name: 'Carbono', category: 'Não-metal' },
  { symbol: 'N', name: 'Nitrogênio', category: 'Não-metal' },
  { symbol: 'Na', name: 'Sódio', category: 'Metal' },
  { symbol: 'Cl', name: 'Cloro', category: 'Halogênio' },
  { symbol: 'Fe', name: 'Ferro', category: 'Metal' },
  { symbol: 'Au', name: 'Ouro', category: 'Metal' },
];

const COMBINATIONS: Record<string, string> = {
  'H2O': 'Água',
  'NaCl': 'Sal de Cozinha',
  'CO2': 'Dióxido de Carbono',
  'NH3': 'Amônia',
  'Fe2O3': 'Óxido de Ferro (Ferrugem)',
};

export default function ElementMixer() {
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [result, setResult] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);

  const addElement = (element: Element) => {
    setSelectedElements(prev => [...prev, element]);
  };

  const mix = () => {
    const formula = selectedElements
      .map(e => e.symbol)
      .sort()
      .join('');

    setResult(COMBINATIONS[formula] || 'Combinação Desconhecida');
    setSelectedElements([]);
  };

  const clearSelection = () => {
    setSelectedElements([]);
    setResult('');
  };

  const generateElementPrompt = (message: string) => `
    Atue como um especialista em química. Ajude o usuário a entender elementos químicos e suas combinações.
    Forneça:
    1. Explicação detalhada dos elementos ou compostos mencionados
    2. Propriedades químicas e reações
    3. Aplicações no mundo real e fatos interessantes
    
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Misturador de Elementos</h2>
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
            <h3 className="font-bold mb-2">Como usar o Misturador de Elementos:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Clique nos elementos químicos para selecioná-los</li>
              <li>Combine dois ou mais elementos para criar compostos</li>
              <li>Use o botão "Misturar Elementos" para ver o resultado</li>
              <li>O assistente IA pode explicar as propriedades dos elementos</li>
            </ul>
          </div>
        )}

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

        <div className="bg-black/30 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Mistura Atual:</h3>
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
              <span className="text-white/70 italic">Selecione elementos para misturar</span>
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
            Misturar Elementos
          </button>
          <button
            onClick={clearSelection}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            Limpar
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white/10 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Resultado</h3>
          <div className="bg-black/30 p-4 rounded-lg">
            <p className="text-xl">{result}</p>
          </div>
        </div>
      )}

      <AIChat
        initialMessage="Olá! Eu sou seu especialista em química. Posso ajudar você a entender elementos, compostos e suas propriedades. O que você gostaria de saber sobre química?"
        generatePrompt={generateElementPrompt}
        autoSpeak={true}
      />
    </div>
  );
}