import React, { useState } from 'react';
import { Dna, FlaskRound as Flask, Atom, Book, HelpCircle, Info, Sparkles, Trash2, Plus, Clipboard, ClipboardCheck, User, Zap, Heart, Brain, Flame } from 'lucide-react';
import AIChat from './AIChat';

// Constantes existentes
const NUCLEOTIDES = ['A', 'T', 'C', 'G'];

// Organizando as características em categorias
const DNA_TRAITS = {
  PHYSICAL: {
    // Altura
    'TGAC': { name: 'Alto (HMGA2+)', category: 'Altura', icon: 'arrow-up' },
    'CGTA': { name: 'Médio (GH1 normal)', category: 'Altura', icon: 'arrow-right' },
    'ATCG': { name: 'Baixo (FGFR3 variante)', category: 'Altura', icon: 'arrow-down' },
    
    // Olhos
    'GGTA': { name: 'Olhos Castanhos (OCA2+)', category: 'Olhos', icon: 'eye' },
    'AAGT': { name: 'Olhos Verdes (HERC2 variante)', category: 'Olhos', icon: 'eye' },
    'TTAG': { name: 'Olhos Azuis (OCA2-)', category: 'Olhos', icon: 'eye' },
    'CCAG': { name: 'Olhos Pretos (OCA2++)', category: 'Olhos', icon: 'eye' },
    
    // Cabelo - Cor
    'GCTA': { name: 'Cabelo Preto (MC1R+)', category: 'Cor do Cabelo', icon: 'scissors' },
    'ACTG': { name: 'Cabelo Loiro (KITLG+)', category: 'Cor do Cabelo', icon: 'scissors' },
    'TAGC': { name: 'Cabelo Ruivo (MC1R variante)', category: 'Cor do Cabelo', icon: 'scissors' },
    'CATG': { name: 'Cabelo Castanho (MC1R normal)', category: 'Cor do Cabelo', icon: 'scissors' },
    
    // Cabelo - Tipo
    'GTAC': { name: 'Cabelo Liso (TCHH+)', category: 'Tipo de Cabelo', icon: 'scissors' },
    'ACGT': { name: 'Cabelo Ondulado (TCHH variante)', category: 'Tipo de Cabelo', icon: 'scissors' },
    'TGCA': { name: 'Cabelo Cacheado (EDAR+)', category: 'Tipo de Cabelo', icon: 'scissors' },
    'CAGT': { name: 'Cabelo Crespo (WNT10A+)', category: 'Tipo de Cabelo', icon: 'scissors' },
    
    // Pele
    'GATC': { name: 'Pele Clara (SLC24A5+)', category: 'Tom de Pele', icon: 'sun' },
    'TCGA': { name: 'Pele Média (SLC45A2 normal)', category: 'Tom de Pele', icon: 'sun' },
    'AGCT': { name: 'Pele Escura (TYR+)', category: 'Tom de Pele', icon: 'sun' },
    
    // Características Faciais
    'CTAG': { name: 'Rosto Oval (PAX3+)', category: 'Formato do Rosto', icon: 'user' },
    'GACT': { name: 'Rosto Quadrado (COL11A1+)', category: 'Formato do Rosto', icon: 'user' },
    'TGAC': { name: 'Rosto Redondo (PAX3 variante)', category: 'Formato do Rosto', icon: 'user' },
    
    // Características Especiais
    'CGAT': { name: 'Tendência a Sardas (MC1R+)', category: 'Características Especiais', icon: 'sparkles' },
    'ATGC': { name: 'Sem Sardas (MC1R-)', category: 'Características Especiais', icon: 'sparkles' }
  },
  
  HEALTH_PREDISPOSITION: {
    // Visão
    'GCTA': { name: 'Tendência à Miopia (GJD2+)', category: 'Visão', icon: 'eye' },
    'TACG': { name: 'Visão Normal (ZIC2 normal)', category: 'Visão', icon: 'eye' },
    'AGCT': { name: 'Tendência à Hipermetropia (GJD2-)', category: 'Visão', icon: 'eye' },
    
    // Metabolismo
    'CATG': { name: 'Metabolismo Acelerado (FTO-)', category: 'Metabolismo', icon: 'zap' },
    'GTCA': { name: 'Metabolismo Normal (MC4R normal)', category: 'Metabolismo', icon: 'zap' },
    'TCAG': { name: 'Metabolismo Lento (FTO+)', category: 'Metabolismo', icon: 'zap' },
    
    // Calvície
    'ACTG': { name: 'Baixo Risco de Calvície (AR-)', category: 'Calvície', icon: 'user' },
    'GTAC': { name: 'Risco Moderado (EDA2R normal)', category: 'Calvície', icon: 'user' },
    'CAGT': { name: 'Alto Risco de Calvície (AR+)', category: 'Calvície', icon: 'user' }
  },
  
  ABILITIES: {
    'ATAT': { name: 'Resistência a temperaturas extremas', category: 'Resistência', icon: 'thermometer' },
    'GCGC': { name: 'Alta capacidade de regeneração', category: 'Regeneração', icon: 'refresh-cw' },
    'TGCA': { name: 'Adaptação a diferentes ambientes', category: 'Adaptação', icon: 'globe' },
    'AAAA': { name: 'Pigmentação intensa', category: 'Aparência', icon: 'palette' },
    'GGGG': { name: 'Força muscular aumentada', category: 'Força', icon: 'dumbbell' },
    'CCCC': { name: 'Sistema imunológico robusto', category: 'Saúde', icon: 'shield' },
    'TTTT': { name: 'Longevidade elevada', category: 'Vida', icon: 'clock' }
  }
};

// Interface para traços selecionados
interface SelectedTrait {
  sequence: string;
  name: string;
  category: string;
}

// Interfaces existentes...
interface DNASequence {
  id: string;
  sequence: string;
  name: string;
  scientificName: string;
  description: string;
  traits: string[];
  physicalTraits?: {
    height?: string;
    eyeColor?: string;
    hairColor?: string;
    hairType?: string;
    skinTone?: string;
    faceShape?: string;
    specialFeatures?: string[];
    bodyType?: string;
    facialFeatures?: string[];
    geneticPredispositions?: string[];
  };
  habitat: string;
  size: string;
  diet: string;
  behavior: string;
  parentSpecies?: string[];
}

interface PhysicalAnalysis {
  height: string;
  eyeColor: string;
  hairColor: string;
  hairType: string;
  skinTone: string;
  faceShape: string;
  specialFeatures: string[];
  bodyType: string;
  facialFeatures: string[];
  geneticPredispositions: string[];
}

export default function DNABuilder() {
  const [sequences, setSequences] = useState<DNASequence[]>([]);
  const [currentSequence, setCurrentSequence] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [physicalAnalysis, setPhysicalAnalysis] = useState<PhysicalAnalysis | null>(null);
  const [activeCategory, setActiveCategory] = useState<'PHYSICAL' | 'HEALTH_PREDISPOSITION' | 'ABILITIES'>('PHYSICAL');

  // Função para adicionar um traço
  const addTrait = (sequence: string, name: string, category: string) => {
    setSelectedTraits(prev => [...prev, { sequence, name, category }]);
    setCurrentSequence(prev => prev + sequence);
    setPhysicalAnalysis(null);
  };

  // Função para remover um traço
  const removeTrait = (index: number) => {
    const trait = selectedTraits[index];
    setSelectedTraits(prev => prev.filter((_, i) => i !== index));
    setCurrentSequence(prev => prev.replace(trait.sequence, ''));
    setPhysicalAnalysis(null);
  };

  // Funções existentes...
  const analyzePhysicalTraits = async (dnaSequence: string) => {
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
              text: `Analise esta sequência de DNA: ${dnaSequence}

              Com base nos padrões genéticos conhecidos, forneça uma análise detalhada das possíveis características físicas.
              Responda em formato JSON com os seguintes campos:
              {
                "height": "Altura estimada e constituição",
                "eyeColor": "Cor dos olhos mais provável",
                "hairColor": "Cor e tipo de cabelo",
                "hairType": "Tipo de cabelo (liso, ondulado, cacheado, crespo)",
                "skinTone": "Tom de pele",
                "faceShape": "Formato do rosto",
                "specialFeatures": ["Lista de características especiais como sardas"],
                "bodyType": "Tipo corporal",
                "facialFeatures": ["Lista de características faciais"],
                "geneticPredispositions": ["Lista de predisposições genéticas"]
              }

              Seja específico e baseie sua análise em padrões genéticos conhecidos.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na análise física');
      }

      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Erro na análise:', error);
      return null;
    }
  };

  const addNucleotide = (nucleotide: string) => {
    setCurrentSequence(prev => prev + nucleotide);
    setPhysicalAnalysis(null);
  };

  const generateRandomSequence = () => {
    const length = Math.floor(Math.random() * 20) + 10;
    let sequence = '';
    for (let i = 0; i < length; i++) {
      sequence += NUCLEOTIDES[Math.floor(Math.random() * NUCLEOTIDES.length)];
    }
    setCurrentSequence(sequence);
    setPhysicalAnalysis(null);
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
    setPhysicalAnalysis(null);
    
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
      const physicalTraits = await analyzePhysicalTraits(currentSequence);
      setPhysicalAnalysis(physicalTraits);

      const traits = selectedTraits.map(trait => trait.name);

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
        scientificName: `Species ${currentSequence.substring(0, 4).toLowerCase()}`,
        description: analysis.description,
        traits,
        physicalTraits,
        habitat: analysis.habitat,
        size: analysis.size,
        diet: analysis.diet,
        behavior: analysis.behavior
      }]);

      setCurrentSequence('');
      setSelectedTraits([]);
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
    Atue como um especialista em genética e biologia molecular, com foco em análise de características físicas baseadas em DNA.
    
    Contexto atual:
    - Sequência atual: ${currentSequence}
    - Traços selecionados: ${selectedTraits.map(t => t.name).join(', ')}
    - Sequências salvas: ${sequences.map(s => s.sequence).join(', ')}
    
    Forneça:
    1. Análise detalhada de características físicas
    2. Explicações sobre padrões de DNA
    3. Correlações entre genes e traços físicos
    4. Possíveis variações e mutações
    
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dna className="w-6 h-6" />
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
                <h4 className="font-semibold text-blue-200">1. Características Físicas</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li><span className="text-blue-300">Altura e Constituição</span> - Genes HMGA2, FGFR3, GH1</li>
                  <li><span className="text-blue-300">Olhos e Visão</span> - Genes OCA2, HERC2, GJD2</li>
                  <li><span className="text-blue-300">Cabelo</span> - Cor (MC1R, KITLG) e Tipo (TCHH, EDAR)</li>
                  <li><span className="text-blue-300">Pele</span> - Genes SLC24A5, TYR para pigmentação</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Predisposições</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Metabolismo e peso (FTO, MC4R)</li>
                  <li>Visão (GJD2, ZIC2)</li>
                  <li>Calvície (AR, EDA2R)</li>
                  <li>Características especiais (sardas, etc.)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Como Usar</h4>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Selecione características desejadas</li>
                  <li>Combine diferentes traços</li>
                  <li>Analise o resultado genético</li>
                  <li>Explore variações e mutações</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar o Construtor de DNA:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Selecione características clicando nos botões</li>
              <li>Combine diferentes traços para criar sequências únicas</li>
              <li>Analise o resultado para ver as características</li>
              <li>Use o assistente IA para entender melhor as combinações</li>
            </ul>
          </div>
        )}

        {/* Categorias de traços */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveCategory('PHYSICAL')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeCategory === 'PHYSICAL' ? 'bg-purple-500' : 'bg-black/30 hover:bg-black/40'
            }`}
          >
            <User className="w-4 h-4" />
            Características Físicas
          </button>
          <button
            onClick={() => setActiveCategory('HEALTH_PREDISPOSITION')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeCategory === 'HEALTH_PREDISPOSITION' ? 'bg-purple-500' : 'bg-black/30 hover:bg-black/40'
            }`}
          >
            <Heart className="w-4 h-4" />
            Predisposições
          </button>
          <button
            onClick={() => setActiveCategory('ABILITIES')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeCategory === 'ABILITIES' ? 'bg-purple-500' : 'bg-black/30 hover:bg-black/40'
            }`}
          >
            <Zap className="w-4 h-4" />
            Habilidades
          </button>
        </div>

        {/* Botões de traços */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {Object.entries(DNA_TRAITS[activeCategory]).map(([sequence, trait]) => (
            <button
              key={sequence}
              onClick={() => addTrait(sequence, trait.name, trait.category)}
              className="bg-black/30 hover:bg-black/40 p-3 rounded-lg text-sm transition flex flex-col items-center gap-2"
            >
              <span className="font-mono text-purple-300">{sequence}</span>
              <span>{trait.name}</span>
              <span className="text-xs text-purple-200">{trait.category}</span>
            </button>
          ))}
        </div>

        {/* Traços selecionados */}
        {selectedTraits.length > 0 && (
          <div className="bg-black/30 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Traços Selecionados:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTraits.map((trait, index) => (
                <div
                  key={index}
                  className="bg-purple-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span className="font-mono text-purple-300">{trait.sequence}</span>
                  <span>{trait.name}</span>
                  <button
                    onClick={() => removeTrait(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
          <p className="text-xl tracking-wider">{currentSequence || 'Comece a construir sua sequência...'}</p>
        </div>

        {physicalAnalysis && (
          <div className="bg-black/30 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Análise de Características Físicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-purple-200">Características Básicas</h4>
                <ul className="space-y-2 mt-2">
                  <li><span className="text-purple-300">Altura:</span> {physicalAnalysis.height}</li>
                  <li><span className="text-purple-300">Cor dos Olhos:</span> {physicalAnalysis.eyeColor}</li>
                  <li><span className="text-purple-300">Cor do Cabelo:</span> {physicalAnalysis.hairColor}</li>
                  <li><span className="text-purple-300">Tipo de Cabelo:</span> {physicalAnalysis.hairType}</li>
                  <li><span className="text-purple-300">Tom de Pele:</span> {physicalAnalysis.skinTone}</li>
                  <li><span className="text-purple-300">Formato do Rosto:</span> {physicalAnalysis.faceShape}</li>
                  <li><span className="text-purple-300">Tipo Corporal:</span> {physicalAnalysis.bodyType}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-200">Características Detalhadas</h4>
                <div className="space-y-3 mt-2">
                  <div>
                    <h5 className="text-purple-300">Características Especiais:</h5>
                    <ul className="list-disc list-inside">
                      {physicalAnalysis.specialFeatures.map((feature, index) => (
                        <li key={index} className="text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-purple-300">Traços Faciais:</h5>
                    <ul className="list-disc list-inside">
                      {physicalAnalysis.facialFeatures.map((feature, index) => (
                        <li key={index} className="text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-purple-300">Predisposições Genéticas:</h5>
                    <ul className="list-disc list-inside">
                      {physicalAnalysis.geneticPredispositions.map((predisposition, index) => (
                        <li key={index} className="text-sm">{predisposition}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={analyzeSequence}
          disabled={!currentSequence || isAnalyzing}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
        >
          <Dna className="w-5 h-5" />
          {isAnalyzing ? 'Analisando...' : 'Analisar Sequência'}
        </button>
      </div>

      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Sequências Analisadas</h3>
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

                  {seq.physicalTraits && (
                    <div className="mt-4 bg-black/20 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-200 mb-3">Características Físicas</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm"><span className="text-purple-300">Altura:</span> {seq.physicalTraits.height}</p>
                          <p className="text-sm"><span className="text-purple-300">Olhos:</span> {seq.physicalTraits.eyeColor}</p>
                          <p className="text-sm"><span className="text-purple-300">Cabelo:</span> {seq.physicalTraits.hairColor}</p>
                          <p className="text-sm"><span className="text-purple-300">Tipo de Cabelo:</span> {seq.physicalTraits.hairType}</p>
                          <p className="text-sm"><span className="text-purple-300">Pele:</span> {seq.physicalTraits.skinTone}</p>
                          <p className="text-sm"><span className="text-purple-300">Formato do Rosto:</span> {seq.physicalTraits.faceShape}</p>
                        </div>
                        <div>
                          <div className="text-sm mt-2">
                            <span className="text-purple-300">Características Especiais:</span>
                            <ul className="list-disc list-inside mt-1">
                              {seq.physicalTraits.specialFeatures?.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-sm mt-2">
                            <span className="text-purple-300">Traços Faciais:</span>
                            <ul className="list-disc list-inside mt-1">
                              {seq.physicalTraits.facialFeatures?.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
            <p className="text-white/70 italic">Nenhuma sequência analisada ainda</p>
          )}
        </div>
      </div>

      <AIChat
        initialMessage="Olá! Sou seu assistente de análise de DNA. Posso ajudar você a entender as características físicas e genéticas de qualquer sequência de DNA. O que você gostaria de analisar?"
        generatePrompt={generateDNAPrompt}
        autoSpeak={true}
      />
    </div>
  );
}
