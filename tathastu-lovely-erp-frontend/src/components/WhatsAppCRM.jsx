import { useEffect, useState } from 'react';
import axios from 'axios';

export default function WhatsAppCRM() {
  const [leads, setLeads] = useState([]);
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [billData, setBillData] = useState({ itemName: '', basePrice: 0, customizationFee: 0, isGst: true });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // NEW: Aria Agent States
  const [ariaLoadingId, setAriaLoadingId] = useState(null);
  const [ariaDraft, setAriaDraft] = useState({ id: null, text: '' });

  useEffect(() => {
    axios.get('http://localhost:8080/api/leads/all').then(res => setLeads(res.data)).catch(console.error);
  }, []);

  const handleGenerateBill = async (lead) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/invoices/generate', {
        customerName: lead.customerName,
        phoneNumber: lead.phoneNumber,
        itemName: billData.itemName,
        basePrice: parseFloat(billData.basePrice || 0),
        customizationFee: parseFloat(billData.customizationFee || 0),
        isGst: billData.isGst 
      });
      setGeneratedInvoice(res.data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  // NEW: Trigger Aria's Sales Brain
  const handleAriaDraft = async (lead) => {
    setAriaLoadingId(lead.id);
    try {
      const res = await axios.post('http://localhost:8080/api/agents/aria/draft', {
        name: lead.customerName,
        summary: lead.chatSummary,
        score: lead.aiLeadScore
      });
      setAriaDraft({ id: lead.id, text: res.data.draft });
    } catch (error) {
      console.error(error);
      setAriaDraft({ id: lead.id, text: "Hey! Just checking in to see if you had any more questions about our custom art collection? 😊" });
    }
    setAriaLoadingId(null);
  };

  const currentSubtotal = parseFloat(billData.basePrice || 0) + parseFloat(billData.customizationFee || 0);
  const currentTax = billData.isGst ? currentSubtotal * 0.18 : 0;
  const currentTotal = currentSubtotal + currentTax;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Inbox with Aria Integration */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Active Conversations</h2>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">Aria Sales Agent Enabled</span>
          </div>

          {leads.map(lead => (
            <div 
              key={lead.id} 
              onClick={() => { setActiveLeadId(lead.id); setGeneratedInvoice(null); setAriaDraft({ id: null, text: '' }); }} 
              className={`group p-6 border rounded-[2rem] cursor-pointer transition-all duration-500 ${activeLeadId === lead.id ? 'bg-white border-indigo-300 shadow-2xl ring-4 ring-indigo-50' : 'bg-white/60 border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${activeLeadId === lead.id ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-100 text-slate-400'}`}>
                    {lead.customerName ? lead.customerName.charAt(0) : '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.customerName}</h3>
                    <p className="text-[11px] font-bold font-mono text-slate-400 tracking-wider">{lead.phoneNumber}</p>
                  </div>
                </div>
                
                {/* Intent Badge */}
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${lead.aiLeadScore > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                   Intent: {lead.aiLeadScore}%
                </div>
              </div>

              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-slate-700 italic text-sm leading-relaxed mb-4">
                "{lead.chatSummary}"
              </div>

              {/* ARIA AGENT ACTION */}
              <div className="pt-2">
                {ariaDraft.id === lead.id ? (
                  <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg animate-in zoom-in-95 duration-300 relative">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-80 flex items-center gap-2">
                      <span>✨ Aria's Personal Draft</span>
                      <button onClick={(e) => { e.stopPropagation(); setAriaDraft({ id: null, text: '' }); }} className="ml-auto text-lg leading-none">&times;</button>
                    </div>
                    <p className="text-sm font-medium italic leading-relaxed">"{ariaDraft.text}"</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/${lead.phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(ariaDraft.text)}`, '_blank');
                      }}
                      className="mt-4 w-full bg-white text-indigo-700 font-bold text-xs py-2 rounded-xl hover:bg-indigo-50 transition shadow-md"
                    >
                      🚀 Send via WhatsApp
                    </button>
                  </div>
                ) : (
                  <button 
                    disabled={ariaLoadingId === lead.id}
                    onClick={(e) => { e.stopPropagation(); handleAriaDraft(lead); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600 bg-white border border-indigo-200 px-4 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {ariaLoadingId === lead.id ? (
                      <><span className="w-3 h-3 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></span> Thinking...</>
                    ) : (
                      <>✨ Generate Aria Response</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Premium Billing Panel */}
        <div className="lg:col-span-5">
          {activeLeadId && !generatedInvoice && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 sticky top-28 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3">
                  <span className="bg-slate-100 w-10 h-10 rounded-xl flex items-center justify-center">💳</span> 
                  Billing
                </h3>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase cursor-pointer bg-slate-50 px-4 py-2 rounded-full border border-slate-100 hover:bg-indigo-50 transition">
                  <input type="checkbox" checked={billData.isGst} onChange={e => setBillData({...billData, isGst: e.target.checked})} className="w-4 h-4 accent-indigo-600 rounded" />
                  Apply GST
                </label>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Order Item</label>
                  <input type="text" placeholder="e.g. Anniversary Resin Frame" className="w-full border-slate-200 rounded-2xl p-4 bg-slate-50/50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" onChange={e => setBillData({...billData, itemName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Base Price</label>
                    <input type="number" placeholder="0" className="w-full border-slate-200 rounded-2xl p-4 bg-slate-50/50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" onChange={e => setBillData({...billData, basePrice: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Custom Fee</label>
                    <input type="number" placeholder="0" className="w-full border-slate-200 rounded-2xl p-4 bg-slate-50/50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" onChange={e => setBillData({...billData, customizationFee: e.target.value})} />
                  </div>
                </div>
                
                <div className="bg-slate-900 p-6 rounded-3xl mt-8 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl italic font-black">$$$</div>
                  <div className="space-y-2 mb-4 relative z-10">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest"><span>Subtotal</span> <span>₹{currentSubtotal.toFixed(2)}</span></div>
                    {billData.isGst && <div className="flex justify-between text-xs font-black text-emerald-400 uppercase tracking-widest"><span>GST (18%)</span> <span>+ ₹{currentTax.toFixed(2)}</span></div>}
                  </div>
                  <div className="flex justify-between text-3xl font-black text-white border-t border-slate-800 pt-4 relative z-10">
                    <span className="text-sm font-bold text-slate-500 self-center uppercase">Total</span> 
                    <span>₹{currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleGenerateBill(leads.find(l => l.id === activeLeadId))} 
                  disabled={loading} 
                  className="w-full bg-indigo-600 text-white font-black rounded-2xl p-5 hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 mt-4 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      GENERATING...
                    </span>
                  ) : '⚡️ GENERATE INVOICE LINK'}
                </button>
              </div>
            </div>
          )}

          {!activeLeadId && (
            <div className="h-96 flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-100 rounded-[3rem]">
              <span className="text-6xl mb-4 grayscale opacity-30">👈</span>
              <p className="font-black uppercase tracking-widest text-sm">Select a lead to begin billing</p>
            </div>
          )}

          {generatedInvoice && (
             <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2.5rem] text-center shadow-xl animate-in zoom-in-95">
               <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 text-3xl">✅</div>
               <h4 className="font-black text-2xl text-emerald-900 mb-2 uppercase tracking-tighter">Invoice Ready</h4>
               <p className="text-emerald-700/80 text-sm mb-6 font-medium leading-relaxed">
                  Sent to <span className="font-bold">{generatedInvoice.customerName}</span>. 
                  Total amount: <span className="font-black">₹{generatedInvoice.totalAmount.toFixed(2)}</span>
               </p>
               <button onClick={() => setGeneratedInvoice(null)} className="w-full bg-emerald-600 text-white font-black rounded-2xl p-4 shadow-lg hover:bg-emerald-700 transition active:scale-95">CLOSE</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}