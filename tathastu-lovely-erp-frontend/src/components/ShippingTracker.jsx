import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShippingTracker() {
  const [shippedOrders, setShippedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch orders that have actually been shipped
    axios.get('http://localhost:8080/api/orders/all')
      .then(res => setShippedOrders(res.data.filter(o => o.status === 'SHIPPED' && o.trackingId)))
      .catch(console.error);
  }, []);

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    setLoading(true);
    setTrackingInfo(null);
    try {
      const res = await axios.get(`http://localhost:8080/api/shipping/track/${order.trackingId}`);
      setTrackingInfo(res.data);
    } catch (error) {
      console.error("Error fetching tracking data", error);
    }
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🌍</span>
        <div>
          <h2 className="text-2xl font-black text-slate-800">AI Logistics Tracker</h2>
          <p className="text-slate-500 font-medium">Monitor active shipments and generate customer-friendly updates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List: Shipped Orders */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-[600px] overflow-y-auto">
          <h3 className="font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Dispatched Orders</h3>
          <div className="flex flex-col gap-3">
            {shippedOrders.map(order => (
              <div 
                key={order.id} 
                onClick={() => handleTrackOrder(order)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedOrder?.id === order.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
              >
                <h4 className="font-bold text-slate-900">{order.customerName}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-100 px-2 py-1 rounded-md">{order.shippingCompany}</span>
                  <span className="text-xs font-mono text-slate-500">{order.trackingId}</span>
                </div>
              </div>
            ))}
            {shippedOrders.length === 0 && (
              <p className="text-center text-slate-400 text-sm mt-10">No dispatched orders found.</p>
            )}
          </div>
        </div>

        {/* Right Panel: AI Tracking Info */}
        <div className="lg:col-span-8">
          {selectedOrder ? (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Tracking Overview</h3>
                  <p className="text-slate-500">AWB: <span className="font-mono text-slate-800 font-bold">{selectedOrder.trackingId}</span></p>
                </div>
                <span className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-xl text-sm animate-pulse">
                  🚚 IN TRANSIT
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-indigo-500 gap-4">
                  <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p className="font-bold animate-pulse">Gemini is translating raw courier logs...</p>
                </div>
              ) : trackingInfo ? (
                <div className="space-y-8 animate-in zoom-in-95 duration-300">
                  
                  {/* AI Generated Customer Update */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-8xl opacity-10">✨</div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">AI Customer Update</p>
                    <p className="text-lg text-indigo-900 leading-relaxed font-medium">"{trackingInfo.aiSummary}"</p>
                    <button 
                      onClick={() => {
                        const msg = `Hi ${selectedOrder.customerName}! Quick update on your order: ${trackingInfo.aiSummary}\n\nTrack it here: https://tathastu.com/track/${selectedOrder.trackingId}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="mt-6 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                      📲 Send Update to Customer
                    </button>
                  </div>

                  {/* Raw System Logs */}
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Raw Courier Logs</p>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto">
                      {trackingInfo.rawLogs.split('. ').map((log, i) => (
                        // FIXED: Replaced raw > with {">"}
                        <div key={i} className="mb-2">{">"} {log}</div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          ) : (
             <div className="h-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-500 font-medium">
                <span className="text-5xl mb-4">📦</span>
                Select a dispatched order to track.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}