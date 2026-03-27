import { useState, useEffect } from 'react';
import Inventory from './components/Inventory';
import WhatsAppCRM from './components/WhatsAppCRM';
import StoreFront from './components/StoreFront';
import OrderBoard from './components/OrderBoard';
import ShippingTracker from './components/ShippingTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Pre-loader Animation States
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    // 1. Smoothly fill the progress bar over 1 second
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    // 2. Trigger the heavy lift animation slightly after the bar fills
    const openTimer = setTimeout(() => setIsShopOpen(true), 1200);
    
    // 3. Remove from DOM
    const hideTimer = setTimeout(() => setHideLoader(true), 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(openTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const TABS = [
    { id: 'analytics', icon: '📊', label: 'Analytics', color: 'text-rose-600' },
    { id: 'inventory', icon: '📦', label: 'Inventory', color: 'text-indigo-600' },
    { id: 'whatsapp', icon: '💬', label: 'CRM', color: 'text-emerald-600' },
    { id: 'orders', icon: '🚚', label: 'Fulfillment', color: 'text-blue-600' },
    { id: 'tracking', icon: '🌍', label: 'Tracking', color: 'text-purple-600' },
  ];

  if (activeTab === 'storefront') {
    return (
      <div className="relative animate-in fade-in duration-500">
        <StoreFront />
        <button 
          onClick={() => setActiveTab('inventory')} 
          className="fixed bottom-8 right-8 group flex items-center gap-3 bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all duration-300 border border-slate-700 z-50"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">⬅️</span> 
          Back to Command Center
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 🛑 PREMIUM OBSIDIAN SHUTTER PRE-LOADER */}
      {!hideLoader && (
        <div 
          // Using a cubic-bezier transition makes it feel heavy at the start, then fast (like a real mechanical lift)
          className={`fixed inset-0 z-[100] flex flex-col justify-end transition-all duration-[1500ms] ease-[cubic-bezier(0.5,0,0.2,1)] ${
            isShopOpen ? '-translate-y-full opacity-90 shadow-[0_50px_100px_rgba(0,0,0,0.8)]' : 'translate-y-0 opacity-100'
          }`}
          style={{
            // Dark, subtle horizontal metallic etching
            backgroundColor: '#0f172a',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.01) 4px, rgba(255,255,255,0.01) 8px)`
          }}
        >
          {/* Center Brand Console */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className={`transition-all duration-1000 ${isShopOpen ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
              
              {/* Glowing AI Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)] backdrop-blur-sm">
                  <div className="absolute inset-0 rounded-2xl animate-pulse bg-indigo-500/20"></div>
                  <span className="text-4xl relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">✨</span>
                </div>
              </div>

              {/* Typography */}
              <h1 className="text-5xl font-black text-white tracking-tight text-center mb-2 drop-shadow-lg">
                ShopERP <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
              </h1>
              <p className="text-slate-400 font-medium tracking-[0.4em] text-xs uppercase text-center mb-12">
                Tathastu <span className="text-slate-600">|</span> Lovely Art Studio
              </p>

              {/* Sleek Progress Bar */}
              <div className="w-64 mx-auto flex flex-col gap-3">
                <div className="flex justify-between text-[10px] font-bold tracking-widest text-indigo-300/70 uppercase">
                  <span>System Init</span>
                  <span>{loadProgress}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-75 ease-out rounded-full relative"
                    style={{ width: `${loadProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Glowing Cyber-Edge Bottom */}
          <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] relative z-10"></div>
          <div className="h-8 bg-slate-950 w-full border-t border-slate-800/50 flex items-center justify-center shadow-2xl">
            {/* Subtle mechanical handle */}
            <div className="w-32 h-1.5 bg-slate-800 rounded-full"></div>
          </div>
        </div>
      )}

      {/* 🟢 MAIN APP CONTENT */}
      <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] font-sans text-slate-800 selection:bg-indigo-100">
        
        {/* Glassmorphism Header */}
        <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center overflow-x-auto no-scrollbar">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 shrink-0 mr-8">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-inner shadow-white/20">
                <span className="text-white font-black text-xl drop-shadow-md">✨</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  ShopERP <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Tathastu & Lovely Art
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 shrink-0">
              
              {/* Premium Segmented Control Tabs */}
              <div className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
                {TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)} 
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ease-out outline-none
                        ${isActive 
                          ? `bg-white ${tab.color} shadow-sm ring-1 ring-slate-200/50 scale-100` 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 scale-95 hover:scale-100'
                        }`}
                    >
                      <span className={`${isActive ? 'scale-110' : 'grayscale opacity-70'} transition-all duration-300`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              
              <div className="h-8 w-px bg-slate-200 rounded-full"></div>
              
              {/* Live Store CTA */}
              <button 
                onClick={() => setActiveTab('storefront')} 
                className="group px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-md shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span className="group-hover:rotate-12 transition-transform duration-300">🛍️</span> 
                View Live Store
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'whatsapp' && <WhatsAppCRM />}
          {activeTab === 'orders' && <OrderBoard />}
          {activeTab === 'tracking' && <ShippingTracker />}
        </main>
      </div>
    </>
  );
}