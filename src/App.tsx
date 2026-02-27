import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles, History, Settings, User, ArrowLeft, Trash2 } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { PlantCard } from './components/PlantCard';
import { ChatInterface } from './components/ChatInterface';
import { identifyPlant, PlantCareInfo } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [plantInfo, setPlantInfo] = useState<PlantCareInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'identify' | 'history'>('identify');
  const [history, setHistory] = useState<(PlantCareInfo & { id: number; timestamp: string })[]>([]);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    checkApiKey();
    fetchHistory();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const fetchHistory = () => {
    try {
      const savedHistory = localStorage.getItem('flora_care_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error("Failed to fetch history from localStorage", err);
    }
  };

  const handleImageSelect = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const info = await identifyPlant(base64);
      setPlantInfo(info);
      
      // Save to history (localStorage)
      const newItem = { ...info, id: Date.now(), timestamp: new Date().toISOString() };
      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('flora_care_history', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      setError("Failed to identify plant. Please try a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteHistoryItem = (id: number) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('flora_care_history', JSON.stringify(updatedHistory));
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-[#fdfcf9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl border border-stone-100 text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="text-emerald-700 w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-medium mb-4">API Key Required</h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            To use the advanced plant identification features, you need to select a Gemini API key from a paid Google Cloud project.
          </p>
          <button 
            onClick={handleOpenKeyDialog}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            Select API Key
          </button>
          <p className="mt-4 text-xs text-stone-400">
            Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">billing documentation</a> for more info.
          </p>
        </div>
      </div>
    );
  }

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
            <button 
              onClick={() => setView('identify')}
              className={view === 'identify' ? "text-emerald-600" : "hover:text-stone-900 transition-colors"}
            >
              Identify
            </button>
            <button 
              onClick={() => setView('history')}
              className={view === 'history' ? "text-emerald-600" : "hover:text-stone-900 transition-colors"}
            >
              My Garden
            </button>
            <a href="#" className="hover:text-stone-900 transition-colors">Community</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Guides</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-stone-400" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <AnimatePresence mode="wait">
          {view === 'identify' ? (
            <motion.div 
              key="identify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="max-w-3xl mx-auto text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Botanical Expert</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-medium text-stone-900 mb-6 leading-tight">
                  Grow your knowledge, <br />
                  <span className="italic text-emerald-700">one leaf at a time.</span>
                </h1>
                <p className="text-stone-500 text-lg md:text-xl leading-relaxed">
                  Identify thousands of plants instantly and get expert care instructions tailored to your specific species.
                </p>
              </div>

              <div className="space-y-12">
                <ImageUpload onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />

                {error && (
                  <div className="max-w-xl mx-auto bg-rose-50 text-rose-700 p-4 rounded-2xl text-center text-sm font-medium border border-rose-100">
                    {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {plantInfo && (
                    <PlantCard key={plantInfo.name} info={plantInfo} />
                  )}
                </AnimatePresence>
              </div>

              {!plantInfo && !isAnalyzing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                  <Feature 
                    icon={<History className="w-6 h-6 text-emerald-600" />}
                    title="Track History"
                    description="Keep a digital diary of all the plants you've identified and their growth progress."
                  />
                  <Feature 
                    icon={<Sparkles className="w-6 h-6 text-emerald-600" />}
                    title="Smart Diagnosis"
                    description="Our AI can detect common pests and diseases from a single photo."
                  />
                  <Feature 
                    icon={<Leaf className="w-6 h-6 text-emerald-600" />}
                    title="Expert Advice"
                    description="Get personalized watering schedules and sunlight requirements for every plant."
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="font-serif text-4xl font-medium text-stone-900">My Garden</h2>
                  <p className="text-stone-500 mt-2">Your collection of identified plants</p>
                </div>
                <button 
                  onClick={() => setView('identify')}
                  className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Identify
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[32px] border border-stone-100">
                  <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="text-stone-300 w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">Your garden is empty</h3>
                  <p className="text-stone-400 mb-6">Start identifying plants to see them here!</p>
                  <button 
                    onClick={() => setView('identify')}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all"
                  >
                    Identify my first plant
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-50 p-3 rounded-2xl">
                          <Leaf className="text-emerald-600 w-6 h-6" />
                        </div>
                        <button 
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-stone-300 hover:text-rose-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-serif text-2xl font-medium text-stone-900 mb-1">{item.name}</h3>
                      <p className="text-stone-400 italic text-sm mb-4">{item.scientificName}</p>
                      <p className="text-stone-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                        {item.description}
                      </p>
                      <button 
                        onClick={() => {
                          setPlantInfo(item);
                          setView('identify');
                        }}
                        className="w-full py-3 rounded-xl border border-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
                      >
                        View Care Guide
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-semibold text-white">FloraCare AI</span>
          </div>
          <p className="text-sm mb-8">Empowering gardeners with artificial intelligence.</p>
          <div className="flex justify-center gap-8 text-xs uppercase tracking-widest font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>

      <ChatInterface />
    </div>
  );
}

const Feature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-[32px] bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="font-serif text-xl font-medium text-stone-900 mb-3">{title}</h3>
    <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
  </div>
);
