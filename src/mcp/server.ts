import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

// 1. Interface para tipagem dos dados
interface Article {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  link: string;
}

interface ArxivCategory {
  id: string;
  label: string;
}

// 2. Configuração inicial do servidor
const server = new Server(
  {
    name: "arxiv-research-server",
    version: "0.1.0",
    description: "Servidor de integração com a API do arXiv para pesquisa científica"
  },
  {
    capabilities: {
      resources: { read: true, list: true },
      tools: { execute: true },
      prompts: { get: true }
    }
  }
);

// 3. Constantes configuráveis
const CATEGORIES: ArxivCategory[] = [
  { id: 'physics', label: 'Física' },
  { id: 'math', label: 'Matemática' },
  { id: 'cs', label: 'Ciência da Computação' },
  { id: 'q-bio', label: 'Biologia Quantitativa' },
  { id: 'q-fin', label: 'Finanças Quantitativas' },
  { id: 'stat', label: 'Estatística' },
  { id: 'eess', label: 'Engenharia Elétrica' },
  { id: 'econ', label: 'Economia' }
];

const MAX_RESULTS = 10;
const ARXIV_API_ENDPOINT = 'https://export.arxiv.org/api/query';

// 4. Função auxiliar para busca no arXiv
async function fetchArxivArticles(params: {
  category: string;
  query?: string;
  maxResults: number;
}): Promise<Article[]> {
  try {
    const searchQuery = params.query 
      ? `cat:${params.category}+AND+all:${encodeURIComponent(params.query)}`
      : `cat:${params.category}`;

    const response = await axios.get(ARXIV_API_ENDPOINT, {
      params: {
        search_query: searchQuery,
        start: 0,
        max_results: params.maxResults
      },
      timeout: 10000
    });

    const result = await parseXml(response.data);
    
    // 5. Validação da estrutura de dados
    if (!result?.feed?.entry) {
      throw new Error('Resposta da API em formato inválido');
    }

    return result.feed.entry.map((entry: any) => ({
      id: entry.id[0],
      title: entry.title[0].trim(),
      authors: entry.author.map((a: any) => a.name[0].trim()),
      summary: entry.summary[0].trim(),
      link: entry.id[0].replace('http://', 'https://')
    }));
    
  } catch (error) {
    console.error('Erro na busca do arXiv:', error);
    throw new Error('Falha ao recuperar artigos');
  }
}

// 6. Handlers implementados corretamente
server.setRequestHandler("list_resources", async () => ({
  resources: CATEGORIES.map(category => ({
    uri: `arxiv://${category.id}`,
    mimeType: "application/json",
    name: category.label,
    description: `Artigos da categoria ${category.label}`
  }))
}));

server.setRequestHandler("read_resource", async (request) => {
  const categoryId = request.params.uri.replace('arxiv://', '');
  
  if (!CATEGORIES.some(c => c.id === categoryId)) {
    throw new Error('Categoria inválida');
  }

  const articles = await fetchArxivArticles({
    category: categoryId,
    maxResults: 5
  });

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "application/json",
      text: JSON.stringify(articles)
    }]
  };
});

server.setRequestHandler("list_tools", async () => ({
  tools: [{
    name: "search_articles",
    description: "Busca avançada de artigos científicos",
    inputSchema: {
      type: "object",
      properties: {
        category: { 
          type: "string", 
          enum: CATEGORIES.map(c => c.id),
          description: "Categoria do artigo" 
        },
        query: { 
          type: "string", 
          description: "Termos de busca" 
        },
        maxResults: { 
          type: "number", 
          minimum: 1,
          maximum: MAX_RESULTS,
          default: 5
        }
      },
      required: ["category"]
    }
  }]
}));

server.setRequestHandler("call_tool", async (request) => {
  if (request.params.name !== "search_articles") {
    throw new Error("Ferramenta não encontrada");
  }

  const args = request.params.arguments;
  const articles = await fetchArxivArticles({
    category: args.category,
    query: args.query,
    maxResults: Math.min(args.maxResults || 5, MAX_RESULTS)
  });

  return {
    content: [{
      type: "text",
      text: JSON.stringify(articles, null, 2)
    }]
  };
});

// 7. Implementação corrigida dos prompts
server.setRequestHandler("list_prompts", async () => ({
  prompts: [{
    name: "analyze_article",
    description: "Análise detalhada de artigo científico",
    parameters: {
      type: "object",
      properties: {
        articleId: {
          type: "string",
          description: "ID do artigo no arXiv"
        }
      },
      required: ["articleId"]
    }
  }]
}));

server.setRequestHandler("get_prompt", async (request) => {
  if (request.params.name !== "analyze_article") {
    throw new Error("Prompt não encontrado");
  }

  return {
    messages: [{
      role: "system",
      content: {
        type: "text",
        text: `Analise o artigo científico com base nestes critérios:
        1. Contexto e importância da pesquisa
        2. Metodologia utilizada
        3. Principais descobertas
        4. Possíveis aplicações práticas
        5. Limitações e sugestões para pesquisas futuras`
      }
    }]
  };
});

// 8. Inicialização segura do servidor
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Servidor inicializado com sucesso");
  } catch (error) {
    console.error("Falha na inicialização:", error);
    process.exit(1);
  }
}

main();
