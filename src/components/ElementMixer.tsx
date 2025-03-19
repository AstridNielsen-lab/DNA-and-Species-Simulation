import React, { useState } from 'react';
import { FlaskRound as Flask, Plus, HelpCircle, Info, Atom, Zap } from 'lucide-react';
import AIChat from './AIChat';

interface Combination {
  formula: string;
  name: string;
  energy: number;
  description: string;
}

interface Element {
  symbol: string;
  name: string;
  category: string;
  atomicNumber: number;
  atomicMass: number;
  electronConfiguration: string;
  electronegativity?: number;
  oxidationStates: string;
  energyLevel: number;
}

const COMBINATIONS: {[key: string]: Combination} = {
  'H2O': {
    formula: 'H₂O',
    name: 'Água',
    energy: 285.8,
    description: 'Molécula essencial para a vida, formada por ligações covalentes polares.'
  },
  'NaCl': {
    formula: 'NaCl',
    name: 'Cloreto de Sódio',
    energy: 787,
    description: 'Composto iônico cristalino, conhecido como sal de cozinha.'
  }
};

const CATEGORIES = [
  'Metal Alcalino',
  'Metal Alcalino-terroso',
  'Metal de Transição',
  'Lantanídeo',
  'Actinídeo',
  'Metal Representativo',
  'Semimetal',
  'Não-metal',
  'Halogênio',
  'Gás Nobre'
] as const;

const ELEMENTS: Element[] = [
  {
    symbol: 'H',
    name: 'Hidrogênio',
    category: 'Não-metal',
    atomicNumber: 1,
    atomicMass: 1.008,
    electronConfiguration: '1s¹',
    electronegativity: 2.20,
    oxidationStates: '-1, +1',
    energyLevel: 1
  },
  {
    symbol: 'He',
    name: 'Hélio',
    category: 'Gás Nobre',
    atomicNumber: 2,
    atomicMass: 4.003,
    electronConfiguration: '1s²',
    oxidationStates: '0',
    energyLevel: 1
  },
  {
    symbol: 'Li',
    name: 'Lítio',
    category: 'Metal Alcalino',
    atomicNumber: 3,
    atomicMass: 6.941,
    electronConfiguration: '[He]2s¹',
    electronegativity: 0.98,
    oxidationStates: '+1',
    energyLevel: 2
  },
  {
    symbol: 'Be',
    name: 'Berílio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 4,
    atomicMass: 9.012,
    electronConfiguration: '[He]2s²',
    electronegativity: 1.57,
    oxidationStates: '+2',
    energyLevel: 2
  },
  {
    symbol: 'B',
    name: 'Boro',
    category: 'Semimetal',
    atomicNumber: 5,
    atomicMass: 10.811,
    electronConfiguration: '[He]2s²2p¹',
    electronegativity: 2.04,
    oxidationStates: '+3',
    energyLevel: 2
  },

  {
    symbol: 'C',
    name: 'Carbono',
    category: 'Não-metal',
    atomicNumber: 6,
    atomicMass: 12.011,
    electronConfiguration: '[He]2s²2p²',
    electronegativity: 2.55,
    oxidationStates: '-4, -3, -2, -1, +1, +2, +3, +4',
    energyLevel: 2
  },
  {
    symbol: 'N',
    name: 'Nitrogênio',
    category: 'Não-metal',
    atomicNumber: 7,
    atomicMass: 14.007,
    electronConfiguration: '[He]2s²2p³',
    electronegativity: 3.04,
    oxidationStates: '-3, -2, -1, +1, +2, +3, +4, +5',
    energyLevel: 2
  },
  {
    symbol: 'O',
    name: 'Oxigênio',
    category: 'Não-metal',
    atomicNumber: 8,
    atomicMass: 15.999,
    electronConfiguration: '[He]2s²2p⁴',
    electronegativity: 3.44,
    oxidationStates: '-2, -1, +1, +2',
    energyLevel: 2
  },
  {
    symbol: 'F',
    name: 'Flúor',
    category: 'Halogênio',
    atomicNumber: 9,
    atomicMass: 18.998,
    electronConfiguration: '[He]2s²2p⁵',
    electronegativity: 3.98,
    oxidationStates: '-1',
    energyLevel: 2
  },
  {
    symbol: 'Ne',
    name: 'Neônio',
    category: 'Gás Nobre',
    atomicNumber: 10,
    atomicMass: 20.180,
    electronConfiguration: '[He]2s²2p⁶',
    oxidationStates: '0',
    energyLevel: 2
  },
  {
    symbol: 'Na',
    name: 'Sódio',
    category: 'Metal Alcalino',
    atomicNumber: 11,
    atomicMass: 22.990,
    electronConfiguration: '[Ne]3s¹',
    electronegativity: 0.93,
    oxidationStates: '+1',
    energyLevel: 3
  },
  {
    symbol: 'Mg',
    name: 'Magnésio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 12,
    atomicMass: 24.305,
    electronConfiguration: '[Ne]3s²',
    electronegativity: 1.31,
    oxidationStates: '+2',
    energyLevel: 3
  },
  {
    symbol: 'Al',
    name: 'Alumínio',
    category: 'Metal Representativo',
    atomicNumber: 13,
    atomicMass: 26.982,
    electronConfiguration: '[Ne]3s²3p¹',
    electronegativity: 1.61,
    oxidationStates: '+3',
    energyLevel: 3
  },
  {
    symbol: 'Si',
    name: 'Silício',
    category: 'Semimetal',
    atomicNumber: 14,
    atomicMass: 28.086,
    electronConfiguration: '[Ne]3s²3p²',
    electronegativity: 1.90,
    oxidationStates: '-4, +2, +4',
    energyLevel: 3
  },
  {
    symbol: 'P',
    name: 'Fósforo',
    category: 'Não-metal',
    atomicNumber: 15,
    atomicMass: 30.974,
    electronConfiguration: '[Ne]3s²3p³',
    electronegativity: 2.19,
    oxidationStates: '-3, +3, +5',
    energyLevel: 3
  },
  {
    symbol: 'S',
    name: 'Enxofre',
    category: 'Não-metal',
    atomicNumber: 16,
    atomicMass: 32.065,
    electronConfiguration: '[Ne]3s²3p⁴',
    electronegativity: 2.58,
    oxidationStates: '-2, +2, +4, +6',
    energyLevel: 3
  },
  {
    symbol: 'Cl',
    name: 'Cloro',
    category: 'Halogênio',
    atomicNumber: 17,
    atomicMass: 35.453,
    electronConfiguration: '[Ne]3s²3p⁵',
    electronegativity: 3.16,
    oxidationStates: '-1, +1, +3, +5, +7',
    energyLevel: 3
  },
  {
    symbol: 'Ar',
    name: 'Argônio',
    category: 'Gás Nobre',
    atomicNumber: 18,
    atomicMass: 39.948,
    electronConfiguration: '[Ne]3s²3p⁶',
    oxidationStates: '0',
    energyLevel: 3
  },
  {
    symbol: 'K',
    name: 'Potássio',
    category: 'Metal Alcalino',
    atomicNumber: 19,
    atomicMass: 39.098,
    electronConfiguration: '[Ar]4s¹',
    electronegativity: 0.82,
    oxidationStates: '+1',
    energyLevel: 4
  },
  {
    symbol: 'Ca',
    name: 'Cálcio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 20,
    atomicMass: 40.078,
    electronConfiguration: '[Ar]4s²',
    electronegativity: 1.00,
    oxidationStates: '+2',
    energyLevel: 4
  },
  {
    symbol: 'Sc',
    name: 'Escândio',
    category: 'Metal de Transição',
    atomicNumber: 21,
    atomicMass: 44.956,
    electronConfiguration: '[Ar]3d¹4s²',
    electronegativity: 1.36,
    oxidationStates: '+3',
    energyLevel: 4
  },
  {
    symbol: 'Ti',
    name: 'Titânio',
    category: 'Metal de Transição',
    atomicNumber: 22,
    atomicMass: 47.867,
    electronConfiguration: '[Ar]3d²4s²',
    electronegativity: 1.54,
    oxidationStates: '+2, +3, +4',
    energyLevel: 4
  },
  {
    symbol: 'V',
    name: 'Vanádio',
    category: 'Metal de Transição',
    atomicNumber: 23,
    atomicMass: 50.942,
    electronConfiguration: '[Ar]3d³4s²',
    electronegativity: 1.63,
    oxidationStates: '+2, +3, +4, +5',
    energyLevel: 4
  },
  {
    symbol: 'Cr',
    name: 'Cromo',
    category: 'Metal de Transição',
    atomicNumber: 24,
    atomicMass: 51.996,
    electronConfiguration: '[Ar]3d⁵4s¹',
    electronegativity: 1.66,
    oxidationStates: '+2, +3, +6',
    energyLevel: 4
  },
  {
    symbol: 'Mn',
    name: 'Manganês',
    category: 'Metal de Transição',
    atomicNumber: 25,
    atomicMass: 54.938,
    electronConfiguration: '[Ar]3d⁵4s²',
    electronegativity: 1.55,
    oxidationStates: '+2, +3, +4, +6, +7',
    energyLevel: 4
  },
  {
    symbol: 'Fe',
    name: 'Ferro',
    category: 'Metal de Transição',
    atomicNumber: 26,
    atomicMass: 55.845,
    electronConfiguration: '[Ar]3d⁶4s²',
    electronegativity: 1.83,
    oxidationStates: '+2, +3',
    energyLevel: 4
  },
  {
    symbol: 'Co',
    name: 'Cobalto',
    category: 'Metal de Transição',
    atomicNumber: 27,
    atomicMass: 58.933,
    electronConfiguration: '[Ar]3d⁷4s²',
    electronegativity: 1.88,
    oxidationStates: '+2, +3',
    energyLevel: 4
  },
  {
    symbol: 'Ni',
    name: 'Níquel',
    category: 'Metal de Transição',
    atomicNumber: 28,
    atomicMass: 58.693,
    electronConfiguration: '[Ar]3d⁸4s²',
    electronegativity: 1.91,
    oxidationStates: '+2, +3',
    energyLevel: 4
  },
  {
    symbol: 'Cu',
    name: 'Cobre',
    category: 'Metal de Transição',
    atomicNumber: 29,
    atomicMass: 63.546,
    electronConfiguration: '[Ar]3d¹⁰4s¹',
    electronegativity: 1.90,
    oxidationStates: '+1, +2',
    energyLevel: 4
  },
  {
    symbol: 'Zn',
    name: 'Zinco',
    category: 'Metal de Transição',
    atomicNumber: 30,
    atomicMass: 65.380,
    electronConfiguration: '[Ar]3d¹⁰4s²',
    electronegativity: 1.65,
    oxidationStates: '+2',
    energyLevel: 4
  },
  {
    symbol: 'Ga',
    name: 'Gálio',
    category: 'Metal Representativo',
    atomicNumber: 31,
    atomicMass: 69.723,
    electronConfiguration: '[Ar]3d¹⁰4s²4p¹',
    electronegativity: 1.81,
    oxidationStates: '+3',
    energyLevel: 4
  },
  {
    symbol: 'Ge',
    name: 'Germânio',
    category: 'Semimetal',
    atomicNumber: 32,
    atomicMass: 72.640,
    electronConfiguration: '[Ar]3d¹⁰4s²4p²',
    electronegativity: 2.01,
    oxidationStates: '+2, +4',
    energyLevel: 4
  },
  {
    symbol: 'As',
    name: 'Arsênio',
    category: 'Semimetal',
    atomicNumber: 33,
    atomicMass: 74.922,
    electronConfiguration: '[Ar]3d¹⁰4s²4p³',
    electronegativity: 2.18,
    oxidationStates: '-3, +3, +5',
    energyLevel: 4
  },
  {
    symbol: 'Se',
    name: 'Selênio',
    category: 'Não-metal',
    atomicNumber: 34,
    atomicMass: 78.960,
    electronConfiguration: '[Ar]3d¹⁰4s²4p⁴',
    electronegativity: 2.55,
    oxidationStates: '-2, +4, +6',
    energyLevel: 4
  },
  {
    symbol: 'Br',
    name: 'Bromo',
    category: 'Halogênio',
    atomicNumber: 35,
    atomicMass: 79.904,
    electronConfiguration: '[Ar]3d¹⁰4s²4p⁵',
    electronegativity: 2.96,
    oxidationStates: '-1, +1, +3, +5',
    energyLevel: 4
  },
  {
    symbol: 'Kr',
    name: 'Criptônio',
    category: 'Gás Nobre',
    atomicNumber: 36,
    atomicMass: 83.798,
    electronConfiguration: '[Ar]3d¹⁰4s²4p⁶',
    oxidationStates: '0',
    energyLevel: 4
  },
  {
    symbol: 'Rb',
    name: 'Rubídio',
    category: 'Metal Alcalino',
    atomicNumber: 37,
    atomicMass: 85.468,
    electronConfiguration: '[Kr]5s¹',
    electronegativity: 0.82,
    oxidationStates: '+1',
    energyLevel: 5
  },
  {
    symbol: 'Sr',
    name: 'Estrôncio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 38,
    atomicMass: 87.62,
    electronConfiguration: '[Kr]5s²',
    electronegativity: 0.95,
    oxidationStates: '+2',
    energyLevel: 5
  },
  {
    symbol: 'Y',
    name: 'Ítrio',
    category: 'Metal de Transição',
    atomicNumber: 39,
    atomicMass: 88.906,
    electronConfiguration: '[Kr]4d¹5s²',
    electronegativity: 1.22,
    oxidationStates: '+3',
    energyLevel: 5
  },
  {
    symbol: 'Zr',
    name: 'Zircônio',
    category: 'Metal de Transição',
    atomicNumber: 40,
    atomicMass: 91.224,
    electronConfiguration: '[Kr]4d²5s²',
    electronegativity: 1.33,
    oxidationStates: '+2, +3, +4',
    energyLevel: 5
  },
  {
    symbol: 'Nb',
    name: 'Nióbio',
    category: 'Metal de Transição',
    atomicNumber: 41,
    atomicMass: 92.906,
    electronConfiguration: '[Kr]4d⁴5s¹',
    electronegativity: 1.6,
    oxidationStates: '+3, +4, +5',
    energyLevel: 5
  },
  {
    symbol: 'Mo',
    name: 'Molibdênio',
    category: 'Metal de Transição',
    atomicNumber: 42,
    atomicMass: 95.95,
    electronConfiguration: '[Kr]4d⁵5s¹',
    electronegativity: 2.16,
    oxidationStates: '+2, +3, +4, +5, +6',
    energyLevel: 5
  },
  {
    symbol: 'Tc',
    name: 'Tecnécio',
    category: 'Metal de Transição',
    atomicNumber: 43,
    atomicMass: 98,
    electronConfiguration: '[Kr]4d⁵5s²',
    electronegativity: 1.9,
    oxidationStates: '+4, +5, +6, +7',
    energyLevel: 5
  },
  {
    symbol: 'Ru',
    name: 'Rutênio',
    category: 'Metal de Transição',
    atomicNumber: 44,
    atomicMass: 101.07,
    electronConfiguration: '[Kr]4d⁷5s¹',
    electronegativity: 2.2,
    oxidationStates: '+2, +3, +4, +6, +8',
    energyLevel: 5
  },
  {
    symbol: 'Rh',
    name: 'Ródio',
    category: 'Metal de Transição',
    atomicNumber: 45,
    atomicMass: 102.91,
    electronConfiguration: '[Kr]4d⁸5s¹',
    electronegativity: 2.28,
    oxidationStates: '+2, +3, +4',
    energyLevel: 5
  },
  {
    symbol: 'Pd',
    name: 'Paládio',
    category: 'Metal de Transição',
    atomicNumber: 46,
    atomicMass: 106.42,
    electronConfiguration: '[Kr]4d¹⁰',
    electronegativity: 2.2,
    oxidationStates: '+2, +4',
    energyLevel: 5
  },
  {
    symbol: 'Ag',
    name: 'Prata',
    category: 'Metal de Transição',
    atomicNumber: 47,
    atomicMass: 107.87,
    electronConfiguration: '[Kr]4d¹⁰5s¹',
    electronegativity: 1.93,
    oxidationStates: '+1',
    energyLevel: 5
  },
  {
    symbol: 'Cd',
    name: 'Cádmio',
    category: 'Metal de Transição',
    atomicNumber: 48,
    atomicMass: 112.41,
    electronConfiguration: '[Kr]4d¹⁰5s²',
    electronegativity: 1.69,
    oxidationStates: '+2',
    energyLevel: 5
  },
  {
    symbol: 'In',
    name: 'Índio',
    category: 'Metal Representativo',
    atomicNumber: 49,
    atomicMass: 114.82,
    electronConfiguration: '[Kr]4d¹⁰5s²5p¹',
    electronegativity: 1.78,
    oxidationStates: '+3',
    energyLevel: 5
  },
  {
    symbol: 'Sn',
    name: 'Estanho',
    category: 'Metal Representativo',
    atomicNumber: 50,
    atomicMass: 118.71,
    electronConfiguration: '[Kr]4d¹⁰5s²5p²',
    electronegativity: 1.96,
    oxidationStates: '+2, +4',
    energyLevel: 5
  },
  {
    symbol: 'Sb',
    name: 'Antimônio',
    category: 'Semimetal',
    atomicNumber: 51,
    atomicMass: 121.76,
    electronConfiguration: '[Kr]4d¹⁰5s²5p³',
    electronegativity: 2.05,
    oxidationStates: '-3, +3, +5',
    energyLevel: 5
  },
  {
    symbol: 'Te',
    name: 'Telúrio',
    category: 'Semimetal',
    atomicNumber: 52,
    atomicMass: 127.60,
    electronConfiguration: '[Kr]4d¹⁰5s²5p⁴',
    electronegativity: 2.1,
    oxidationStates: '-2, +4, +6',
    energyLevel: 5
  },
  {
    symbol: 'I',
    name: 'Iodo',
    category: 'Halogênio',
    atomicNumber: 53,
    atomicMass: 126.90,
    electronConfiguration: '[Kr]4d¹⁰5s²5p⁵',
    electronegativity: 2.66,
    oxidationStates: '-1, +1, +3, +5, +7',
    energyLevel: 5
  },
  {
    symbol: 'Xe',
    name: 'Xenônio',
    category: 'Gás Nobre',
    atomicNumber: 54,
    atomicMass: 131.29,
    electronConfiguration: '[Kr]4d¹⁰5s²5p⁶',
    oxidationStates: '0',
    energyLevel: 5
  },
  {
    symbol: 'Cs',
    name: 'Césio',
    category: 'Metal Alcalino',
    atomicNumber: 55,
    atomicMass: 132.91,
    electronConfiguration: '[Xe]6s¹',
    electronegativity: 0.79,
    oxidationStates: '+1',
    energyLevel: 6
  },
  {
    symbol: 'Ba',
    name: 'Bário',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 56,
    atomicMass: 137.33,
    electronConfiguration: '[Xe]6s²',
    electronegativity: 0.89,
    oxidationStates: '+2',
    energyLevel: 6
  },
  {
    symbol: 'La',
    name: 'Lantânio',
    category: 'Lantanídeo',
    atomicNumber: 57,
    atomicMass: 138.91,
    electronConfiguration: '[Xe]5d¹6s²',
    electronegativity: 1.10,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Ce',
    name: 'Cério',
    category: 'Lantanídeo',
    atomicNumber: 58,
    atomicMass: 140.12,
    electronConfiguration: '[Xe]4f¹5d¹6s²',
    electronegativity: 1.12,
    oxidationStates: '+3, +4',
    energyLevel: 6
  },
  {
    symbol: 'Pr',
    name: 'Praseodímio',
    category: 'Lantanídeo',
    atomicNumber: 59,
    atomicMass: 140.91,
    electronConfiguration: '[Xe]4f³6s²',
    electronegativity: 1.13,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Nd',
    name: 'Neodímio',
    category: 'Lantanídeo',
    atomicNumber: 60,
    atomicMass: 144.24,
    electronConfiguration: '[Xe]4f⁴6s²',
    electronegativity: 1.14,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Pm',
    name: 'Promécio',
    category: 'Lantanídeo',
    atomicNumber: 61,
    atomicMass: 145,
    electronConfiguration: '[Xe]4f⁵6s²',
    electronegativity: 1.13,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Sm',
    name: 'Samário',
    category: 'Lantanídeo',
    atomicNumber: 62,
    atomicMass: 150.36,
    electronConfiguration: '[Xe]4f⁶6s²',
    electronegativity: 1.17,
    oxidationStates: '+2, +3',
    energyLevel: 6
  },
  {
    symbol: 'Eu',
    name: 'Európio',
    category: 'Lantanídeo',
    atomicNumber: 63,
    atomicMass: 151.96,
    electronConfiguration: '[Xe]4f⁷6s²',
    electronegativity: 1.2,
    oxidationStates: '+2, +3',
    energyLevel: 6
  },
  {
    symbol: 'Gd',
    name: 'Gadolínio',
    category: 'Lantanídeo',
    atomicNumber: 64,
    atomicMass: 157.25,
    electronConfiguration: '[Xe]4f⁷5d¹6s²',
    electronegativity: 1.20,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Tb',
    name: 'Térbio',
    category: 'Lantanídeo',
    atomicNumber: 65,
    atomicMass: 158.93,
    electronConfiguration: '[Xe]4f⁹6s²',
    electronegativity: 1.2,
    oxidationStates: '+3, +4',
    energyLevel: 6
  },
  {
    symbol: 'Dy',
    name: 'Disprósio',
    category: 'Lantanídeo',
    atomicNumber: 66,
    atomicMass: 162.50,
    electronConfiguration: '[Xe]4f¹⁰6s²',
    electronegativity: 1.22,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Ho',
    name: 'Hólmio',
    category: 'Lantanídeo',
    atomicNumber: 67,
    atomicMass: 164.93,
    electronConfiguration: '[Xe]4f¹¹6s²',
    electronegativity: 1.23,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Er',
    name: 'Érbio',
    category: 'Lantanídeo',
    atomicNumber: 68,
    atomicMass: 167.26,
    electronConfiguration: '[Xe]4f¹²6s²',
    electronegativity: 1.24,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Tm',
    name: 'Túlio',
    category: 'Lantanídeo',
    atomicNumber: 69,
    atomicMass: 168.93,
    electronConfiguration: '[Xe]4f¹³6s²',
    electronegativity: 1.25,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Yb',
    name: 'Itérbio',
    category: 'Lantanídeo',
    atomicNumber: 70,
    atomicMass: 173.05,
    electronConfiguration: '[Xe]4f¹⁴6s²',
    electronegativity: 1.1,
    oxidationStates: '+2, +3',
    energyLevel: 6
  },
  {
    symbol: 'Lu',
    name: 'Lutécio',
    category: 'Lantanídeo',
    atomicNumber: 71,
    atomicMass: 174.97,
    electronConfiguration: '[Xe]4f¹⁴5d¹6s²',
    electronegativity: 1.27,
    oxidationStates: '+3',
    energyLevel: 6
  },
  {
    symbol: 'Hf',
    name: 'Háfnio',
    category: 'Metal de Transição',
    atomicNumber: 72,
    atomicMass: 178.49,
    electronConfiguration: '[Xe]4f¹⁴5d²6s²',
    electronegativity: 1.3,
    oxidationStates: '+4',
    energyLevel: 6
  },
  {
    symbol: 'Ta',
    name: 'Tântalo',
    category: 'Metal de Transição',
    atomicNumber: 73,
    atomicMass: 180.95,
    electronConfiguration: '[Xe]4f¹⁴5d³6s²',
    electronegativity: 1.5,
    oxidationStates: '+5',
    energyLevel: 6
  },
  {
    symbol: 'W',
    name: 'Tungstênio',
    category: 'Metal de Transição',
    atomicNumber: 74,
    atomicMass: 183.84,
    electronConfiguration: '[Xe]4f¹⁴5d⁴6s²',
    electronegativity: 2.36,
    oxidationStates: '+2, +3, +4, +5, +6',
    energyLevel: 6
  },
  {
    symbol: 'Re',
    name: 'Rênio',
    category: 'Metal de Transição',
    atomicNumber: 75,
    atomicMass: 186.21,
    electronConfiguration: '[Xe]4f¹⁴5d⁵6s²',
    electronegativity: 1.9,
    oxidationStates: '+2, +4, +6, +7',
    energyLevel: 6
  },
  {
    symbol: 'Os',
    name: 'Ósmio',
    category: 'Metal de Transição',
    atomicNumber: 76,
    atomicMass: 190.23,
    electronConfiguration: '[Xe]4f¹⁴5d⁶6s²',
    electronegativity: 2.2,
    oxidationStates: '+2, +3, +4, +6, +8',
    energyLevel: 6
  },
  {
    symbol: 'Ir',
    name: 'Irídio',
    category: 'Metal de Transição',
    atomicNumber: 77,
    atomicMass: 192.22,
    electronConfiguration: '[Xe]4f¹⁴5d⁷6s²',
    electronegativity: 2.2,
    oxidationStates: '+2, +3, +4, +6',
    energyLevel: 6
  },
  {
    symbol: 'Pt',
    name: 'Platina',
    category: 'Metal de Transição',
    atomicNumber: 78,
    atomicMass: 195.08,
    electronConfiguration: '[Xe]4f¹⁴5d⁹6s¹',
    electronegativity: 2.28,
    oxidationStates: '+2, +4',
    energyLevel: 6
  },
  {
    symbol: 'Au',
    name: 'Ouro',
    category: 'Metal de Transição',
    atomicNumber: 79,
    atomicMass: 196.97,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s¹',
    electronegativity: 2.54,
    oxidationStates: '+1, +3',
    energyLevel: 6
  },
  {
    symbol: 'Hg',
    name: 'Mercúrio',
    category: 'Metal de Transição',
    atomicNumber: 80,
    atomicMass: 200.59,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²',
    electronegativity: 2.00,
    oxidationStates: '+1, +2',
    energyLevel: 6
  },
  {
    symbol: 'Tl',
    name: 'Tálio',
    category: 'Metal Representativo',
    atomicNumber: 81,
    atomicMass: 204.38,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²6p¹',
    electronegativity: 1.62,
    oxidationStates: '+1, +3',
    energyLevel: 6
  },
  {
    symbol: 'Pb',
    name: 'Chumbo',
    category: 'Metal Representativo',
    atomicNumber: 82,
    atomicMass: 207.2,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²6p²',
    electronegativity: 2.33,
    oxidationStates: '+2, +4',
    energyLevel: 6
  },
  {
    symbol: 'Bi',
    name: 'Bismuto',
    category: 'Metal Representativo',
    atomicNumber: 83,
    atomicMass: 208.98,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²6p³',
    electronegativity: 2.02,
    oxidationStates: '+3, +5',
    energyLevel: 6
  },
  {
    symbol: 'Po',
    name: 'Polônio',
    category: 'Semimetal',
    atomicNumber: 84,
    atomicMass: 209,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²6p⁴',
    electronegativity: 2.0,
    oxidationStates: '+2, +4',
    energyLevel: 6
  },
  {
    symbol: 'At',
    name: 'Astato',
    category: 'Halogênio',
    atomicNumber: 85,
    atomicMass: 210,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²6p⁵',
    electronegativity: 2.2,
    oxidationStates: '-1, +1, +3, +5, +7',
    energyLevel: 6
  },
  {
    symbol: 'Rn',
    name: 'Radônio',
    category: 'Gás Nobre',
    atomicNumber: 86,
    atomicMass: 222,
    electronConfiguration: '[Xe]4f¹⁴5d¹⁰6s²6p⁶',
    oxidationStates: '0',
    energyLevel: 6
  },
  {
    symbol: 'Fr',
    name: 'Frâncio',
    category: 'Metal Alcalino',
    atomicNumber: 87,
    atomicMass: 223,
    electronConfiguration: '[Rn]7s¹',
    electronegativity: 0.7,
    oxidationStates: '+1',
    energyLevel: 7
  },
  {
    symbol: 'Ra',
    name: 'Rádio',
    category: 'Metal Alcalino-terroso',
    atomicNumber: 88,
    atomicMass: 226,
    electronConfiguration: '[Rn]7s²',
    electronegativity: 0.9,
    oxidationStates: '+2',
    energyLevel: 7
  },
  {
    symbol: 'Ac',
    name: 'Actínio',
    category: 'Actinídeo',
    atomicNumber: 89,
    atomicMass: 227,
    electronConfiguration: '[Rn]6d¹7s²',
    electronegativity: 1.1,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Th',
    name: 'Tório',
    category: 'Actinídeo',
    atomicNumber: 90,
    atomicMass: 232.04,
    electronConfiguration: '[Rn]6d²7s²',
    electronegativity: 1.3,
    oxidationStates: '+4',
    energyLevel: 7
  },
  {
    symbol: 'Pa',
    name: 'Protactínio',
    category: 'Actinídeo',
    atomicNumber: 91,
    atomicMass: 231.04,
    electronConfiguration: '[Rn]5f²6d¹7s²',
    electronegativity: 1.5,
    oxidationStates: '+4, +5',
    energyLevel: 7
  },
  {
    symbol: 'U',
    name: 'Urânio',
    category: 'Actinídeo',
    atomicNumber: 92,
    atomicMass: 238.03,
    electronConfiguration: '[Rn]5f³6d¹7s²',
    electronegativity: 1.38,
    oxidationStates: '+3, +4, +5, +6',
    energyLevel: 7
  },
  {
    symbol: 'Np',
    name: 'Netúnio',
    category: 'Actinídeo',
    atomicNumber: 93,
    atomicMass: 237,
    electronConfiguration: '[Rn]5f⁴6d¹7s²',
    electronegativity: 1.36,
    oxidationStates: '+3, +4, +5, +6',
    energyLevel: 7
  },
  {
    symbol: 'Pu',
    name: 'Plutônio',
    category: 'Actinídeo',
    atomicNumber: 94,
    atomicMass: 244,
    electronConfiguration: '[Rn]5f⁶7s²',
    electronegativity: 1.28,
    oxidationStates: '+3, +4, +5, +6',
    energyLevel: 7
  },
  {
    symbol: 'Am',
    name: 'Amerício',
    category: 'Actinídeo',
    atomicNumber: 95,
    atomicMass: 243,
    electronConfiguration: '[Rn]5f⁷7s²',
    electronegativity: 1.3,
    oxidationStates: '+3, +4, +5, +6',
    energyLevel: 7
  },
  {
    symbol: 'Cm',
    name: 'Cúrio',
    category: 'Actinídeo',
    atomicNumber: 96,
    atomicMass: 247,
    electronConfiguration: '[Rn]5f⁷6d¹7s²',
    electronegativity: 1.3,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Bk',
    name: 'Berquélio',
    category: 'Actinídeo',
    atomicNumber: 97,
    atomicMass: 247,
    electronConfiguration: '[Rn]5f⁹7s²',
    electronegativity: 1.3,
    oxidationStates: '+3, +4',
    energyLevel: 7
  },
  {
    symbol: 'Cf',
    name: 'Califórnio',
    category: 'Actinídeo',
    atomicNumber: 98,
    atomicMass: 251,
    electronConfiguration: '[Rn]5f¹⁰7s²',
    electronegativity: 1.3,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Es',
    name: 'Einstênio',
    category: 'Actinídeo',
    atomicNumber: 99,
    atomicMass: 252,
    electronConfiguration: '[Rn]5f¹¹7s²',
    electronegativity: 1.3,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Fm',
    name: 'Férmio',
    category: 'Actinídeo',
    atomicNumber: 100,
    atomicMass: 257,
    electronConfiguration: '[Rn]5f¹²7s²',
    electronegativity: 1.3,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Md',
    name: 'Mendelévio',
    category: 'Actinídeo',
    atomicNumber: 101,
    atomicMass: 258,
    electronConfiguration: '[Rn]5f¹³7s²',
    electronegativity: 1.3,
    oxidationStates: '+2, +3',
    energyLevel: 7
  },
  {
    symbol: 'No',
    name: 'Nobélio',
    category: 'Actinídeo',
    atomicNumber: 102,
    atomicMass: 259,
    electronConfiguration: '[Rn]5f¹⁴7s²',
    electronegativity: 1.3,
    oxidationStates: '+2, +3',
    energyLevel: 7
  },
  {
    symbol: 'Lr',
    name: 'Laurêncio',
    category: 'Actinídeo',
    atomicNumber: 103,
    atomicMass: 262,
    electronConfiguration: '[Rn]5f¹⁴7s²7p¹',
    electronegativity: 1.3,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Rf',
    name: 'Rutherfórdio',
    category: 'Metal de Transição',
    atomicNumber: 104,
    atomicMass: 267,
    electronConfiguration: '[Rn]5f¹⁴6d²7s²',
    electronegativity: 1.3,
    oxidationStates: '+4',
    energyLevel: 7
  },
  {
    symbol: 'Db',
    name: 'Dúbnio',
    category: 'Metal de Transição',
    atomicNumber: 105,
    atomicMass: 268,
    electronConfiguration: '[Rn]5f¹⁴6d³7s²',
    electronegativity: 1.3,
    oxidationStates: '+5',
    energyLevel: 7
  },
  {
    symbol: 'Sg',
    name: 'Seabórgio',
    category: 'Metal de Transição',
    atomicNumber: 106,
    atomicMass: 269,
    electronConfiguration: '[Rn]5f¹⁴6d⁴7s²',
    electronegativity: 1.3,
    oxidationStates: '+6',
    energyLevel: 7
  },
  {
    symbol: 'Bh',
    name: 'Bóhrio',
    category: 'Metal de Transição',
    atomicNumber: 107,
    atomicMass: 270,
    electronConfiguration: '[Rn]5f¹⁴6d⁵7s²',
    electronegativity: 1.3,
    oxidationStates: '+7',
    energyLevel: 7
  },
  {
    symbol: 'Hs',
    name: 'Hássio',
    category: 'Metal de Transição',
    atomicNumber: 108,
    atomicMass: 269,
    electronConfiguration: '[Rn]5f¹⁴6d⁶7s²',
    electronegativity: 1.3,
    oxidationStates: '+8',
    energyLevel: 7
  },
  {
    symbol: 'Mt',
    name: 'Meitnério',
    category: 'Metal de Transição',
    atomicNumber: 109,
    atomicMass: 278,
    electronConfiguration: '[Rn]5f¹⁴6d⁷7s²',
    electronegativity: 1.3,
    oxidationStates: '+3, +4, +6',
    energyLevel: 7
  },
  {
    symbol: 'Ds',
    name: 'Darmstádtio',
    category: 'Metal de Transição',
    atomicNumber: 110,
    atomicMass: 281,
    electronConfiguration: '[Rn]5f¹⁴6d⁸7s²',
    electronegativity: 1.3,
    oxidationStates: '+6',
    energyLevel: 7
  },
  {
    symbol: 'Rg',
    name: 'Roentgênio',
    category: 'Metal de Transição',
    atomicNumber: 111,
    atomicMass: 282,
    electronConfiguration: '[Rn]5f¹⁴6d⁹7s²',
    electronegativity: 1.3,
    oxidationStates: '+3',
    energyLevel: 7
  },
  {
    symbol: 'Cn',
    name: 'Copernício',
    category: 'Metal de Transição',
    atomicNumber: 112,
    atomicMass: 285,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²',
    electronegativity: 1.3,
    oxidationStates: '+2, +4',
    energyLevel: 7
  },
  {
    symbol: 'Nh',
    name: 'Nihônio',
    category: 'Metal Representativo',
    atomicNumber: 113,
    atomicMass: 286,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²7p¹',
    electronegativity: 1.3,
    oxidationStates: '+1, +3, +5',
    energyLevel: 7
  },
  {
    symbol: 'Fl',
    name: 'Fleróvio',
    category: 'Metal Representativo',
    atomicNumber: 114,
    atomicMass: 289,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²7p²',
    electronegativity: 1.3,
    oxidationStates: '+2, +4',
    energyLevel: 7
  },
  {
    symbol: 'Mc',
    name: 'Moscóvio',
    category: 'Metal Representativo',
    atomicNumber: 115,
    atomicMass: 290,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²7p³',
    electronegativity: 1.3,
    oxidationStates: '+1, +3',
    energyLevel: 7
  },
  {
    symbol: 'Lv',
    name: 'Livermório',
    category: 'Metal Representativo',
    atomicNumber: 116,
    atomicMass: 293,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²7p⁴',
    electronegativity: 1.3,
    oxidationStates: '+2, +4',
    energyLevel: 7
  },
  {
    symbol: 'Ts',
    name: 'Tenesso',
    category: 'Halogênio',
    atomicNumber: 117,
    atomicMass: 294,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²7p⁵',
    electronegativity: 1.3,
    oxidationStates: '-1, +1, +3, +5',
    energyLevel: 7
  },
  {
    symbol: 'Og',
    name: 'Oganessônio',
    category: 'Gás Nobre',
    atomicNumber: 118,
    atomicMass: 294,
    electronConfiguration: '[Rn]5f¹⁴6d¹⁰7s²7p⁶',
    oxidationStates: '0',
    energyLevel: 7
  }  
];

export default function ElementMixer() {
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [result, setResult] = useState<Combination | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const addElement = (element: Element) => {
    setSelectedElements(prev => [...prev, element]);
  };

  const mix = () => {
    const formula = selectedElements
      .map(e => e.symbol)
      .sort()
      .join('');

    const combination = COMBINATIONS[formula];
    
    if (combination) {
      setResult(combination);
    } else {
      const theoreticalEnergy = selectedElements.reduce((acc: number, element: Element) => {
        return acc + (element.electronegativity || 0.5) * 100;
      }, 0);

      setResult({
        formula,
        name: 'Combinação Teórica',
        energy: theoreticalEnergy,
        description: 'Combinação experimental com energia teórica calculada.'
      });
    }
    
    setSelectedElements([]);
  };

  const clearSelection = () => {
    setSelectedElements([]);
    setResult(null);
  };

  const filteredElements = selectedCategory === 'all' 
    ? ELEMENTS 
    : ELEMENTS.filter(e => e.category === selectedCategory);

  const generateElementPrompt = (message: string) => `
    Atue como um especialista em química quântica e estrutura atômica.
    Analise a seguinte consulta considerando:
    1. Estrutura eletrônica dos elementos
    2. Propriedades quânticas e energéticas
    3. Possíveis interações e ligações
    4. Cálculos de energia e estabilidade
    
    Elementos selecionados: ${selectedElements.map(e => e.symbol).join(', ')}
    Solicitação do usuário: ${message}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Atom className="w-6 h-6" />
            Simulador Quântico de Elementos
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="text-blue-300 hover:text-blue-200 transition"
              title="Tutorial"
            >
              <Info className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-purple-300 hover:text-purple-200 transition"
              title="Ajuda"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showTutorial && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-blue-300 mb-2">Tutorial do Simulador Quântico</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-200">1. Estrutura Atômica</h4>
                <p>Cada elemento possui:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li><span className="text-blue-300">Número atômico</span> - Quantidade de prótons</li>
                  <li><span className="text-blue-300">Configuração eletrônica</span> - Distribuição dos elétrons</li>
                  <li><span className="text-blue-300">Eletronegatividade</span> - Tendência de atrair elétrons</li>
                  <li><span className="text-blue-300">Estados de oxidação</span> - Cargas possíveis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">2. Energia Quântica</h4>
                <p>A energia é calculada considerando:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Ligações químicas</li>
                  <li>Estados de oxidação</li>
                  <li>Interações eletrônicas</li>
                  <li>Estabilidade molecular</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200">3. Combinações</h4>
                <p>Ao misturar elementos:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Observe a energia liberada/absorvida</li>
                  <li>Analise a estabilidade</li>
                  <li>Verifique as ligações formadas</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Como usar o Simulador:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Selecione elementos da tabela periódica</li>
              <li>Combine-os para formar moléculas</li>
              <li>Analise a energia e estabilidade</li>
              <li>Use o assistente IA para cálculos avançados</li>
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filtrar por Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/30 text-white rounded-lg px-4 py-2 w-full"
          >
            <option value="all">Todos os Elementos</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-6">
          {filteredElements.map(element => (
            <button
              key={element.symbol}
              onClick={() => addElement(element)}
              onMouseEnter={() => setShowDetails(element.symbol)}
              onMouseLeave={() => setShowDetails(null)}
              className="relative bg-black/30 hover:bg-black/40 p-2 rounded-lg transition text-center group"
            >
              <div className="text-xs text-purple-300">{element.atomicNumber}</div>
              <div className="text-xl font-bold">{element.symbol}</div>
              <div className="text-xs text-white/70 truncate">{element.name}</div>
              
              {showDetails === element.symbol && (
                <div className="absolute z-10 left-0 right-0 bottom-full mb-2 bg-black/90 rounded-lg p-3 text-left text-sm">
                  <h4 className="font-bold mb-1">{element.name}</h4>
                  <p>Número Atômico: {element.atomicNumber}</p>
                  <p>Massa Atômica: {element.atomicMass}</p>
                  <p>Configuração: {element.electronConfiguration}</p>
                  <p>Estados de Oxidação: {element.oxidationStates}</p>
                  {element.electronegativity && (
                    <p>Eletronegatividade: {element.electronegativity}</p>
                  )}
                  <p>Nível de Energia: {element.energyLevel}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="bg-black/30 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Elementos Selecionados:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedElements.map((element, index) => (
              <span
                key={index}
                className="bg-purple-500 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {element.symbol}
                <span className="text-xs">({element.atomicNumber})</span>
              </span>
            ))}
            {selectedElements.length === 0 && (
              <span className="text-white/70 italic">Selecione elementos para simular</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={mix}
            disabled={selectedElements.length < 2}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 px-4 py-2 rounded-lg transition"
          >
            <Zap className="w-5 h-5" />
            Simular Interação
          </button>
          <button
            onClick={clearSelection}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            Limpar
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white/10 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Resultado da Simulação</h3>
          <div className="bg-black/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xl font-mono">{result.formula.replace(/(\d)/g, '₀$1').replace(/0/g, '')}</p>
              <span className="text-sm bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                {result.name}
              </span>
            </div>
            <div className="text-sm text-white/70">{result.description}</div>
            <div className="mt-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Energia: {result.energy.toFixed(2)} kJ/mol</span>
            </div>
          </div>
        </div>
      )}

      <AIChat
        initialMessage="Olá! Eu sou seu especialista em química quântica. Posso ajudar você a entender as propriedades dos elementos, calcular energias de ligação e prever interações moleculares. O que você gostaria de saber?"
        generatePrompt={generateElementPrompt}
        autoSpeak={true}
      />
    </div>
  );
}
