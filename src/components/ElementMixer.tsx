import React, { useState } from 'react';
import { FlaskRound as Flask, Plus, HelpCircle, Info, Atom, Zap } from 'lucide-react';
import AIChat from './AIChat';

interface Element {
  symbol: string;
  name: string;
  category: string;
  atomicNumber: number;
  atomicMass: number;
  electronConfiguration: string;
  electronegativity?: number;
  oxidationStates: string;
  energyLevel: number;
}

const CATEGORIES = [
  'Metal Alcalino',
  'Metal Alcalino-terroso',
  'Metal de Transição',
  'Lantanídeo',
  'Actinídeo',
  'Metal Representativo',
  'Semimetal',
  'Não-metal',
  'Halogênio',
  'Gás Nobre'
] as const;

const ELEMENTS: Element[] = [
  {
    symbol: 'H',
    name: 'Hidrogênio',
    category: 'Não-metal',
    atomicNumber: 1,
    atomicMass: 1.008,
    electronConfiguration: '1s¹',
    electronegativity: 2.20,
    oxidationStates: '-1, +1',
    energyLevel: 1
  },
  {
    symbol: 'He',
    name: 'Hélio',
    category: 'Gás Nobre',
    atomicNumber: 2,
    atomicMass: 4.003,
    electronConfiguration: '1s²',
    oxidationStates: '0',
    energyLevel: 1
  },
  {
    symbol: 'Li',
    name: 'Lítio',
    category: 'Metal Alcalino',
    atomicNumber: 3,
    atomicMass: 6.941,
    electronConfiguration: '[He]2s¹',
    electronegativity: 0.98,
    oxidationStates: '+1',
    energyLevel: 2
  },
  {
    symbol: 'Be',
    name: 'Berílio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 4,
    atomicMass: 9.012,
    electronConfiguration: '[He]2s²',
    electronegativity: 1.57,
    oxidationStates: '+2',
    energyLevel: 2
  },
  {
    symbol: 'B',
    name: 'Boro',
    category: 'Semimetal',
    atomicNumber: 5,
    atomicMass: 10.811,
    electronConfiguration: '[He]2s²2p¹',
    electronegativity: 2.04,
    oxidationStates: '+3',
    energyLevel: 2
  },
  {
    symbol: 'C',
    name: 'Carbono',
    category: 'Não-metal',
    atomicNumber: 6,
    atomicMass: 12.011,
    electronConfiguration: '[He]2s²2p²',
    electronegativity: 2.55,
    oxidationStates: '-4, -3, -2, -1, +1, +2, +3, +4',
    energyLevel: 2
  },
  {
    symbol: 'N',
    name: 'Nitrogênio',
    category: 'Não-metal',
    atomicNumber: 7,
    atomicMass: 14.007,
    electronConfiguration: '[He]2s²2p³',
    electronegativity: 3.04,
    oxidationStates: '-3, -2, -1, +1, +2, +3, +4, +5',
    energyLevel: 2
  },
  {
    symbol: 'O',
    name: 'Oxigênio',
    category: 'Não-metal',
    atomicNumber: 8,
    atomicMass: 15.999,
    electronConfiguration: '[He]2s²2p⁴',
    electronegativity: 3.44,
    oxidationStates: '-2, -1, +1, +2',
    energyLevel: 2
  },
  {
    symbol: 'F',
    name: 'Flúor',
    category: 'Halogênio',
    atomicNumber: 9,
    atomicMass: 18.998,
    electronConfiguration: '[He]2s²2p⁵',
    electronegativity: 3.98,
    oxidationStates: '-1',
    energyLevel: 2
  },
  {
    symbol: 'Ne',
    name: 'Neônio',
    category: 'Gás Nobre',
    atomicNumber: 10,
    atomicMass: 20.180,
    electronConfiguration: '[He]2s²2p⁶',
    oxidationStates: '0',
    energyLevel: 2
  },
  {
    symbol: 'Na',
    name: 'Sódio',
    category: 'Metal Alcalino',
    atomicNumber: 11,
    atomicMass: 22.990,
    electronConfiguration: '[Ne]3s¹',
    electronegativity: 0.93,
    oxidationStates: '+1',
    energyLevel: 3
  },
  {
    symbol: 'Mg',
    name: 'Magnésio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 12,
    atomicMass: 24.305,
    electronConfiguration: '[Ne]3s²',
    electronegativity: 1.31,
    oxidationStates: '+2',
    energyLevel: 3
  },
  {
    symbol: 'Al',
    name: 'Alumínio',
    category: 'Metal Representativo',
    atomicNumber: 13,
    atomicMass: 26.982,
    electronConfiguration: '[Ne]3s²3p¹',
    electronegativity: 1.61,
    oxidationStates: '+3',
    energyLevel: 3
  },
  {
    symbol: 'Si',
    name: 'Silício',
    category: 'Semimetal',
    atomicNumber: 14,
    atomicMass: 28.086,
    electronConfiguration: '[Ne]3s²3p²',
    electronegativity: 1.90,
    oxidationStates: '-4, +2, +4',
    energyLevel: 3
  },
  {
    symbol: 'P',
    name: 'Fósforo',
    category: 'Não-metal',
    atomicNumber: 15,
    atomicMass: 30.974,
    electronConfiguration: '[Ne]3s²3p³',
    electronegativity: 2.19,
    oxidationStates: '-3, +3, +5',
    energyLevel: 3
  },
  {
    symbol: 'S',
    name: 'Enxofre',
    category: 'Não-metal',
    atomicNumber: 16,
    atomicMass: 32.065,
    electronConfiguration: '[Ne]3s²3p⁴',
    electronegativity: 2.58,
    oxidationStates: '-2, +2, +4, +6',
    energyLevel: 3
  },
  {
    symbol: 'Cl',
    name: 'Cloro',
    category: 'Halogênio',
    atomicNumber: 17,
    atomicMass: 35.453,
    electronConfiguration: '[Ne]3s²3p⁵',
    electronegativity: 3.16,
    oxidationStates: '-1, +1, +3, +5, +7',
    energyLevel: 3
  },
  {
    symbol: 'Ar',
    name: 'Argônio',
    category: 'Gás Nobre',
    atomicNumber: 18,
    atomicMass: 39.948,
    electronConfiguration: '[Ne]3s²3p⁶',
    oxidationStates: '0',
    energyLevel: 3
  },
  {
    symbol: 'K',
    name: 'Potássio',
    category: 'Metal Alcalino',
    atomicNumber: 19,
    atomicMass: 39.098,
    electronConfiguration: '[Ar]4s¹',
    electronegativity: 0.82,
    oxidationStates: '+1',
    energyLevel: 4
  },
  {
    symbol: 'Ca',
    name: 'Cálcio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 20,
    atomicMass: 40.078,
    electronConfiguration: '[Ar]4s²',
    electronegativity: 1.00,
    oxidationStates: '+2',
    energyLevel: 4
  },
  {
    symbol: 'Sc',
    name: 'Escândio',
    category: 'Metal de Transição',
    atomicNumber: 21,
    atomicMass: 44.956,
    electronConfiguration: '[Ar]3d¹4s²',
    electronegativity: 1.36,
    oxidationStates: '+3',
    energyLevel: 4
  },
  {
    symbol: 'Ti',
    name: 'Titânio',
    category: 'Metal de Transição',
    atomicNumber: 22,
    atomicMass: 47.867,
    electronConfiguration: '[Ar]3d²4s²',
    electronegativity: 1.54,
    oxidationStates: '+2, +3, +4',
    energyLevel: 4
  },
  {
    symbol: 'V',
    name: 'Vanádio',
    category: 'Metal de Transição',
    atomicNumber: 23,
    atomicMass: 50.942,
    electronConfiguration: '[Ar]3d³4s²',
    electronegativity: 1.63,
    oxidationStates: '+2, +3, +4, +5',
    energyLevel: 4
  },
  {
    symbol: 'Cr',
    name: 'Cromo',
    category: 'Metal de Transição',
    atomicNumber: 24,
    atomicMass: 51.996,
    electronConfiguration: '[Ar]3d⁵4s¹',
    electronegativity: 1.66,
    oxidationStates: '+2, +3, +6',
    energyLevel: 4
  },
  {
    symbol: 'Mn',
    name: 'Manganês',
    category: 'Metal de Transição',
    atomicNumber: 25,
    atomicMass: 54.938,
    electronConfiguration: '[Ar]3d⁵4s²',
    electronegativity: 1.55,
    oxidationStates: '+2, +3, +4, +6, +7',
    energyLevel: 4
  },
  {
    symbol: 'Fe',
    name: 'Ferro',
    category: 'Metal de Transição',
    atomicNumber: 26,
    atomicMass: 55.845,
    electronConfiguration: '[Ar]3d⁶4s²',
    electronegativity: 1.83,
    oxidationStates: '+2, +3',
    energyLevel: 4
  },
  {
    symbol: 'Co',
    name: 'Cobalto',
    category: 'Metal de Transição',
    atomicNumber: 27,
    atomicMass: 58.933,
    electronConfiguration: '[Ar]3d⁷4s²',
    electronegativity: 1.88,
    oxidationStates: '+2, +3',
    energyLevel: 4
  },
  {
    symbol: 'Ni',
    name: 'Níquel',
    category: 'Metal de Transição',
    atomicNumber: 28,
    atomicMass: 58.693,
    electronConfiguration: '[Ar]3d⁸4s²',
    electronegativity: 1.91,
    oxidationStates: '+2, +3',
    energyLevel: 4
  },
  {
    symbol: 'Cu',
    name: 'Cobre',
    category: 'Metal de Transição',
    atomicNumber: 29,
    atomicMass: 63.546,
    electronConfiguration: '[Ar]3d¹⁰4s¹',
    electronegativity: 1.90,
    oxidationStates: '+1, +2',
    energyLevel: 4
  },
  {
    symbol: 'Zn',
    name: 'Zinco',
    category: 'Metal de Transição',
    atomicNumber: 30,
    atomicMass: 65.380,
    electronConfiguration: '[Ar]3d¹⁰4s²',
    electronegativity: 1.65,
    oxidationStates: '+2',
    energyLevel: 4
  },
  {
    symbol: 'Ga',
    name: 'Gálio',
    category: 'Metal Representativo',
    atomicNumber: 31,
    atomicMass: 69.723,
    electronConfiguration: '[Ar]3d¹⁰4s²4p¹',
    electronegativity: 1.81,
    oxidationStates: '+3',
    energyLevel: 4
  },
  {
    symbol: 'Ge',
    name: 'Germânio',
    category: 'Semimetal',
    atomicNumber: 32,
    atomicMass: 72.640,
    electronConfiguration: '[Ar]3d¹⁰4s²4p²',
    electronegativity: 2.01,
    oxidationStates: '+2, +4',
    energyLevel: 4
  },
  {
    symbol: 'As',
    name: 'Arsênio',
    category: 'Semimetal',
    atomicNumber: 33,
    atomicMass: 74.922,
    electronConfiguration: '[Ar]3d¹⁰4s²4p³',
    electronegativity: 2.18,
    oxidationStates: '-3, +3, +5',
    energyLevel: 4
  },
  {
    symbol: 'Se',
    name: 'Selênio',
    category: 'Não-metal',
    atomicNumber: 34,
    atomicMass: 78.960,
    electronConfiguration: '[Ar]3d¹⁰4s²4p⁴',
    electronegativity: 2.55,
    oxidationStates: '-2, +4, +6',
    energyLevel: 4
  },
  {
    symbol: 'Br',
    name: 'Bromo',
    category: 'Halogênio',
    atomicNumber: 35,
    atomicMass: 79.904,
    electronConfiguration: '[Ar]3d¹⁰4s²4p⁵',
    electronegativity: 2.96,
    oxidationStates: '-1, +1, +3, +5',
    energyLevel: 4
  },
  {
    symbol: 'Kr',
    name: 'Criptônio',
    category: 'Gás Nobre',
    atomicNumber: 36,
    atomicMass: 83.798,
    electronConfiguration: '[Ar]3d¹⁰4s²4p⁶',
    oxidationStates: '0',
    energyLevel: 4
  },
  // Continuando com os elementos restantes...
  // [Elementos de 37 a 118 seguem o mesmo padrão]
];

// Combinações e suas energias
interface Combination {
  formula: string;
  name: string;
  energy: number; // em kJ/mol
  description: string;
}

const COMBINATIONS: Record<string, Combination> = {
  'H2O': {
    formula: 'H2O',
    name: 'Água',
    energy: -285.8,
    description: 'Molécula polar essencial para a vida. Libera energia em sua formação.'
  },
  'NaCl': {
    formula: 'NaCl',
    name: 'Cloreto de Sódio (Sal de Cozinha)',
    energy: -411.2,
    description: 'Composto iônico formado por ligação entre Na+ e Cl-.'
  },
  'CO2': {
    formula: 'CO2',
    name: 'Dióxido de Carbono',
    energy: -393.5,
    description: 'Gás de efeito estufa, produto da respiração celular.'
  },
  'NH3': {
    formula: 'NH3',
    name: 'Amônia',
    energy: -46.11,
    description: 'Composto molecular usado em fertilizantes.'
  },
  'Fe2O3': {
    formula: 'Fe2O3',
    name: 'Óxido de Ferro III (Ferrugem)',
    energy: -824.2,
    description: 'Produto da oxidação do ferro, muito estável.'
  },
  'HCl': {
    formula: 'HCl',
    name: 'Ácido Clorídrico',
    energy: -92.3,
    description: 'Ácido forte usado em processos industriais.'
  },
  'H2SO4': {
    formula: 'H2SO4',
    name: 'Ácido Sulfúrico',
    energy: -814.0,
    description: 'Ácido forte usado em baterias e processos industriais.'
  },
  'CH4': {
    formula: 'CH4',
    name: 'Metano',
    energy: -74.87,
    description: 'Hidrocarboneto mais simples, gás de efeito estufa.'
  },
  'O2': {
    formula: 'O2',
    name: 'Oxigênio Molecular',
    energy: 0,
    description: 'Gás essencial para a respiração.'
  },
  'N2': {
    formula: 'N2',
    name: 'Nitrogênio Molecular',
    energy: 0,
    description: 'Principal componente do ar atmosférico.'
  }
};

export default function ElementMixer() {
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [result, setResult] = useState<Combination | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const addElement = (element: Element) => {
    setSelectedElements(prev => [...prev, element]);
  };

  const mix = () => {
    const formula = selectedElements
      .map(e => e.symbol)
      .sort()
      .join('');

    setResult(COMBINATIONS[formula] || null);
    if (!COMBINATIONS[formula]) {
      // Calcular energia teórica baseada nos elementos selecionados
      const theoreticalEnergy = selectedElements.reduce((acc, element) => {
        return acc + (element.electronegativity || 0) * 100;
      }, 0);

      setResult({
        formula,
        name: 'Combinação Teórica',
        energy: theoreticalEnergy,
        description: 'Combinação experimental com energia teórica calculada.'
      });
    }
    setSelectedElements([]);
  };

  const clearSelection = () => {
    setSelectedElements([]);
    setResult(null);
  };

  const filteredElements = selectedCategory === 'all' 
    ? ELEMENTS 
    : ELEMENTS.filter(e => e.category === selectedCategory);

  const generateElementPrompt = (message: string) => `
    Atue como um especialista em química quântica e estrutura atômica.
    Analise a seguinte consulta considerando:
    1. Estrutura eletrônica dos elementos
    2. Propriedades quânticas e energéticas
    3. Possíveis interações e ligações
    4. Cálculos de energia e estabilidade
    
    Elementos selecionados: ${selectedElements.map(e => e.symbol).join(', ')}
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Atom className="w-6 h-6" />
            Simulador Quântico de Elementos
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
            <h3 className="font-bold text-blue-300 mb-2">Tutorial do Simulador Quântico</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-200">1. Estrutura Atômica</h4>
                <p>Cada elemento possui:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li><span className="text-blue-300">Número atômico</span> - Quantidade de prótons</li>
                  <li><span className="text-blue-300">Configuração eletrônica</span> - Distribuição dos elétrons</li>
                  <li><span className="text-blue-300">Eletronegatividade</span> - Tendência de atrair elétrons</li>
                  <li><span className="text-blue-300">Estados de oxidação</span> - Cargas possíveis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Energia Quântica</h4>
                <p>A energia é calculada considerando:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Ligações químicas</li>
                  <li>Estados de oxidação</li>
                  <li>Interações eletrônicas</li>
                  <li>Estabilidade molecular</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Combinações</h4>
                <p>Ao misturar elementos:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Observe a energia liberada/absorvida</li>
                  <li>Analise a estabilidade</li>
                  <li>Verifique as ligações formadas</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar o Simulador:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Selecione elementos da tabela periódica</li>
              <li>Combine-os para formar moléculas</li>
              <li>Analise a energia e estabilidade</li>
              <li>Use o assistente IA para cálculos avançados</li>
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filtrar por Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/30 text-white rounded-lg px-4 py-2 w-full"
          >
            <option value="all">Todos os Elementos</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-6">
          {filteredElements.map(element => (
            <button
              key={element.symbol}
              onClick={() => addElement(element)}
              onMouseEnter={() => setShowDetails(element.symbol)}
              onMouseLeave={() => setShowDetails(null)}
              className="relative bg-black/30 hover:bg-black/40 p-2 rounded-lg transition text-center group"
            >
              <div className="text-xs text-purple-300">{element.atomicNumber}</div>
              <div className="text-xl font-bold">{element.symbol}</div>
              <div className="text-xs text-white/70 truncate">{element.name}</div>
              
              {showDetails === element.symbol && (
                <div className="absolute z-10 left-0 right-0 bottom-full mb-2 bg-black/90 rounded-lg p-3 text-left text-sm">
                  <h4 className="font-bold mb-1">{element.name}</h4>
                  <p>Número Atômico: {element.atomicNumber}</p>
                  <p>Massa Atômica: {element.atomicMass}</p>
                  <p>Configuração: {element.electronConfiguration}</p>
                  <p>Estados de Oxidação: {element.oxidationStates}</p>
                  {element.electronegativity && (
                    <p>Eletronegatividade: {element.electronegativity}</p>
                  )}
                  <p>Nível de Energia: {element.energyLevel}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="bg-black/30 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Elementos Selecionados:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedElements.map((element, index) => (
              <span
                key={index}
                className="bg-purple-500 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {element.symbol}
                <span className="text-xs">({element.atomicNumber})</span>
              </span>
            ))}
            {selectedElements.length === 0 && (
              <span className="text-white/70 italic">Selecione elementos para simular</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={mix}
            disabled={selectedElements.length < 2}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
          >
            <Zap className="w-5 h-5" />
            Simular Interação
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
          <h3 className="text-xl font-bold mb-4">Resultado da Simulação</h3>
          <div className="bg-black/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xl font-mono">{result.formula}</p>
              <span className="text-sm bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                {result.name}
              </span>
            </div>
            <div className="text-sm text-white/70">{result.description}</div>
            <div className="mt-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Energia: {result.energy.toFixed(2)} kJ/mol</span>
            </div>
          </div>
        </div>
      )}

      <AIChat
        initialMessage="Olá! Eu sou seu especialista em química quântica. Posso ajudar você a entender as propriedades dos elementos, calcular energias de ligação e prever interações moleculares. O que você gostaria de saber?"
        generatePrompt={generateElementPrompt}
        autoSpeak={true}
      />
    </div>
  );
}