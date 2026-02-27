import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles, History, Settings, User, ArrowLeft, Trash2, Key } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { PlantCard } from './components/PlantCard';
import { ChatInterface } from './components/ChatInterface';
import { identifyPlant, PlantCareInfo } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [plantInfo, setPlantInfo] = useState<PlantCareInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'identify' | 'history'>('identify');
  const [history, setHistory] = useState<(PlantCareInfo & { id: number; timestamp: string })[]>([]);
  const [manualKey, setManualKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('flora_api_key');
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    
    if (!envKey && !savedKey) {
      setHasApiKey(false);
    }
    fetchHistory();
  }, []);

  const saveKey = () => {
    if (manualKey.trim()) {
      localStorage.setItem('flora_api_key', manualKey.trim());
      setHasApiKey(true);
      window.location.reload(); // Recarrega para aplicar a chave
    }
  };

  const fetchHistory = () => {
    const saved = localStorage.getItem('flora_care_history');
    if (saved) setHistory(JSON.parse(saved));
  };

  const handleImageSelect = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const info = await identifyPlant(base64);
      setPlantInfo(info);
      const newItem = { ...info, id: Date.now(), timestamp: new Date().toISOString() };
      const updated = [newItem, ...history];
      setHistory(updated);
      localStorage.setItem('flora_care_history', JSON.stringify(updated));
    } catch (err: any) {
      console.error(err);
      setError(err.message === "API_KEY_MISSING" ? "Chave API faltando ou inválida." : "Erro ao identificar. Tente uma foto mais clara.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-[#fdfcf9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl border border-stone-100 text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Key className="text-emerald-700 w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-medium mb-4">Configuração Necessária</h2>
          <p className="text-stone-500 mb-8 text-sm">Cole sua chave do Google Gemini para começar a identificar plantas.</p>
          <input 
            type="password"
            value={manualKey}
            onChange={(e) => setManualKey(e.target.value)}
            placeholder="Cole sua API Key aqui..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 mb-4 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button onClick={saveKey} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all">
            Salvar e Começar
          </button>
        </div>
      </div>
    );
  }

  // ... (resto do código do App.tsx continua igual ao anterior)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('identify')}>
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-stone-900">FloraCare AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
            <button onClick={() => setView('identify')} className={view === 'identify' ? "text-emerald-600" : ""}>Identify</button>
            <button onClick={() => setView('history')} className={view === 'history' ? "text-emerald-600" : ""}>My Garden</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => { localStorage.removeItem('flora_api_key'); window.location.reload(); }} className="text-xs text-stone-400 hover:text-rose-500">Trocar Chave</button>
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-stone-400" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <AnimatePresence mode="wait">
          {view === 'identify' ? (
            <motion.div key="identify" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="font-serif text-5xl font-medium text-stone-900 mb-6 leading-tight">Identifique suas plantas.</h1>
                <p className="text-stone-500 text-lg">Tire uma foto para receber dicas de cuidado instantâneas.</p>
              </div>
              <ImageUpload onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
              {error && <div className="max-w-xl mx-auto mt-8 bg-rose-50 text-rose-700 p-4 rounded-2xl text-center text-sm border border-rose-100">{error}</div>}
              <AnimatePresence mode="wait">{plantInfo && <PlantCard key={plantInfo.name} info={plantInfo} />}</AnimatePresence>
            </motion.div>
          ) : (
            /* ... (código da View de History) ... */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {history.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
                  <h3 className="font-serif text-2xl font-medium">{item.name}</h3>
                  <button onClick={() => { setPlantInfo(item); setView('identify'); }} className="mt-4 text-emerald-600 text-sm font-medium">Ver Dicas</button>
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
      <ChatInterface />
    </div>
  );
}
