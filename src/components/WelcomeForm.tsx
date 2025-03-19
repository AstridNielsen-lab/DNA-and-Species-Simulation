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

const API_URL = 'http://localhost:3001';

export default function WelcomeForm({ onComplete }: WelcomeFormProps) {
  // ... resto do código permanece igual até handleCredentialResponse

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      if (!response.credential) {
        throw new Error('Credenciais não encontradas na resposta do Google.');
      }

      const res = await fetch(`${API_URL}/api/auth/verify-google-token`, {
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
      localStorage.setItem('biosim_user_data', JSON.stringify(user));

      setIsLoggedIn(true);
      onComplete(user);

    } catch (error: any) {
      console.error('Erro ao processar login:', error);
      setError('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ... resto do código permanece igual
}