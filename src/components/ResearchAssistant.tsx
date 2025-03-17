import React, { useState, useId } from 'react';
import { Search, Book, HelpCircle, ExternalLink, Loader2 } from 'lucide-react';
import AIChat from './AIChat';

interface Article {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  category: string;
  link: string;
}

const CATEGORIES = [
  { id: 'physics', label: 'Física' },
  { id: 'math', label: 'Matemática' },
  { id: 'cs', label: 'Ciência da Computação' },
  { id: 'q-bio', label: 'Biologia Quantitativa' },
  { id: 'q-fin', label: 'Finanças Quantitativas' },
  { id: 'stat', label: 'Estatística' },
  { id: 'eess', label: 'Engenharia Elétrica' },
  { id: 'econ', label: 'Economia' }
];

const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const ATOM_NS = 'http://www.w3.org/2005/Atom';

export default function ResearchAssistant() {
  const [activeCategory, setActiveCategory] = useState<string>('physics');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Gerar IDs únicos para acessibilidade
  const inputId = useId();
  const categoryGroupId = useId();

  const searchArxiv = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setArticles([]);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const encodedUrl = encodeURIComponent(
        `http://export.arxiv.org/api/query?search_query=cat:${activeCategory}+AND+all:${encodeURIComponent(searchQuery)}&start=0&max_results=10`
      );

      const response = await fetch(
        `${CORS_PROXY}${encodedUrl}`,
        {
          headers: {
            'User-Agent': 'ResearchAssistant/1.0 (contact@example.com)',
            'Content-Type': 'application/xml'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      const rawXML = data.contents;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rawXML, "text/xml");

      // Verificar erros de parsing
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Erro ao processar resposta XML');
      }

      const entries = Array.from(xmlDoc.getElementsByTagNameNS(ATOM_NS, 'entry'));
      
      const parsedArticles = entries.map(entry => {
        const id = entry.getElementsByTagNameNS(ATOM_NS, 'id')[0]?.textContent || '';
        const title = entry.getElementsByTagNameNS(ATOM_NS, 'title')[0]?.textContent?.replace(/\n/g, ' ').trim() || '';
        const authors = Array.from(entry.getElementsByTagNameNS(ATOM_NS, 'author')).map(author => 
          author.getElementsByTagNameNS(ATOM_NS, 'name')[0]?.textContent?.trim() || 'Autor desconhecido'
        );
        const summary = entry.getElementsByTagNameNS(ATOM_NS, 'summary')[0]?.textContent?.replace(/\n/g, ' ').trim() || '';
        
        return {
          id,
          title,
          authors,
          summary,
          category: activeCategory,
          link: id.replace('http://', 'https://')
        };
      });

      setArticles(parsedArticles);
      if (parsedArticles.length === 0) {
        setError('Nenhum artigo encontrado com esses critérios de busca');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? 
        (err.name === 'AbortError' ? 'Tempo limite excedido (30s)' : 
        err.message.replace('Failed to fetch', 'Erro de conexão')) : 
        'Erro desconhecido';
      
      setError(`Erro na busca: ${errorMessage}`);
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateResearchPrompt = (message: string) => `
    Atue como um assistente de pesquisa científica especializado em análise de artigos acadêmicos.
    Você está analisando artigos do arXiv na categoria: ${activeCategory}

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
            aria-label="Mostrar ajuda"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Selecione uma categoria científica</li>
              <li>Digite termos de busca relevantes</li>
              <li>Clique em Buscar ou pressione Enter</li>
              <li>Clique em "Ver Artigo" para acessar o conteúdo completo</li>
            </ul>
          </div>
        )}

        <div 
          role="group" 
          aria-labelledby={categoryGroupId}
          className="flex flex-wrap gap-2 mb-6"
        >
          <span id={categoryGroupId} className="sr-only">
            Categorias científicas
          </span>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              id={`category-${category.id}`}
              name="category"
              value={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition ${
                activeCategory === category.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/30 text-white/70 hover:bg-black/40'
              }`}
              aria-pressed={activeCategory === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <label htmlFor={inputId} className="sr-only">
            Buscar artigos científicos
          </label>
          <input
            id={inputId}
            name="searchQuery"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite termos de busca..."
            className="flex-1 bg-black/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyUp={(e) => e.key === 'Enter' && searchArxiv()}
          />
          <button
            onClick={searchArxiv}
            disabled={loading || !searchQuery.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 px-6 py-2 rounded-lg transition flex items-center gap-2"
            aria-label="Executar busca"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        )}

        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map(article => (
              <div key={article.id} className="bg-black/30 p-4 rounded-lg">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 transition flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver Artigo
                  </a>
                </div>
                <p className="text-sm text-white/70 mt-2">
                  Autores: {article.authors.join(', ')}
                </p>
                <p className="mt-2 text-sm">{article.summary}</p>
                <div className="mt-2">
                  <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                    {CATEGORIES.find(c => c.id === article.category)?.label || article.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-8 text-white/50">
              Nenhum resultado para exibir
            </div>
          )
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
