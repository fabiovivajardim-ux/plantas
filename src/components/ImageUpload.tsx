import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center cursor-pointer transition-all hover:border-emerald-500 hover:bg-emerald-50/30",
            isAnalyzing && "opacity-50 pointer-events-none"
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="text-emerald-700 w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-medium mb-2">Snap a photo of your plant</h3>
          <p className="text-stone-500 text-sm">Upload or drag and drop an image to identify and get care tips</p>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden shadow-lg group">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={clearImage}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-colors"
            >
              <X className="text-white w-6 h-6" />
            </button>
          </div>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
              <p className="font-medium tracking-wide">Analyzing your plant...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
