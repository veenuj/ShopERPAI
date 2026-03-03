import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderBoard() {
  const [orders, setOrders] = useState([]);
  
  // State for the shipping pop-up modal
  const [shippingModal, setShippingModal] = useState({ isOpen: false, orderId: null });
  const [shippingData, setShippingData] = useState({ company: 'Delhivery', trackingId: '' });

  const fetchOrders = () => {
    axios.get('http://localhost:8080/api/orders/all')
      .then(res => setOrders(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDragStart = (e, orderId) => { e.dataTransfer.setData('orderId', orderId); };
  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('orderId');
    
    // SAFETY CHECK: Prevent empty drops from crashing the logic
    if (!orderId) return; 

    // Intercept the drop if it's going to the SHIPPED column
    if (newStatus === 'SHIPPED') {
      setShippingModal({ isOpen: true, orderId: parseInt(orderId) });
      return;
    }

    setOrders(prev => prev.map(o => o.id === parseInt(orderId) ? { ...o, status: newStatus } : o));
    
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, newStatus, { 
        headers: { 'Content-Type': 'text/plain' } 
      });
    } catch (error) { 
      console.error("Failed to update order status:", error);
      fetchOrders(); 
    }
  };

  // Submit the shipping details to the backend endpoint
  const handleShipSubmit = async (e) => {
    e.preventDefault();
    const { orderId } = shippingModal;
    
    // SAFETY CHECK: Ensure tracking ID isn't completely blank
    if (!shippingData.trackingId.trim()) {
      alert("Please enter a tracking number!");
      return;
    }

    // Optimistic UI Update so Tathastu Gifts orders snap into place instantly
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'SHIPPED', shippingCompany: shippingData.company, trackingId: shippingData.trackingId } : o));
    
    // Close the modal immediately
    setShippingModal({ isOpen: false, orderId: null });

    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/ship`, {
        trackingId: shippingData.trackingId,
        shippingCompany: shippingData.company
      });
      // Force a fresh sync with the DB
      fetchOrders();
    } catch (error) { 
      console.error("Failed to save shipping details:", error);
      alert("Backend error! Make sure your Spring Boot server is running and the /ship endpoint compiled correctly.");
      fetchOrders(); 
    }
  };

  const COLUMNS = [
    { id: 'NEW', title: '📥 New Orders', bg: 'bg-slate-50', border: 'border-slate-200' },
    { id: 'PRODUCTION', title: '⚙️ In Production', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'QA', title: '🔎 Quality Check', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'SHIPPED', title: '🚚 Shipped', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  ];

  return (
    <div className="relative animate-in fade-in max-w-7xl mx-auto">
      
      {/* Shipping Modal Overlay */}
      {shippingModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleShipSubmit} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6">📦 Dispatch Order</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Courier Partner</label>
                <select className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 outline-none" value={shippingData.company} onChange={e => setShippingData({...shippingData, company: e.target.value})}>
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">Blue Dart</option>
                  <option value="IndiaPost">India Post</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tracking Number (AWB)</label>
                <input required autoFocus type="text" placeholder="e.g., DEL12345678" className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" value={shippingData.trackingId} onChange={e => setShippingData({...shippingData, trackingId: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShippingModal({ isOpen: false, orderId: null })} className="flex-1 bg-slate-100 text-slate-600 font-bold rounded-xl p-3 hover:bg-slate-200 transition">Cancel</button>
              <button type="submit" className="flex-1 bg-emerald-500 text-white font-bold rounded-xl p-3 hover:bg-emerald-600 transition shadow-lg shadow-emerald-200">Confirm Dispatch</button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Board Layout */}
      <h2 className="text-2xl font-black text-slate-800 mb-8">Fulfillment Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
        {COLUMNS.map(col => (
          <div key={col.id} onDrop={(e) => handleDrop(e, col.id)} onDragOver={handleDragOver} className={`rounded-3xl border ${col.border} ${col.bg} p-4 flex flex-col`}>
            <h3 className="font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200/50">{col.title}</h3>
            <div className="flex-1 flex flex-col gap-3">
              {orders.filter(o => o.status === col.id).map(order => (
                <div key={order.id} draggable onDragStart={(e) => handleDragStart(e, order.id)} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all">
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Order #{order.id}</div>
                  <h4 className="font-bold text-slate-900 leading-tight">{order.customerName}</h4>
                  <p className="text-sm text-slate-600 mt-1">{order.itemName}</p>
                  
                  {/* Render tracking badge if shipped */}
                  {order.status === 'SHIPPED' && order.trackingId && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="inline-flex flex-col">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">{order.shippingCompany}</span>
                        <span className="text-xs font-mono text-slate-500">{order.trackingId}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}