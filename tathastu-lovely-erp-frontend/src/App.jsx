import { useState, useEffect } from 'react';
import Inventory from './components/Inventory';
import WhatsAppCRM from './components/WhatsAppCRM';
import StoreFront from './components/StoreFront';
import OrderBoard from './components/OrderBoard';
import ShippingTracker from './components/ShippingTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // NEW: Pre-loader Animation States
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    // 1. Wait 1.2 seconds so the user can read the "Opening Shop" text
    const openTimer = setTimeout(() => setIsShopOpen(true), 1200);
    
    // 2. Wait 3.5 seconds total to completely remove the shutter from the DOM after the animation finishes
    const hideTimer = setTimeout(() => setHideLoader(true), 3500);

    return () => {
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
      {/* 🛑 NEW: REALISTIC SHOP SHUTTER PRE-LOADER */}
      {!hideLoader && (
        <div 
          className={`fixed inset-0 z-[100] flex flex-col justify-end transition-transform duration-[2000ms] ease-in-out ${isShopOpen ? '-translate-y-full' : 'translate-y-0'}`}
          style={{
            // This creates the realistic metallic horizontal ridges of a shop shutter
            background: 'repeating-linear-gradient(to bottom, #94a3b8, #94a3b8 20px, #cbd5e1 20px, #cbd5e1 22px, #64748b 22px, #64748b 24px)',
            boxShadow: 'inset 0 -30px 40px rgba(0,0,0,0.6)'
          }}
        >
          {/* Painted Sign on the Shutter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md px-12 py-10 rounded-[3rem] border border-slate-700 text-center shadow-2xl">
              <span className="text-7xl block mb-6 animate-bounce">🏪</span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-3">
                ShopERP <span className="text-indigo-500">AI</span>
              </h1>
              <p className="text-slate-300 font-bold tracking-[0.3em] text-xs uppercase mb-8">
                Tathastu & Lovely Art Studio
              </p>
              <div className="flex items-center justify-center gap-3 text-indigo-400 font-black tracking-widest text-sm animate-pulse">
                <span className="w-4 h-4 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                ROLLING UP SHUTTER...
              </div>
            </div>
          </div>

          {/* Heavy Bottom Bar of the Shutter */}
          <div className="h-16 bg-slate-800 border-t-4 border-slate-900 flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative z-10">
            {/* The Shutter Handle */}
            <div className="w-40 h-6 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center shadow-inner">
              <div className="w-32 h-2 bg-slate-950 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 MAIN APP CONTENT (Sits behind the shutter until it rolls up) */}
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