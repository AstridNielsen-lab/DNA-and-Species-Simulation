// src/components/LoginButton.tsx

import { useEffect } from 'react';

const LoginButton = () => {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID || '', // Use a variável de ambiente
        callback: handleCredentialResponse,
      });
      const buttonElement = document.getElementById('google-sign-in-button');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, { theme: 'outline', size: 'large' }); // customization attributes
      }
      window.google.accounts.id.prompt(); // also display the One Tap dialog
    };

    const handleCredentialResponse = (response: any) => {
      console.log('Encoded JWT ID token: ' + response.credential);
      // Aqui você pode enviar o token para o seu backend para verificação
    };

    if (typeof window.google !== 'undefined') {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google-sign-in-button"></div>;
};

export default LoginButton;