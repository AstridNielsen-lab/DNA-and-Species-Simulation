import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Info, Dna as DnaIcon, Sparkles } from 'lucide-react';
import AIChat from './AIChat';

const NUCLEOTIDES = ['A', 'T', 'C', 'G'];

interface DNASequence {
  id: string;
  sequence: string;
  name: string;
  description: string;
}

export default function DNABuilder() {
  const [sequences, setSequences] = useState<DNASequence[]>([]);
  const [currentSequence, setCurrentSequence] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addNucleotide = (nucleotide: string) => {
    setCurrentSequence(prev => prev + nucleotide);
  };

  const generateRandomSequence = () => {
    const length = Math.floor(Math.random() * 20) + 10; // 10-30 bases
    let sequence = '';
    for (let i = 0; i < length; i++) {
      sequence += NUCLEOTIDES[Math.floor(Math.random() * NUCLEOTIDES.length)];
    }
    setCurrentSequence(sequence);
  };

  const analyzeSequence = async () => {
    if (!currentSequence) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analise esta sequência de DNA: ${currentSequence}
              
              1. Crie um nome criativo para uma espécie hipotética que poderia ter este DNA
              2. Descreva características possíveis desta espécie baseadas na sequência
              3. Identifique padrões interessantes na sequência
              4. Sugira possíveis funções biológicas
              
              Responda em formato JSON com os campos:
              {
                "name": "Nome da espécie",
                "description": "Descrição das características",
                "patterns": "Padrões encontrados",
                "functions": "Funções biológicas sugeridas"
              }`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na análise da sequência');
      }

      const data = await response.json();
      const analysis = JSON.parse(data.candidates[0].content.parts[0].text);

      setSequences(prev => [...prev, {
        id: Date.now().toString(),
        sequence: currentSequence,
        name: analysis.name,
        description: analysis.description
      }]);

      setCurrentSequence('');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao analisar a sequência. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteSequence = (id: string) => {
    setSequences(prev => prev.filter(seq => seq.id !== id));
  };

  const generateDNAPrompt = (message: string) => `
    Atue como um especialista em genética e biologia molecular. O usuário está explorando sequências de DNA.
    
    Contexto atual:
    - Sequência atual: ${currentSequence}
    - Sequências salvas: ${sequences.map(s => s.sequence).join(', ')}
    
    Forneça:
    1. Explicações sobre padrões de DNA
    2. Sugestões de sequências interessantes
    3. Análise de possíveis características
    4. Correlações com espécies conhecidas
    
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DnaIcon className="w-6 h-6" />
            Simulador de DNA
          </h2>
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
            <h3 className="font-bold text-blue-300 mb-2">Tutorial do Simulador de DNA</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-200">1. Criando Sequências</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Use os botões A, T, C, G para construir manualmente</li>
                  <li>Use "Gerar Aleatório" para sequências automáticas</li>
                  <li>A IA analisará e sugerirá espécies possíveis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Análise de DNA</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Cada sequência recebe um nome de espécie</li>
                  <li>A IA identifica características possíveis</li>
                  <li>Padrões interessantes são destacados</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Experimentação</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Tente diferentes comprimentos de sequência</li>
                  <li>Compare resultados diferentes</li>
                  <li>Use o chat para aprender mais</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar o Simulador:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Crie sequências manualmente ou gere aleatoriamente</li>
              <li>A IA analisará e sugerirá espécies possíveis</li>
              <li>Cada sequência recebe um nome único</li>
              <li>Use o chat para aprender mais sobre DNA</li>
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
          <button
            onClick={generateRandomSequence}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Gerar Aleatório
          </button>
        </div>

        <div className="bg-black/30 p-4 rounded-lg font-mono mb-4">
          <p className="text-xl tracking-wider">{currentSequence || 'Comece a construir sua sequência...'}</p>
        </div>

        <button
          onClick={analyzeSequence}
          disabled={!currentSequence || isAnalyzing}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
        >
          <DnaIcon className="w-5 h-5" />
          {isAnalyzing ? 'Analisando...' : 'Analisar Sequência'}
        </button>
      </div>

      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Espécies Simuladas</h3>
        <div className="space-y-4">
          {sequences.map(seq => (
            <div key={seq.id} className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-purple-300">{seq.name}</h4>
                  <p className="font-mono text-sm mt-1">{seq.sequence}</p>
                  <p className="text-sm text-white/70 mt-2">{seq.description}</p>
                </div>
                <button
                  onClick={() => deleteSequence(seq.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {sequences.length === 0 && (
            <p className="text-white/70 italic">Nenhuma espécie simulada ainda</p>
          )}
        </div>
      </div>

      <AIChat
        initialMessage="Olá! Sou seu assistente de simulação de DNA. Posso ajudar você a entender sequências de DNA, sugerir combinações interessantes e explicar como diferentes padrões podem resultar em características específicas. O que você gostaria de explorar?"
        generatePrompt={generateDNAPrompt}
        autoSpeak={true}
      />
    </div>
  );
}