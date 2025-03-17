import React from 'react';
import AIChat from './AIChat';

export default function SpeciesCrossing() {
  const generateSpeciesPrompt = (message: string) => `
    Act as a DNA engineer and species creator. The user wants to create a new species. 
    Generate a response that includes:
    1. A brief description of the species based on the user's request
    2. A simulated DNA sequence (using A, T, C, G bases)
    3. Key traits and characteristics
    
    User request: ${message}
  `;

  return (
    <div className="space-y-6">
      <AIChat
        initialMessage="Hello! I'm your AI assistant for creating new species. Tell me what kind of creature you want to create, and I'll help generate its DNA sequence and traits!"
        generatePrompt={generateSpeciesPrompt}
      />
    </div>
  );
}