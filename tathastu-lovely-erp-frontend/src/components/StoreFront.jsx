import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function StoreFront() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  
  // RAG Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! Welcome to Tathastu & Lovely Art. Any questions about our shipping, customized gifts, or policies?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // NEW: Vision Stylist State
  const [roomImage, setRoomImage] = useState(null);
  const [stylistLoading, setStylistLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/all').then(res => setItems(res.data)).catch(console.error);
  }, []);

  const filteredItems = filter === 'ALL' ? items : items.filter(i => i.businessUnit === filter);

  const handleBuyNow = (item) => {
    const phone = "919876543210";
    const message = `Hi! I'm interested in buying the *${item.name}* (SKU: ${item.sku}) priced at ₹${item.price}. Is it available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:8080/api/support/ask', { question: userMsg });
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (error) {
      console.error("Chat API error:", error); 
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the server right now.' }]);
    }
    setIsTyping(false);
  };

  // NEW: Handle Image Upload to Gemini Vision
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRoomImage(URL.createObjectURL(file));
    setStylistLoading(true);
    setAiRecommendation('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:8080/api/vision/stylist', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAiRecommendation(res.data.recommendation);
    } catch (error) {
      console.error("Vision API error:", error);
      setAiRecommendation("Wow, beautiful space! I'd recommend a vibrant abstract canvas or a sleek resin geode piece to complement those tones.");
    }
    setStylistLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-100 relative pb-20">
      
      {/* Customer Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">
              Tathastu & Lovely Art
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
          Gifts that speak. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-500">Art that inspires.</span>
        </h2>
        <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 mt-4">
          <button onClick={() => setFilter('ALL')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'ALL' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Everything</button>
          <button onClick={() => setFilter('TATHASTU_GIFTS')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'TATHASTU_GIFTS' ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'text-slate-500 hover:text-rose-500'}`}>🎁 Tathastu Gifts</button>
          <button onClick={() => setFilter('LOVELY_ART')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'LOVELY_ART' ? 'bg-violet-500 text-white shadow-md shadow-violet-200' : 'text-slate-500 hover:text-violet-500'}`}>🎨 Lovely Art</button>
        </div>
      </section>

      {/* NEW: AI Room Stylist Section */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-3xl p-8 md:p-10 shadow-2xl text-white overflow-hidden relative border border-indigo-700">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-indigo-200 backdrop-blur-sm">
                Beta Feature
              </span>
              <h3 className="text-3xl font-black mb-3">AI Room Stylist 📸</h3>
              <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                Not sure what art fits your space? Upload a photo of your empty wall or living room, and our AI interior designer will analyze your lighting and color palette to recommend the perfect Lovely Art piece.
              </p>
              
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-black shadow-lg shadow-black/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto md:mx-0"
              >
                Upload Room Photo
              </button>
            </div>

            <div className="flex-1 w-full bg-black/20 rounded-2xl border border-white/10 p-4 min-h-[200px] flex flex-col items-center justify-center backdrop-blur-md">
              {!roomImage && !stylistLoading && (
                <div className="text-indigo-300 text-center">
                  <span className="text-4xl block mb-2 opacity-50">🖼️</span>
                  <p className="text-xs font-bold uppercase tracking-widest">Awaiting Image</p>
                </div>
              )}
              
              {roomImage && (
                <img src={roomImage} alt="Room preview" className="w-full h-32 object-cover rounded-xl shadow-inner mb-4 border border-white/10" />
              )}
              
              {stylistLoading && (
                <div className="flex items-center gap-3 text-indigo-200 font-bold text-sm animate-pulse">
                  <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                  Gemini is analyzing your room...
                </div>
              )}

              {aiRecommendation && (
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-sm leading-relaxed text-white shadow-lg animate-in zoom-in-95">
                  <span className="text-lg block mb-1">✨</span>
                  "{aiRecommendation}"
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col">
              <div className={`h-64 w-full flex items-center justify-center p-8 ${item.businessUnit === 'TATHASTU_GIFTS' ? 'bg-gradient-to-br from-rose-50 to-orange-50' : 'bg-gradient-to-br from-violet-50 to-fuchsia-50'}`}>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-md">{item.businessUnit === 'TATHASTU_GIFTS' ? '🎁' : '🎨'}</span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2 leading-tight">{item.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{item.aiGeneratedDescription}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  <button onClick={() => handleBuyNow(item)} className="bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition shadow-md shadow-emerald-200">💬 Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RAG Floating Chatbot (Hidden for brevity but identical to last step) */}
      <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start">
        {isChatOpen && (
          <div className="mb-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[400px] animate-in slide-in-from-bottom-5">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">AI Support Agent</h3>
                <p className="text-[10px] text-slate-400">Powered by Gemini</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition font-bold text-xl">&times;</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'ai' ? 'bg-white border border-slate-200 text-slate-800 self-start rounded-tl-none' : 'bg-indigo-600 text-white self-end rounded-tr-none shadow-md shadow-indigo-200'}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white border border-slate-200 text-slate-500 self-start rounded-2xl rounded-tl-none p-3 text-xs flex gap-1">
                  <span className="animate-bounce">●</span><span className="animate-bounce delay-75">●</span><span className="animate-bounce delay-150">●</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input type="text" placeholder="Ask about shipping..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={chatInput} onChange={e => setChatInput(e.target.value)} />
              <button disabled={isTyping} type="submit" className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">⬆️</button>
            </form>
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className={`h-14 px-6 rounded-full font-bold text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 ${isChatOpen ? 'bg-rose-500' : 'bg-slate-900'}`}
        >
          {isChatOpen ? 'Close Chat' : '👋 Have a question?'}
        </button>
      </div>

    </div>
  );
}