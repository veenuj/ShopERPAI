import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', stockQuantity: '', businessUnit: 'TATHASTU_GIFTS' });
  const [loading, setLoading] = useState(false);

  const fetchItems = () => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => setItems(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/inventory/add', formData);
      setFormData({ name: '', sku: '', price: '', stockQuantity: '', businessUnit: 'TATHASTU_GIFTS' });
      fetchItems(); 
    } catch (error) {
      console.error("Error adding product", error);
    }
    setLoading(false);
  };

  const getBadgeStyle = (unit) => {
    if (unit === 'TATHASTU_GIFTS') return 'bg-rose-50 text-rose-600 border-rose-200';
    if (unit === 'LOVELY_ART') return 'bg-violet-50 text-violet-600 border-violet-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-indigo-500">⚡️</span> Add Product via AI
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
            <input required placeholder="e.g., Silk Scarf" className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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
            <button disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl p-4 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating Description...</>
              ) : 'Generate Description & Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(item.businessUnit)}`}>
                  {item.businessUnit === 'TATHASTU_GIFTS' ? 'Tathastu Gifts' : 'Lovely Art'}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">#{item.sku}</span>
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{item.name}</h3>
              <p className="text-slate-500 italic text-sm leading-relaxed">"{item.aiGeneratedDescription}"</p>
            </div>
            <div className="flex justify-between items-end mt-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${item.stockQuantity < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {item.stockQuantity} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center">
            <p className="text-slate-500 font-medium">No products found. Use the AI form above to generate your first item!</p>
          </div>
        )}
      </div>
    </div>
  );
}