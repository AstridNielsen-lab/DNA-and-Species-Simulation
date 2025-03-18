import React, { useState } from 'react';
import { Search, Book, HelpCircle, ExternalLink, Loader2 } from 'lucide-react';
import AIChat from './AIChat';

interface Article {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  category: string;
  link: string;
  published: string;
  updated: string;
  doi?: string;
  primaryCategory: string;
  categories: string[];
}

// Categorias atualizadas do arXiv
const CATEGORIES = [
  // Física
  { id: 'astro-ph', label: 'Astrofísica', subcategories: [
    { id: 'astro-ph.GA', label: 'Astrofísica de Galáxias' },
    { id: 'astro-ph.CO', label: 'Cosmologia' },
    { id: 'astro-ph.EP', label: 'Astrofísica Planetária' },
    { id: 'astro-ph.HE', label: 'Fenômenos de Alta Energia' },
    { id: 'astro-ph.IM', label: 'Instrumentação' },
    { id: 'astro-ph.SR', label: 'Astrofísica Estelar' }
  ]},
  { id: 'cond-mat', label: 'Matéria Condensada', subcategories: [
    { id: 'cond-mat.dis-nn', label: 'Sistemas Desordenados' },
    { id: 'cond-mat.mtrl-sci', label: 'Ciência dos Materiais' },
    { id: 'cond-mat.mes-hall', label: 'Física Mesoscópica' },
    { id: 'cond-mat.other', label: 'Outros' },
    { id: 'cond-mat.quant-gas', label: 'Gases Quânticos' },
    { id: 'cond-mat.soft', label: 'Matéria Mole' },
    { id: 'cond-mat.stat-mech', label: 'Mecânica Estatística' },
    { id: 'cond-mat.str-el', label: 'Elétrons Fortemente Correlacionados' },
    { id: 'cond-mat.supr-con', label: 'Supercondutividade' }
  ]},
  { id: 'gr-qc', label: 'Relatividade Geral e Cosmologia Quântica' },
  { id: 'hep-ex', label: 'Física de Altas Energias - Experimental' },
  { id: 'hep-lat', label: 'Física de Altas Energias - Rede' },
  { id: 'hep-ph', label: 'Física de Altas Energias - Fenomenologia' },
  { id: 'hep-th', label: 'Física de Altas Energias - Teoria' },
  { id: 'math-ph', label: 'Física Matemática' },
  { id: 'nlin', label: 'Ciências Não Lineares', subcategories: [
    { id: 'nlin.AO', label: 'Sistemas Adaptativos' },
    { id: 'nlin.CG', label: 'Autômatos Celulares' },
    { id: 'nlin.CD', label: 'Dinâmica Caótica' },
    { id: 'nlin.SI', label: 'Sistemas Integráveis' },
    { id: 'nlin.PS', label: 'Formação de Padrões' }
  ]},
  { id: 'nucl-ex', label: 'Física Nuclear - Experimental' },
  { id: 'nucl-th', label: 'Física Nuclear - Teoria' },
  { id: 'physics', label: 'Física', subcategories: [
    { id: 'physics.acc-ph', label: 'Física de Aceleradores' },
    { id: 'physics.app-ph', label: 'Física Aplicada' },
    { id: 'physics.ao-ph', label: 'Física Atmosférica e Oceânica' },
    { id: 'physics.atom-ph', label: 'Física Atômica' },
    { id: 'physics.bio-ph', label: 'Física Biológica' },
    { id: 'physics.chem-ph', label: 'Física Química' },
    { id: 'physics.class-ph', label: 'Física Clássica' },
    { id: 'physics.comp-ph', label: 'Física Computacional' },
    { id: 'physics.data-an', label: 'Análise de Dados' },
    { id: 'physics.flu-dyn', label: 'Dinâmica dos Fluidos' },
    { id: 'physics.gen-ph', label: 'Física Geral' },
    { id: 'physics.geo-ph', label: 'Geofísica' },
    { id: 'physics.hist-ph', label: 'História da Física' },
    { id: 'physics.ins-det', label: 'Instrumentação' },
    { id: 'physics.med-ph', label: 'Física Médica' },
    { id: 'physics.optics', label: 'Óptica' },
    { id: 'physics.ed-ph', label: 'Educação em Física' },
    { id: 'physics.soc-ph', label: 'Física e Sociedade' },
    { id: 'physics.space-ph', label: 'Física Espacial' }
  ]},
  { id: 'quant-ph', label: 'Física Quântica' },
  
  // Matemática
  { id: 'math', label: 'Matemática', subcategories: [
    { id: 'math.AG', label: 'Geometria Algébrica' },
    { id: 'math.AT', label: 'Topologia Algébrica' },
    { id: 'math.AP', label: 'Análise de EDPs' },
    { id: 'math.CT', label: 'Teoria das Categorias' },
    { id: 'math.CA', label: 'Análise Clássica' },
    { id: 'math.CO', label: 'Combinatória' },
    { id: 'math.AC', label: 'Álgebra Comutativa' },
    { id: 'math.CV', label: 'Análise Complexa' },
    { id: 'math.DG', label: 'Geometria Diferencial' },
    { id: 'math.DS', label: 'Sistemas Dinâmicos' },
    { id: 'math.FA', label: 'Análise Funcional' },
    { id: 'math.GM', label: 'Matemática Geral' },
    { id: 'math.GN', label: 'Topologia Geral' },
    { id: 'math.GT', label: 'Topologia Geométrica' },
    { id: 'math.GR', label: 'Teoria dos Grupos' },
    { id: 'math.HO', label: 'História e Visão Geral' },
    { id: 'math.IT', label: 'Teoria da Informação' },
    { id: 'math.KT', label: 'Teoria K e Homologia' },
    { id: 'math.LO', label: 'Lógica' },
    { id: 'math.MP', label: 'Física Matemática' },
    { id: 'math.MG', label: 'Geometria Métrica' },
    { id: 'math.NT', label: 'Teoria dos Números' },
    { id: 'math.NA', label: 'Análise Numérica' },
    { id: 'math.OA', label: 'Álgebras de Operadores' },
    { id: 'math.OC', label: 'Otimização e Controle' },
    { id: 'math.PR', label: 'Probabilidade' },
    { id: 'math.QA', label: 'Álgebra Quântica' },
    { id: 'math.RT', label: 'Teoria da Representação' },
    { id: 'math.RA', label: 'Anéis e Álgebras' },
    { id: 'math.SP', label: 'Teoria Espectral' },
    { id: 'math.ST', label: 'Estatística' },
    { id: 'math.SG', label: 'Geometria Simplética' }
  ]},
  
  // Ciência da Computação
  { id: 'cs', label: 'Ciência da Computação', subcategories: [
    { id: 'cs.AI', label: 'Inteligência Artificial' },
    { id: 'cs.CL', label: 'Computação e Linguagem' },
    { id: 'cs.CC', label: 'Complexidade Computacional' },
    { id: 'cs.CE', label: 'Computação Científica' },
    { id: 'cs.CG', label: 'Computação Gráfica' },
    { id: 'cs.GT', label: 'Teoria dos Jogos' },
    { id: 'cs.CV', label: 'Visão Computacional' },
    { id: 'cs.CY', label: 'Computação e Sociedade' },
    { id: 'cs.CR', label: 'Criptografia' },
    { id: 'cs.DS', label: 'Estruturas de Dados' },
    { id: 'cs.DB', label: 'Bancos de Dados' },
    { id: 'cs.DL', label: 'Bibliotecas Digitais' },
    { id: 'cs.DM', label: 'Matemática Discreta' },
    { id: 'cs.DC', label: 'Computação Distribuída' },
    { id: 'cs.ET', label: 'Tecnologias Emergentes' },
    { id: 'cs.FL', label: 'Linguagens Formais' },
    { id: 'cs.GL', label: 'Literatura Geral' },
    { id: 'cs.GR', label: 'Computação Gráfica' },
    { id: 'cs.AR', label: 'Arquitetura de Hardware' },
    { id: 'cs.HC', label: 'Interação Humano-Computador' },
    { id: 'cs.IR', label: 'Recuperação de Informação' },
    { id: 'cs.IT', label: 'Teoria da Informação' },
    { id: 'cs.LO', label: 'Lógica em Computação' },
    { id: 'cs.LG', label: 'Aprendizado de Máquina' },
    { id: 'cs.MS', label: 'Software Matemático' },
    { id: 'cs.MA', label: 'Sistemas Multiagentes' },
    { id: 'cs.MM', label: 'Multimídia' },
    { id: 'cs.NI', label: 'Redes' },
    { id: 'cs.NE', label: 'Computação Neural' },
    { id: 'cs.NA', label: 'Análise Numérica' },
    { id: 'cs.OS', label: 'Sistemas Operacionais' },
    { id: 'cs.OH', label: 'Outros' },
    { id: 'cs.PF', label: 'Performance' },
    { id: 'cs.PL', label: 'Linguagens de Programação' },
    { id: 'cs.RO', label: 'Robótica' },
    { id: 'cs.SI', label: 'Redes Sociais' },
    { id: 'cs.SE', label: 'Engenharia de Software' },
    { id: 'cs.SD', label: 'Som' },
    { id: 'cs.SC', label: 'Computação Simbólica' },
    { id: 'cs.SY', label: 'Sistemas e Controle' }
  ]},
  
  // Biologia Quantitativa
  { id: 'q-bio', label: 'Biologia Quantitativa', subcategories: [
    { id: 'q-bio.BM', label: 'Biomoléculas' },
    { id: 'q-bio.CB', label: 'Comportamento Celular' },
    { id: 'q-bio.GN', label: 'Genômica' },
    { id: 'q-bio.MN', label: 'Redes Moleculares' },
    { id: 'q-bio.NC', label: 'Neurônios e Cognição' },
    { id: 'q-bio.OT', label: 'Outros' },
    { id: 'q-bio.PE', label: 'Populações e Evolução' },
    { id: 'q-bio.QM', label: 'Métodos Quantitativos' },
    { id: 'q-bio.SC', label: 'Processos Subcelulares' },
    { id: 'q-bio.TO', label: 'Tecidos e Órgãos' }
  ]},
  
  // Finanças Quantitativas
  { id: 'q-fin', label: 'Finanças Quantitativas', subcategories: [
    { id: 'q-fin.CP', label: 'Finanças Computacionais' },
    { id: 'q-fin.EC', label: 'Economia' },
    { id: 'q-fin.GN', label: 'Finanças Gerais' },
    { id: 'q-fin.MF', label: 'Finanças Matemáticas' },
    { id: 'q-fin.PM', label: 'Gestão de Portfólio' },
    { id: 'q-fin.PR', label: 'Precificação' },
    { id: 'q-fin.RM', label: 'Gestão de Risco' },
    { id: 'q-fin.ST', label: 'Finanças Estatísticas' },
    { id: 'q-fin.TR', label: 'Trading' }
  ]},
  
  // Estatística
  { id: 'stat', label: 'Estatística', subcategories: [
    { id: 'stat.AP', label: 'Aplicações' },
    { id: 'stat.CO', label: 'Computação' },
    { id: 'stat.ML', label: 'Aprendizado de Máquina' },
    { id: 'stat.ME', label: 'Metodologia' },
    { id: 'stat.OT', label: 'Outros' },
    { id: 'stat.TH', label: 'Teoria' }
  ]},
  
  // Engenharia Elétrica
  { id: 'eess', label: 'Engenharia Elétrica', subcategories: [
    { id: 'eess.AS', label: 'Processamento de Áudio e Fala' },
    { id: 'eess.IV', label: 'Processamento de Imagem e Vídeo' },
    { id: 'eess.SP', label: 'Processamento de Sinais' },
    { id: 'eess.SY', label: 'Sistemas e Controle' }
  ]},
  
  // Economia
  { id: 'econ', label: 'Economia', subcategories: [
    { id: 'econ.EM', label: 'Econometria' },
    { id: 'econ.GN', label: 'Economia Geral' },
    { id: 'econ.TH', label: 'Economia Teórica' }
  ]}
];

export default function ResearchAssistant() {
  const [activeCategory, setActiveCategory] = useState<string>('physics');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  const searchArxiv = async (start = 0) => {
    if (!searchQuery.trim() && !activeSubcategory) return;

    try {
      setLoading(true);
      setError(null);

      // Construir a query de busca
      let searchTerms = [];
      
      // Adicionar categoria/subcategoria
      if (activeSubcategory) {
        searchTerms.push(`cat:${activeSubcategory}`);
      } else if (activeCategory) {
        const category = CATEGORIES.find(c => c.id === activeCategory);
        if (category?.subcategories) {
          const subcats = category.subcategories.map(sub => `cat:${sub.id}`).join('+OR+');
          searchTerms.push(`(${subcats})`);
        } else {
          searchTerms.push(`cat:${activeCategory}`);
        }
      }

      // Adicionar termos de busca
      if (searchQuery.trim()) {
        searchTerms.push(`all:${encodeURIComponent(searchQuery.trim())}`);
      }

      const searchUrl = `https://export.arxiv.org/api/query?search_query=${searchTerms.join('+AND+')}&start=${start}&max_results=${resultsPerPage}&sortBy=submittedDate&sortOrder=descending`;

      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar artigos');
      }

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      // Extrair o total de resultados
      const totalResultsElement = xmlDoc.querySelector('opensearch\\:totalResults');
      const total = totalResultsElement ? parseInt(totalResultsElement.textContent || '0', 10) : 0;
      setTotalResults(total);

      // Processar os artigos
      const entries = Array.from(xmlDoc.getElementsByTagName('entry'));
      const articles = entries.map(entry => {
        // Extrair categorias
        const categories = Array.from(entry.getElementsByTagName('category')).map(cat => 
          cat.getAttribute('term') || ''
        );

        // Extrair DOI se disponível
        const links = Array.from(entry.getElementsByTagName('link'));
        const doiLink = links.find(link => link.getAttribute('title') === 'doi');
        const doi = doiLink ? doiLink.getAttribute('href') : undefined;

        // Extrair link do PDF
        const pdfLink = links.find(link => link.getAttribute('title') === 'pdf')?.getAttribute('href');

        return {
          id: entry.querySelector('id')?.textContent || '',
          title: entry.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() || '',
          authors: Array.from(entry.getElementsByTagName('author')).map(author => 
            author.querySelector('name')?.textContent || ''
          ),
          summary: entry.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim() || '',
          category: activeCategory,
          link: pdfLink || entry.querySelector('id')?.textContent || '',
          published: entry.querySelector('published')?.textContent || '',
          updated: entry.querySelector('updated')?.textContent || '',
          doi,
          primaryCategory: entry.querySelector('arxiv\\:primary_category')?.getAttribute('term') || categories[0] || '',
          categories
        };
      });

      if (start === 0) {
        setArticles(articles);
      } else {
        setArticles(prev => [...prev, ...articles]);
      }
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar artigos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchArxiv(nextPage * resultsPerPage);
  };

  const handleSearch = () => {
    setPage(0);
    searchArxiv(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory('');
    setArticles([]);
    setPage(0);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
    setArticles([]);
    setPage(0);
    searchArxiv(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentCategory = () => {
    const category = CATEGORIES.find(c => c.id === activeCategory);
    if (activeSubcategory && category?.subcategories) {
      const subcategory = category.subcategories.find(s => s.id === activeSubcategory);
      return subcategory?.label || category.label;
    }
    return category?.label || '';
  };

  const generateResearchPrompt = (message: string) => `
    Atue como um assistente de pesquisa científica especializado em análise de artigos acadêmicos.
    Você está analisando artigos do arXiv na categoria: ${getCurrentCategory()}

    Forneça:
    1. Uma análise detalhada do tópico de pesquisa
    2. Explicação dos conceitos principais em linguagem acessível
    3. Possíveis aplicações práticas da pesquisa
    4. Sugestões de áreas relacionadas para exploração

    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Book className="w-6 h-6" />
            Assistente de Pesquisa Científica
          </h2>
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
            <h3 className="font-bold mb-2">Como usar o Assistente de Pesquisa:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Selecione uma categoria científica de seu interesse</li>
              <li>Escolha uma subcategoria específica (opcional)</li>
              <li>Digite termos de busca para encontrar artigos</li>
              <li>Use o chat para fazer perguntas sobre os artigos</li>
              <li>O assistente analisará os artigos e explicará os conceitos</li>
            </ul>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* Categorias principais */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-black/30 text-white/70 hover:bg-black/40'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Subcategorias */}
          {activeCategory && CATEGORIES.find(c => c.id === activeCategory)?.subcategories && (
            <div className="bg-black/20 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Subcategorias de {CATEGORIES.find(c => c.id === activeCategory)?.label}:</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.find(c => c.id === activeCategory)?.subcategories?.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategoryChange(sub.id)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      activeSubcategory === sub.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-black/30 text-white/70 hover:bg-black/40'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Digite termos de busca..."
            className="flex-1 bg-black/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading || (!searchQuery.trim() && !activeSubcategory)}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 px-6 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && articles.length === 0 && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        )}

        {articles.length > 0 && (
          <div>
            <div className="text-sm text-white/70 mb-4">
              Encontrados {totalResults} artigos
            </div>
            
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article.id} className="bg-black/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{article.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {article.categories.map(cat => (
                          <span key={cat} className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {article.doi && (
                        <a
                          href={article.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          DOI
                        </a>
                      )}
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 hover:text-purple-200 transition flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        PDF
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-white/70">
                    <p>Autores: {article.authors.join(', ')}</p>
                    <p>Publicado em: {formatDate(article.published)}</p>
                    <p>Última atualização: {formatDate(article.updated)}</p>
                  </div>
                  
                  <p className="mt-3 text-sm">{article.summary}</p>
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            )}

            {!loading && articles.length < totalResults && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  className="bg-purple-500/30 hover:bg-purple-500/40 px-6 py-2 rounded-lg transition"
                >
                  Carregar mais resultados
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AIChat
        initialMessage="Olá! Eu sou seu assistente de pesquisa científica. Posso ajudar você a encontrar e entender artigos científicos do arXiv. Em qual área você está interessado?"
        generatePrompt={generateResearchPrompt}
        autoSpeak={true}
      />
    </div>
  );
}