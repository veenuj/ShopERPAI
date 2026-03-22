import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', stockQuantity: '', businessUnit: 'TATHASTU_GIFTS' });
  const [loading, setLoading] = useState(false);
  
  // NEW: Maya Marketing Agent State
  const [mayaLoadingId, setMayaLoadingId] = useState(null);
  const [marketingKits, setMarketingKits] = useState({});

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchItems = () => {
    axios.get(`${API_BASE}/api/inventory/all`)
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching items:", err));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/inventory/add`, formData);
      setFormData({ name: '', sku: '', price: '', stockQuantity: '', businessUnit: 'TATHASTU_GIFTS' });
      fetchItems(); 
    } catch (error) {
      console.error("Error adding product:", error);
    }
    setLoading(false);
  };

  // NEW: Ask Maya to generate content
  const handleAskMaya = async (item) => {
    setMayaLoadingId(item.id);
    try {
      const res = await axios.post(`${API_BASE}/api/agents/maya/market`, {
        name: item.name,
        description: item.aiGeneratedDescription,
        businessUnit: item.businessUnit
      });
      setMarketingKits(prev => ({ ...prev, [item.id]: res.data.marketingKit }));
    } catch (error) {
      console.error("Maya encountered an error:", error);
    }
    setMayaLoadingId(null);
  };

  const getBadgeStyle = (unit) => {
    if (unit === 'TATHASTU_GIFTS') return 'bg-rose-50 text-rose-600 border-rose-200';
    if (unit === 'LOVELY_ART') return 'bg-violet-50 text-violet-600 border-violet-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl">📦</div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-indigo-500">⚡️</span> Add Product via AI
          </h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            Connected to: {API_BASE.includes('localhost') ? 'Local Dev' : 'Production Cloud'}
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
            <input required placeholder="e.g., Resin Geode Art" className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SKU</label>
            <input required placeholder="ART-101" className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
            <input required placeholder="0.00" type="number" className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock</label>
            <input required placeholder="Qty" type="number" className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Store</label>
            <select className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none" value={formData.businessUnit} onChange={e => setFormData({...formData, businessUnit: e.target.value})}>
              <option value="TATHASTU_GIFTS">🎁 Tathastu Gifts</option>
              <option value="LOVELY_ART">🎨 Lovely Art Studio</option>
            </select>
          </div>
          <div className="md:col-span-12 mt-2">
            <button disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl p-4 hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2 active:scale-95 shadow-xl shadow-slate-200">
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Generating AI Description...</>
              ) : '✨ Generate Description & Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map(item => (
          <div key={item.id} className="group bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getBadgeStyle(item.businessUnit)}`}>
                  {item.businessUnit === 'TATHASTU_GIFTS' ? 'Tathastu Gifts' : 'Lovely Art'}
                </span>
                <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">#{item.sku}</span>
              </div>
              <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight">{item.name}</h3>
              <p className="text-slate-500 italic text-sm leading-relaxed mb-6">"{item.aiGeneratedDescription}"</p>
            </div>

            {/* Maya Marketing Expansion */}
            <div className="relative z-10">
              {marketingKits[item.id] ? (
                <div className="bg-fuchsia-50/50 border border-fuchsia-100 p-5 rounded-2xl mb-6 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-lg">👩‍💻</span> Maya's Marketing Kit
                    </span>
                    <button onClick={() => setMarketingKits(prev => ({...prev, [item.id]: null}))} className="text-fuchsia-400 hover:text-fuchsia-700 font-bold">&times;</button>
                  </div>
                  <pre className="text-xs font-medium text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {marketingKits[item.id]}
                  </pre>
                  <button 
                    onClick={() => navigator.clipboard.writeText(marketingKits[item.id])}
                    className="mt-4 text-[10px] font-black text-fuchsia-700 bg-fuchsia-100 px-4 py-2 rounded-lg uppercase tracking-wider hover:bg-fuchsia-200 transition-colors w-full"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              ) : (
                <button 
                  disabled={mayaLoadingId === item.id}
                  onClick={() => handleAskMaya(item)}
                  className="w-full mb-6 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 hover:border-fuchsia-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {mayaLoadingId === item.id ? (
                    <><span className="w-4 h-4 border-2 border-fuchsia-300 border-t-fuchsia-600 rounded-full animate-spin"></span> Maya is typing...</>
                  ) : (
                    <>✨ Ask Maya (Marketing Agent) to create Social Post</>
                  )}
                </button>
              )}

              <div className="flex justify-between items-end pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                  <span className="text-3xl font-black text-slate-900">₹{item.price}</span>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${item.stockQuantity < 10 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {item.stockQuantity} in stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
            <span className="text-6xl mb-4 block grayscale opacity-40">🤖</span>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No products found. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}