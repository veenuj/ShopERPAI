import { useState } from 'react';
import Inventory from './components/Inventory';
import WhatsAppCRM from './components/WhatsAppCRM';
import StoreFront from './components/StoreFront';
import OrderBoard from './components/OrderBoard';
import ShippingTracker from './components/ShippingTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  // FIXED: Only one initial state value
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Define tabs here for a much cleaner JSX return
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
        
        {/* Premium Floating Back Button */}
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
    // Added a subtle dot-grid background texture for that premium SaaS feel
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
  );
}