import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Info, Dna as DnaIcon, Sparkles, Skull, Bird, Fish, Dog } from 'lucide-react';
import AIChat from './AIChat';

// Sequências de DNA reais/simuladas para diferentes espécies
const PREDEFINED_SEQUENCES = {
  // Dinossauros
  dinossauros: [
    {
      name: 'Tyrannosaurus Rex',
      sequence: 'ATGCCGTACAGGCTAATCGCTAGCTAGATCGATCGATCGTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAA',
      description: 'Grande predador do Cretáceo',
      category: 'Dinossauro'
    },
    {
      name: 'Velociraptor',
      sequence: 'GCTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAATGCCGTACAGGCTAATCGCTAGCTAGATCGATCGAT',
      description: 'Predador ágil e inteligente',
      category: 'Dinossauro'
    },
    {
      name: 'Brachiosaurus',
      sequence: 'TAGCTGATCGATCGTAGCTAGCTAAGCTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAATGCCGTACAGG',
      description: 'Herbívoro de pescoço longo',
      category: 'Dinossauro'
    }
  ],
  // Animais Modernos
  modernos: [
    {
      name: 'Leão',
      sequence: 'CTAGCTGATCGATCGTAGCTAGCTAATGCCGTACAGGCTAATCGCTAGCTAGATCGATCGATCGTAGCTAG',
      description: 'Rei da selva',
      category: 'Felino'
    },
    {
      name: 'Águia',
      sequence: 'GATCGATCGTAGCTAGCTAATGCCGTACAGGCTAATCGCTAGCTAGATCGATCGATCGTAGCTAGCTAGCT',
      description: 'Ave de rapina',
      category: 'Ave'
    },
    {
      name: 'Tubarão Branco',
      sequence: 'CGATCGATCGTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAATGCCGTACAGGCTAATCGCTAGCTAGAT',
      description: 'Predador marinho',
      category: 'Peixe'
    }
  ],
  // Criaturas Híbridas Teóricas
  hibridos: [
    {
      name: 'Aquila Rex',
      sequence: 'ATGCCGTACAGGCTAATCGCTAGCTAGATCGATCGATCGTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAA',
      description: 'Híbrido teórico de Águia e T-Rex',
      category: 'Híbrido'
    },
    {
      name: 'Felis Raptor',
      sequence: 'GCTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAATGCCGTACAGGCTAATCGCTAGCTAGATCGATCGAT',
      description: 'Híbrido teórico de Felino e Velociraptor',
      category: 'Híbrido'
    }
  ]
};

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
  'TATA': 'Reprodução rápida',
  'CGAT': 'Capacidade de camuflagem',
  'TAGC': 'Resistência a doenças',
  'GACT': 'Adaptabilidade climática',
  'CATA': 'Velocidade aumentada',
  'GTAC': 'Força física excepcional'
};

// Prefixos e sufixos para nomes científicos
const SCIENTIFIC_PREFIXES = [
  'Neo', 'Xeno', 'Mega', 'Ultra', 'Crypto', 'Proto', 'Hyper', 'Meta', 'Quantum', 'Bio',
  'Giga', 'Apex', 'Omega', 'Alpha', 'Delta'
];

const SCIENTIFIC_SUFFIXES = [
  'saurus', 'morph', 'raptor', 'titan', 'genesis', 'forma', 'species', 'zoa', 'phyta', 'bacteria',
  'rex', 'felis', 'dactyl', 'therium', 'pteros'
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

  const addNucleotide = (nucleotide: string) => {
    setCurrentSequence(prev => prev + nucleotide);
  };

  const selectPresetSequence = (sequence: typeof PREDEFINED_SEQUENCES[keyof typeof PREDEFINED_SEQUENCES][0]) => {
    setCurrentSequence(sequence.sequence);
    setParentSpecies(prev => [...prev, sequence.name]);
  };

  const generateRandomSequence = () => {
    const length = Math.floor(Math.random() * 20) + 10; // 10-30 bases
    let sequence = '';
    for (let i = 0; i < length; i++) {
      sequence += ['A', 'T', 'C', 'G'][Math.floor(Math.random() * 4)];
    }
    setCurrentSequence(sequence);
  };

  const mixSequences = () => {
    if (parentSpecies.length < 2) return;
    
    const sequences = parentSpecies.map(name => {
      const allSequences = [...PREDEFINED_SEQUENCES.dinossauros, ...PREDEFINED_SEQUENCES.modernos, ...PREDEFINED_SEQUENCES.hibridos];
      return allSequences.find(s => s.name === name)?.sequence || '';
    }).filter(Boolean);

    if (sequences.length < 2) return;

    // Criar uma sequência híbrida misturando partes das sequências parentais
    let hybridSequence = '';
    const maxLength = Math.max(...sequences.map(s => s.length));
    
    for (let i = 0; i < maxLength; i++) {
      const validBases = sequences
        .map(s => s[i])
        .filter(Boolean);
      
      if (validBases.length > 0) {
        hybridSequence += validBases[Math.floor(Math.random() * validBases.length)];
      }
    }

    setCurrentSequence(hybridSequence);
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
              
              Crie uma criatura híbrida considerando as espécies parentais: ${parentSpecies.join(', ')}
              
              Características já identificadas:
              ${traits.join(', ')}
              
              Responda em formato JSON com os campos:
              {
                "name": "Nome comum da espécie híbrida",
                "description": "Descrição física detalhada",
                "habitat": "Ambiente onde vive",
                "size": "Tamanho aproximado",
                "diet": "Tipo de alimentação",
                "behavior": "Comportamento característico"
              }
              
              Seja criativo e mantenha consistência com os traços genéticos identificados e as espécies parentais.`
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
        parentSpecies: [...parentSpecies]
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
    Atue como um especialista em genética e biologia molecular, focando em evolução e hibridização de espécies.
    
    Contexto atual:
    - Sequência atual: ${currentSequence}
    - Espécies parentais: ${parentSpecies.join(', ')}
    - Sequências salvas: ${sequences.map(s => s.sequence).join(', ')}
    
    Forneça:
    1. Análise da viabilidade da hibridização
    2. Possíveis características da criatura resultante
    3. Comparação com espécies existentes
    4. Adaptações necessárias para sobrevivência
    
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DnaIcon className="w-6 h-6" />
            Simulador de DNA e Hibridização
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
                <h4 className="font-semibold text-blue-200">1. Seleção de Espécies</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Escolha espécies predefinidas</li>
                  <li>Combine diferentes espécies</li>
                  <li>Analise sequências de DNA</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Hibridização</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Selecione duas ou mais espécies</li>
                  <li>Combine seus DNAs</li>
                  <li>Analise resultados possíveis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Análise de Resultados</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Características da nova espécie</li>
                  <li>Traços herdados</li>
                  <li>Viabilidade da criatura</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar o Simulador:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Selecione espécies predefinidas ou crie sequências manualmente</li>
              <li>Combine diferentes espécies para criar híbridos</li>
              <li>Analise as características resultantes</li>
              <li>Explore possibilidades evolutivas</li>
            </ul>
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('dinossauros')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                selectedCategory === 'dinossauros'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/30 text-white/70 hover:bg-black/40'
              }`}
            >
              <Skull className="w-5 h-5" />
              Dinossauros
            </button>
            <button
              onClick={() => setSelectedCategory('modernos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                selectedCategory === 'modernos'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/30 text-white/70 hover:bg-black/40'
              }`}
            >
              <Dog className="w-5 h-5" />
              Animais Modernos
            </button>
            <button
              onClick={() => setSelectedCategory('hibridos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                selectedCategory === 'hibridos'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/30 text-white/70 hover:bg-black/40'
              }`}
            >
              <DnaIcon className="w-5 h-5" />
              Híbridos
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {PREDEFINED_SEQUENCES[selectedCategory].map((species, index) => (
              <button
                key={index}
                onClick={() => selectPresetSequence(species)}
                className={`bg-black/30 p-4 rounded-lg text-left hover:bg-black/40 transition ${
                  parentSpecies.includes(species.name) ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <h4 className="font-semibold text-purple-300">{species.name}</h4>
                <p className="text-sm text-white/70">{species.description}</p>
                <p className="text-xs font-mono mt-2 text-blue-300 truncate">
                  {species.sequence}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
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
                  
                  {seq.parentSpecies && seq.parentSpecies.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold text-purple-200">Espécies Parentais:</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {seq.parentSpecies.map((parent, index) => (
                          <span key={index} className="bg-purple-500/30 px-2 py-1 rounded text-sm">
                            {parent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
        initialMessage="Olá! Sou seu assistente de simulação de DNA e hibridização de espécies. Posso ajudar você a entender as combinações de DNA, prever características de híbridos e explorar possibilidades evolutivas. O que você gostaria de explorar?"
        generatePrompt={generateDNAPrompt}
        autoSpeak={true}
      />
    </div>
  );
}