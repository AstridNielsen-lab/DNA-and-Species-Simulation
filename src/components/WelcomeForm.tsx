import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

interface WelcomeFormProps {
  onComplete: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

function WelcomeForm({ onComplete }: WelcomeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "6686456196-725lc9rcv7ooibi3ce3n2s3aqoc60d0g.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          ux_mode: "redirect",
          redirect_uri: "https://seu-site.com/login-callback",
        });

        const buttonDiv = document.getElementById('google-sign-in');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: buttonDiv.offsetWidth
          });
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    try {
      const jwtPayload = JSON.parse(atob(response.credential.split('.')[1]));
      
      if (!jwtPayload.email) {
        throw new Error('Email não encontrado');
      }

      localStorage.setItem('biosim_user_data', JSON.stringify({
        name: jwtPayload.name || '',
        email: jwtPayload.email,
        whatsapp: '',
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        visits: 1
      }));

      onComplete();
    } catch (error) {
      console.error('Erro ao processar login:', error);
      alert('Erro ao fazer login. Por favor, tente novamente.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('biosim_user_data', JSON.stringify({
      ...formData,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visits: 1
    }));

    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-md my-4">
        <div className="max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Bem-vindo ao BioSim Lab!</h2>
          <p className="text-sm text-purple-200 mb-4">
            Para personalizar sua experiência e fornecer um melhor atendimento,
            precisamos de algumas informações básicas.
          </p>

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
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 mt-4 flex items-center justify-center gap-2 transition text-sm"
            >
              Começar a Explorar
              <ArrowRight className="w-4 h-4" />
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

export default WelcomeForm;
