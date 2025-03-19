import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, ArrowRight, LogOut } from 'lucide-react';

interface WelcomeFormProps {
  onComplete: (userData: any) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          revoke: (token: string, callback: (success: boolean) => void) => void;
        };
      };
    };
  }
}

const CLIENT_ID = "6686456196-725lc9rcv7ooibi3ce3n2s3aqoc60d0g.apps.googleusercontent.com";

export default function WelcomeForm({ onComplete }: WelcomeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      setGoogleLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (googleLoaded && window.google) {
      const redirectUri = typeof window !== 'undefined'
        ? `${window.location.origin}/api/auth/callback/google`
        : 'http://localhost:3000/api/auth/callback/google';

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "redirect",
        redirect_uri: redirectUri,
      });

      const buttonDiv = document.getElementById('google-sign-in');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: "outline",
          size: "large",
          width: buttonDiv.offsetWidth,
        });
      }

      window.google.accounts.id.prompt();
    }
  }, [googleLoaded]);

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      if (!response.credential) {
        throw new Error('Credenciais não encontradas na resposta do Google.');
      }

      const res = await fetch("/api/auth/verify-google-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: response.credential,
        }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        throw new Error(data.message || 'Erro ao verificar token no servidor');
      }

      const { user } = data;
      localStorage.setItem('google_token', response.credential);

      setIsLoggedIn(true);
      onComplete(user);

    } catch (error: any) {
      console.error('Erro ao processar login:', error);
      setError('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (!formData.email.includes('@') || !formData.name.trim() || !formData.whatsapp.trim()) {
        throw new Error('Por favor, preencha todos os campos corretamente');
      }

      const userData = {
        ...formData,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        visits: 1,
      };

      setIsLoggedIn(true);
      onComplete(userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.google) {
      window.google.accounts.id.revoke(localStorage.getItem('google_token') || '', (success: boolean) => {
        if (success) {
          setIsLoggedIn(false);
          localStorage.removeItem('google_token');
          localStorage.removeItem('biosim_user_data');
          console.log('Logout realizado com sucesso');
        } else {
          setError('Falha ao realizar logout.');
        }
      });
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem('biosim_user_data');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bem-vindo de volta!</h2>
          <p className="text-lg text-purple-200 mb-8">Você está logado e pronto para explorar.</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2 mx-auto"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-md my-4">
        <div className="max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Bem-vindo ao BioSim Lab!</h2>
          <p className="text-sm text-purple-200 mb-4">
            Para personalizar sua experiência e fornecer um melhor atendimento,
            precisamos de algumas informações básicas.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <div id="google-sign-in" className="w-full h-[40px] bg-white/5 rounded-lg"></div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a]/50 text-white/60">ou continue com e-mail</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-purple-200 mb-1 text-sm">
                Como podemos te chamar?
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu primeiro nome"
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-200 mb-1 text-sm">
                Seu melhor e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="exemplo@email.com"
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-200 mb-1 text-sm">
                WhatsApp para contato
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 text-white rounded-lg py-2 mt-4 flex items-center justify-center gap-2 transition text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Começar a Explorar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-white/60 text-center mt-3">
              Ao continuar, você concorda com nossos{' '}
              <a href="#" className="text-purple-300 hover:text-purple-200 underline">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-purple-300 hover:text-purple-200 underline">
                Política de Privacidade
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
