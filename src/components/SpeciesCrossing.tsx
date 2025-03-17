import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';
import AIChat from './AIChat';

export default function SpeciesCrossing() {
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="text-blue-300 hover:text-blue-200 transition"
              title="Tutorial"
            >
              <Info className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-purple-300 hover:text-purple-200 transition"
              title="Ajuda"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showTutorial && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-blue-300 mb-2">Tutorial do Cruzamento de Espécies</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-200">1. Conceitos Básicos</h4>
                <p>O cruzamento de espécies envolve:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li><span className="text-blue-300">DNA</span> - Material genético</li>
                  <li><span className="text-blue-300">Genes</span> - Unidades de hereditariedade</li>
                  <li><span className="text-blue-300">Traços</span> - Características físicas</li>
                  <li><span className="text-blue-300">Mutações</span> - Alterações genéticas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Criando Espécies</h4>
                <p>Para criar uma nova espécie:</p>
                <ol className="list-decimal list-inside mt-1 ml-2">
                  <li>Descreva as características desejadas</li>
                  <li>Especifique o ambiente da espécie</li>
                  <li>Defina traços específicos</li>
                  <li>Analise a sequência de DNA gerada</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Exemplos de Características</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Tamanho e forma do corpo</li>
                  <li>Cor e padrões</li>
                  <li>Habilidades especiais</li>
                  <li>Adaptações ao ambiente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">4. Dicas</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Seja específico nas descrições</li>
                  <li>Considere a viabilidade biológica</li>
                  <li>Pense nas interações ecológicas</li>
                  <li>Use o assistente IA para sugestões</li>
                </ul>
              </div>
            </div>
          </div>
        )}

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