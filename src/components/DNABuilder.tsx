import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Info, Dna as DnaIcon, Sparkles, Skull, Bird, Fish, Dog, Clipboard, ClipboardCheck } from 'lucide-react';
import AIChat from './AIChat';

const NUCLEOTIDES = ['A', 'T', 'C', 'G'];

// Exemplos de características baseadas em padrões de DNA
const DNA_PATTERNS = {
  'ATAT': 'Resistência a temperaturas extremas',
  'GCGC': 'Alta capacidade de regeneração',
  'TGCA': 'Adaptação a diferentes ambientes',
  'AAAA': 'Pigmentação intensa',
  'GGGG': 'Força muscular aumentada',
  'CCCC': 'Sistema imunológico robusto',
  'TTTT': 'Longevidade elevada',
  'AGAG': 'Metabolismo acelerado',
  'CTCT': 'Sentidos aguçados',
  'TATA': 'Reprodução rápida'
};

const SCIENTIFIC_PREFIXES = [
  'Neo', 'Xeno', 'Mega', 'Ultra', 'Crypto', 'Proto', 'Hyper', 'Meta', 'Quantum', 'Bio'
];

const SCIENTIFIC_SUFFIXES = [
  'saurus', 'morph', 'raptor', 'titan', 'genesis', 'forma', 'species', 'zoa', 'phyta', 'bacteria'
];

interface DNASequence {
  id: string;
  sequence: string;
  name: string;
  scientificName: string;
  description: string;
  traits: string[];
  habitat: string;
  size: string;
  diet: string;
  behavior: string;
  parentSpecies?: string[];
}

export default function DNABuilder() {
  const [sequences, setSequences] = useState<DNASequence[]>([]);
  const [currentSequence, setCurrentSequence] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'dinossauros' | 'modernos' | 'hibridos'>('dinossauros');
  const [parentSpecies, setParentSpecies] = useState<string[]>([]);
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);

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

  const mixSequences = () => {
    if (parentSpecies.length < 2) return;
    
    const parentDNAs = sequences
      .filter(seq => parentSpecies.includes(seq.name))
      .map(seq => seq.sequence);
    
    if (parentDNAs.length < 2) return;

    let mixedSequence = '';
    const length = Math.min(...parentDNAs.map(dna => dna.length));
    
    for (let i = 0; i < length; i++) {
      // 50% de chance de pegar de cada pai
      const parentIndex = Math.random() < 0.5 ? 0 : 1;
      mixedSequence += parentDNAs[parentIndex][i];
    }

    setCurrentSequence(mixedSequence);
  };

  const validateDNASequence = (sequence: string) => {
    const cleanSequence = sequence.toUpperCase().replace(/[^ATCG]/g, '');
    if (cleanSequence.length === 0) {
      return { isValid: false, error: 'A sequência deve conter apenas as bases A, T, C e G' };
    }
    if (cleanSequence !== sequence.toUpperCase()) {
      return { isValid: true, warning: 'Alguns caracteres inválidos foram removidos', sequence: cleanSequence };
    }
    return { isValid: true, sequence: cleanSequence };
  };

  const handlePasteSequence = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sequence = event.target.value;
    setPasteError(null);
    
    const validation = validateDNASequence(sequence);
    if (!validation.isValid) {
      setPasteError(validation.error);
      return;
    }
    
    setCurrentSequence(validation.sequence);
    if (validation.warning) {
      setPasteError(validation.warning);
    }
  };

  const analyzeSequence = async () => {
    if (!currentSequence) return;
    setIsAnalyzing(true);

    try {
      // Análise local de padrões
      const traits: string[] = [];
      Object.entries(DNA_PATTERNS).forEach(([pattern, trait]) => {
        if (currentSequence.includes(pattern)) {
          traits.push(trait);
        }
      });

      // Gerar nome científico
      const prefix = SCIENTIFIC_PREFIXES[Math.floor(Math.random() * SCIENTIFIC_PREFIXES.length)];
      const suffix = SCIENTIFIC_SUFFIXES[Math.floor(Math.random() * SCIENTIFIC_SUFFIXES.length)];
      const scientificName = `${prefix}${suffix} ${currentSequence.substring(0, 4).toLowerCase()}`;

      // Análise com IA
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Com base nesta sequência de DNA: ${currentSequence}
              
              Crie uma criatura fictícia com as seguintes características já identificadas:
              ${traits.join(', ')}
              
              Responda em formato JSON com os campos:
              {
                "name": "Nome comum da espécie",
                "description": "Descrição física detalhada",
                "habitat": "Ambiente onde vive",
                "size": "Tamanho aproximado",
                "diet": "Tipo de alimentação",
                "behavior": "Comportamento característico"
              }
              
              Seja criativo e mantenha consistência com os traços genéticos identificados.`
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
        scientificName,
        description: analysis.description,
        traits,
        habitat: analysis.habitat,
        size: analysis.size,
        diet: analysis.diet,
        behavior: analysis.behavior,
        parentSpecies: parentSpecies.length > 0 ? [...parentSpecies] : undefined
      }]);

      setCurrentSequence('');
      setParentSpecies([]);
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
                  <li>A IA analisará e criará espécies únicas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Padrões Especiais</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>ATAT: Resistência térmica</li>
                  <li>GCGC: Regeneração</li>
                  <li>TGCA: Adaptabilidade</li>
                  <li>E muito mais!</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Análise Detalhada</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Nome científico único</li>
                  <li>Características físicas</li>
                  <li>Habitat e comportamento</li>
                  <li>Traços especiais</li>
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
              <li>A IA criará uma espécie única baseada no DNA</li>
              <li>Observe padrões especiais que geram traços únicos</li>
              <li>Explore diferentes combinações para resultados diversos</li>
            </ul>
          </div>
        )}
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowPasteInput(!showPasteInput)}
            className={`bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              showPasteInput ? 'bg-purple-600' : ''
            }`}
          >
            {showPasteInput ? <ClipboardCheck className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
            {showPasteInput ? 'Fechar' : 'Colar Sequência'}
          </button>
          
          {['A', 'T', 'C', 'G'].map(nucleotide => (
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
          {parentSpecies.length >= 2 && (
            <button
              onClick={mixSequences}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Misturar DNAs
            </button>
          )}
        </div>

        {showPasteInput && (
          <div className="mb-4">
            <textarea
              placeholder="Cole aqui sua sequência de DNA (apenas bases A, T, C, G)..."
              className="w-full bg-black/30 rounded-lg p-4 font-mono text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              onChange={handlePasteSequence}
            />
            {pasteError && (
              <p className={`mt-2 text-sm ${pasteError.includes('removidos') ? 'text-yellow-400' : 'text-red-400'}`}>
                {pasteError}
              </p>
            )}
          </div>
        )}

        <div className="bg-black/30 p-4 rounded-lg font-mono mb-4">
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-purple-300">Espécies Selecionadas:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {parentSpecies.map((species, index) => (
                <span key={index} className="bg-purple-500/30 px-2 py-1 rounded text-sm">
                  {species}
                </span>
              ))}
            </div>
          </div>
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
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <h4 className="text-lg font-semibold text-purple-300">{seq.name}</h4>
                    <span className="text-sm text-purple-400 italic">{seq.scientificName}</span>
                  </div>
                  <p className="font-mono text-sm mt-2 text-blue-300">{seq.sequence}</p>
                  <p className="text-sm mt-2">{seq.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h5 className="font-semibold text-purple-200">Habitat</h5>
                      <p className="text-sm">{seq.habitat}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-purple-200">Tamanho</h5>
                      <p className="text-sm">{seq.size}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-purple-200">Alimentação</h5>
                      <p className="text-sm">{seq.diet}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-purple-200">Comportamento</h5>
                      <p className="text-sm">{seq.behavior}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-semibold text-purple-200 mb-2">Traços Especiais</h5>
                    <div className="flex flex-wrap gap-2">
                      {seq.traits.map((trait, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteSequence(seq.id)}
                  className="text-red-400 hover:text-red-300 transition ml-4"
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