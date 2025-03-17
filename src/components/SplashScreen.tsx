import React, { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center z-50">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">BioSim Lab</h1>
      <div className="text-purple-300 text-xl md:text-2xl">Like Look Solutions</div>
      <div className="mt-8 animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>
  );
}