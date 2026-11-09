import { useState } from 'react';
import { Plus, X, MessageSquareText, Truck, FileText } from 'lucide-react';
import { Link } from 'wouter';
import { useI18n } from '../lib/i18n';

export function FloatingStack() {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Buttons */}
      <div 
        inert={!expanded}
        className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom ${
          expanded ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <a 
          href="sms:+12393085789"
          className="flex items-center gap-3 bg-white text-action px-4 py-3 rounded-full shadow-lg hover:-translate-y-1 transition-transform border border-white/10"
        >
          <span className="text-sm font-medium whitespace-nowrap">{t('textUs')}</span>
          <div className="bg-white/10 p-1.5 rounded-full"><MessageSquareText size={16} /></div>
        </a>
        
        <Link href="/carriers">
          <div className="flex items-center gap-3 bg-accent text-white px-4 py-3 rounded-full shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
            <span className="text-sm font-bold whitespace-nowrap">{t('carrierSignup')}</span>
            <div className="bg-black/10 p-1.5 rounded-full"><Truck size={16} /></div>
          </div>
        </Link>
        
        <Link href="/quote">
          <div className="flex items-center gap-3 bg-action text-white px-4 py-3 rounded-full shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
            <span className="text-sm font-bold whitespace-nowrap">{t('quote')}</span>
            <div className="bg-black/20 p-1.5 rounded-full"><FileText size={16} /></div>
          </div>
        </Link>
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          expanded ? 'bg-white text-[#0A0E14]' : 'bg-primary text-white'
        }`}
        aria-label={t('actions')}
        aria-expanded={expanded}
      >
        {expanded ? <X size={24} /> : <Plus size={28} />}
      </button>
    </div>
  );
}
