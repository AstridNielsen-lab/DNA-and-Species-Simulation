import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dna, FlaskRound as Flask, Atom, Book, User, Mail, Phone } from 'lucide-react';
import DNABuilder from './components/DNABuilder';
import SpeciesCrossing from './components/SpeciesCrossing';
import ElementMixer from './components/ElementMixer';
import ResearchAssistant from './components/ResearchAssistant';
import SplashScreen from './components/SplashScreen';
import WelcomeForm from './components/WelcomeForm';

interface UserData {
  name: string;
  email: string;
  whatsapp: string;
  firstVisit: string;
  lastVisit: string;
  visits: number;
}

function App() {
  const [activeTab, setActiveTab] = useState<'dna' | 'species' | 'elements' | 'research'>('dna');
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Verificar se é a primeira visita
    const storedData = localStorage.getItem('biosim_user_data');
    
    if (storedData) {
      const data = JSON.parse(storedData) as UserData;
      // Atualizar dados da visita
      const updatedData = {
        ...data,
        lastVisit: new Date().toISOString(),
        visits: data.visits + 1
      };
      localStorage.setItem('biosim_user_data', JSON.stringify(updatedData));
      setUserData(updatedData);
      setShowWelcomeForm(false);
    } else {
      // Primeira visita
      setShowWelcomeForm(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    const storedData = localStorage.getItem('biosim_user_data');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
    setShowWelcomeForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>BioSim Lab - Like Look Solutions</title>
        <meta name="description" content="Simulador de DNA, Espécies e Elementos Químicos desenvolvido pela Like Look Solutions" />
      </Helmet>

      <SplashScreen />
      
      {showWelcomeForm && <WelcomeForm onComplete={handleWelcomeComplete} />}

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <header className="bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Dna className="w-8 h-8" />
              BioSim Lab
            </h1>
            <p className="mt-2 text-purple-200">Explore DNA, Espécies e Elementos Químicos</p>
            <div className="mt-2 text-sm text-purple-300">
              {userData && (
                <p>Bem-vindo de volta, {userData.name}! Esta é sua {userData.visits}ª visita.</p>
              )}
              <p>Desenvolvido por Julio Campos Machado</p>
              <p>Like Look Solutions - <a href="https://likelook.wixsite.com/solutions" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">Visite nosso site</a></p>
              <p>WhatsApp: <a href="https://wa.me/5511992946628" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">+55 11 99294-6628</a></p>
            </div>

            {userData && (
              <div className="mt-4 bg-black/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Seus Dados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-300" />
                      <span className="text-purple-300">Nome:</span> {userData.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-300" />
                      <span className="text-purple-300">E-mail:</span> {userData.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-300" />
                      <span className="text-purple-300">WhatsApp:</span> {userData.whatsapp}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-purple-300">Primeira visita: <span className="text-white">{formatDate(userData.firstVisit)}</span></p>
                    <p className="text-purple-300">Última visita: <span className="text-white">{formatDate(userData.lastVisit)}</span></p>
                    <p className="text-purple-300">Total de visitas: <span className="text-white">{userData.visits}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('dna')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'dna' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Dna className="w-5 h-5" />
                Construtor de DNA
              </button>
              <button
                onClick={() => setActiveTab('species')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'species' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Flask className="w-5 h-5" />
                Cruzamento de Espécies
              </button>
              <button
                onClick={() => setActiveTab('elements')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'elements' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Atom className="w-5 h-5" />
                Misturador de Elementos
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`px-4 py-3 flex items-center gap-2 transition
                  ${activeTab === 'research' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
              >
                <Book className="w-5 h-5" />
                Pesquisa Científica
              </button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {activeTab === 'dna' && <DNABuilder userData={userData} />}
          {activeTab === 'species' && <SpeciesCrossing userData={userData} />}
          {activeTab === 'elements' && <ElementMixer userData={userData} />}
          {activeTab === 'research' && <ResearchAssistant userData={userData} />}
        </main>
      </div>
    </>
  );
}

export default App;
