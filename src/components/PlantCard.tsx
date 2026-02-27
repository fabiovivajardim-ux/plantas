import React from 'react';
import { Droplets, Sun, Thermometer, Sprout, Info, AlertTriangle } from 'lucide-react';
import { PlantCareInfo } from '../services/geminiService';
import { motion } from 'motion/react';

interface PlantCardProps {
  info: PlantCareInfo;
}

export const PlantCard: React.FC<PlantCardProps> = ({ info }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden"
    >
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-emerald-600 font-medium text-sm uppercase tracking-widest mb-2 block">Identified Species</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-stone-900">{info.name}</h2>
            <p className="text-stone-400 italic font-serif text-lg mt-1">{info.scientificName}</p>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-full flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">Healthy Growth Plan</span>
          </div>
        </div>

        <p className="text-stone-600 leading-relaxed mb-10 text-lg">
          {info.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <CareItem 
            icon={<Droplets className="w-5 h-5 text-blue-500" />} 
            title="Watering" 
            description={info.watering} 
          />
          <CareItem 
            icon={<Sun className="w-5 h-5 text-amber-500" />} 
            title="Sunlight" 
            description={info.sunlight} 
          />
          <CareItem 
            icon={<Thermometer className="w-5 h-5 text-orange-500" />} 
            title="Temperature" 
            description={info.temperature} 
          />
          <CareItem 
            icon={<Info className="w-5 h-5 text-emerald-500" />} 
            title="Soil Type" 
            description={info.soil} 
          />
        </div>

        <div className="bg-stone-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h4 className="font-medium text-stone-900">Common Issues to Watch For</h4>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.commonIssues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-stone-600 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-stone-100 pt-8">
          <p className="text-stone-500 italic text-sm">
            <span className="font-bold text-emerald-700 not-italic mr-2">Fun Fact:</span>
            {info.funFact}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const CareItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex gap-4 p-4 rounded-2xl border border-stone-50 bg-stone-50/30">
    <div className="shrink-0 mt-1">{icon}</div>
    <div>
      <h4 className="font-medium text-stone-900 text-sm mb-1">{title}</h4>
      <p className="text-stone-500 text-sm leading-snug">{description}</p>
    </div>
  </div>
);
