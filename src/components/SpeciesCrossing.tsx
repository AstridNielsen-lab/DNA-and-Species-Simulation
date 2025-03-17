import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import AIChat from './AIChat';

export default function SpeciesCrossing() {
  const [showHelp, setShowHelp] = useState(false);

  const generateSpeciesPrompt = (message: string) => `
    Atue como um engenheiro de DNA e criador de espécies. O usuário quer criar uma nova espécie. 
    Gere uma resposta que inclua:
    1. Uma breve descrição da espécie com base na solicitação do usuário
    2. Uma sequência de DNA simulada (usando as bases A, T, C, G)
    3. Características e traços principais
    
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cruzamento de Espécies</h2>
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
            <h3 className="font-bold mb-2">Como usar o Cruzamento de Espécies:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Descreva a espécie que você quer criar</li>
              <li>O assistente IA irá gerar uma sequência de DNA</li>
              <li>Você receberá informações sobre características e traços</li>
              <li>Faça perguntas sobre evolução e genética</li>
            </ul>
          </div>
        )}
      </div>

      <AIChat
        initialMessage="Olá! Eu sou seu assistente para criar novas espécies. Me diga que tipo de criatura você quer criar, e eu vou ajudar a gerar sua sequência de DNA e características!"
        generatePrompt={generateSpeciesPrompt}
        autoSpeak={true}
      />
    </div>
  );
}