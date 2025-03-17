import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

const server = new Server(
  {
    name: "arxiv-research-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// Tipos de recursos disponíveis
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

// Listar recursos disponíveis
server.setRequestHandler("list_resources", async () => {
  return {
    resources: CATEGORIES.map(category => ({
      uri: `arxiv://${category.id}`,
      mimeType: "application/json",
      name: category.label,
      description: `Artigos científicos na área de ${category.label}`,
    })),
  };
});

// Ler um recurso específico
server.setRequestHandler("read_resource", async (request) => {
  const categoryId = request.params.uri.replace('arxiv://', '');
  const category = CATEGORIES.find(c => c.id === categoryId);
  
  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  const response = await axios.get(
    `https://export.arxiv.org/api/query?search_query=cat:${categoryId}&start=0&max_results=5`
  );

  const result = await parseXml(response.data);
  const entries = result.feed.entry || [];

  const articles = entries.map((entry: any) => ({
    id: entry.id[0],
    title: entry.title[0],
    authors: entry.author.map((a: any) => a.name[0]),
    summary: entry.summary[0],
    link: entry.id[0],
  }));

  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "application/json",
        text: JSON.stringify(articles, null, 2),
      },
    ],
  };
});

// Listar ferramentas disponíveis
server.setRequestHandler("list_tools", async () => {
  return {
    tools: [
      {
        name: "search_articles",
        description: "Buscar artigos científicos no arXiv",
        inputSchema: {
          type: "object",
          properties: {
            category: { 
              type: "string", 
              description: "Categoria do artigo",
              enum: CATEGORIES.map(c => c.id),
            },
            query: { 
              type: "string", 
              description: "Termos de busca" 
            },
            maxResults: { 
              type: "number", 
              description: "Número máximo de resultados",
              default: 5,
              minimum: 1,
              maximum: 10,
            },
          },
          required: ["category", "query"],
        },
      },
    ],
  };
});

// Executar uma ferramenta
server.setRequestHandler("call_tool", async (request) => {
  if (request.params.name !== "search_articles") {
    throw new Error("Ferramenta não encontrada");
  }

  const { category, query, maxResults = 5 } = request.params.arguments;

  const response = await axios.get(
    `https://export.arxiv.org/api/query?search_query=cat:${category}+AND+all:${query}&start=0&max_results=${maxResults}`
  );

  const result = await parseXml(response.data);
  const entries = result.feed.entry || [];

  const articles = entries.map((entry: any) => ({
    id: entry.id[0],
    title: entry.title[0],
    authors: entry.author.map((a: any) => a.name[0]),
    summary: entry.summary[0],
    link: entry.id[0],
  }));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(articles, null, 2),
      },
    ],
  };
});

// Listar prompts disponíveis
server.setRequestHandler("list_prompts", async () => {
  return {
    prompts: [
      {
        name: "analyze_article",
        description: "Analisar um artigo científico",
      },
    ],
  };
});

// Executar um prompt
server.setRequestHandler("get_prompt", async (request) => {
  if (request.params.name !== "analyze_article") {
    throw new Error("Prompt não encontrado");
  }

  return {
    messages: [
      {
        role: "system",
        content: {
          type: "text",
          text: "Você é um especialista em análise de artigos científicos. Analise o artigo fornecido e forneça um resumo detalhado, destacando os principais pontos, metodologia e conclusões.",
        },
      },
    ],
  };
});

// Iniciar o servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Erro no servidor:", error);
  process.exit(1);
});