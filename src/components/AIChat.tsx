import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Mic, Volume2, HelpCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  initialMessage: string;
  generatePrompt: (message: string) => string;
  autoSpeak?: boolean;
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

const cleanTextForSpeech = (text: string) => {
  return text
    .replace(/[*_#`]/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function AIChat({ initialMessage, generatePrompt, autoSpeak = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoSpeak) {
      speakMessage(initialMessage);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const recognition = useRef<any>(null);

  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window && !recognition.current) {
    recognition.current = new (window as any).webkitSpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.lang = 'pt-BR';
    recognition.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.current.onerror = () => {
      setIsListening(false);
    };
  }

  const startListening = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateResponse = async (userMessage: string) => {
    try {
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`
      ).join('\n');

      const fullPrompt = `
        Histórico da conversa:
        ${conversationHistory}

        Nova mensagem do usuário:
        ${userMessage}

        ${generatePrompt(userMessage)}
      `;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error:', error);
      return 'Desculpe, mas encontrei um erro ao processar sua solicitação. Por favor, tente novamente.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await generateResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      speakMessage(aiResponse);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Assistente IA
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
          <h3 className="font-bold mb-2">Como usar o Assistente IA:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Digite sua pergunta no campo de texto ou use o botão do microfone para falar</li>
            <li>Clique no botão de alto-falante para ouvir as respostas</li>
            <li>O assistente irá guiar você durante o uso da plataforma</li>
            <li>Faça perguntas sobre DNA, espécies ou elementos químicos</li>
          </ul>
        </div>
      )}

      <div className="bg-black/30 rounded-lg p-4 mb-4 h-[400px] overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-500'
                  : 'bg-gray-700'
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {message.content}
              </pre>
              {message.role === 'assistant' && (
                <button
                  onClick={() => speakMessage(message.content)}
                  className="mt-2 text-purple-300 hover:text-purple-200 transition"
                  title="Ouvir resposta"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-black/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={startListening}
          disabled={isLoading || isListening}
          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 px-4 py-2 rounded-lg transition"
          title="Falar"
        >
          <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar
        </button>
      </form>
    </div>
  );
}