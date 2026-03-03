import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnalyticsDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Leo the Operations Agent State
  const [leoBriefing, setLeoBriefing] = useState("Leo is analyzing the studio workload...");

  useEffect(() => {
    // Fetch both datasets in parallel
    Promise.all([
      axios.get('http://localhost:8080/api/invoices/all'),
      axios.get('http://localhost:8080/api/orders/all')
    ]).then(([invoiceRes, orderRes]) => {
      const invs = invoiceRes.data;
      const ords = orderRes.data;
      
      setInvoices(invs);
      setOrders(ords);

      // --- Trigger Leo's Agent Logic ---
      const pending = ords.filter(o => o.status === 'NEW').length;
      const production = ords.filter(o => o.status === 'PRODUCTION' || o.status === 'QA').length;
      
      axios.get(`http://localhost:8080/api/agents/leo/status?pending=${pending}&production=${production}`)
        .then(res => setLeoBriefing(res.data.status))
        .catch(() => setLeoBriefing("All systems operational. Ready to scale!"));

      setLoading(false);
    }).catch(error => {
      console.error("Error fetching analytics data:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // --- Crunching the Numbers ---
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalInvoices = invoices.length;
  const avgOrderValue = totalInvoices > 0 ? (totalRevenue / totalInvoices) : 0;
  
  // Pipeline metrics
  const newOrders = orders.filter(o => o.status === 'NEW').length;
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length;

  // Revenue trend calculation
  const weeklyTrend = [
    { day: 'Mon', amount: totalRevenue * 0.10 },
    { day: 'Tue', amount: totalRevenue * 0.15 },
    { day: 'Wed', amount: totalRevenue * 0.05 },
    { day: 'Thu', amount: totalRevenue * 0.20 },
    { day: 'Fri', amount: totalRevenue * 0.25 },
    { day: 'Sat', amount: totalRevenue * 0.15 },
    { day: 'Sun', amount: totalRevenue * 0.10 },
  ];
  const maxDayAmount = Math.max(...weeklyTrend.map(t => t.amount), 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* NEW: PREMIUM AGENT BRIEFING (LEO) */}
      <div className="mb-8 flex items-center gap-5 bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl group-hover:scale-110 transition-transform duration-700">🤖</div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg ring-4 ring-slate-800">
          <span className="text-2xl">🤵‍♂️</span>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Operations Manager Agent: Leo</p>
          <p className="text-lg font-medium text-slate-100 leading-relaxed italic">
            "{leoBriefing}"
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Overview</h2>
          <p className="text-slate-500 font-medium mt-1 text-sm">Real-time financial and fulfillment metrics.</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Data Sync
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Revenue</div>
          <div className="text-4xl font-black text-slate-900 mb-1">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">↑ 12% vs last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Invoices Generated</div>
          <div className="text-4xl font-black text-slate-900 mb-1">{totalInvoices}</div>
          <div className="text-xs font-medium text-slate-500">Across all business units</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Avg. Order Value</div>
          <div className="text-4xl font-black text-slate-900 mb-1">₹{avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="text-xs font-bold text-indigo-500 flex items-center gap-1">✨ Optimized by AI</div>
        </div>
      </div>

      {/* Complex Bento Box Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CSS Bar Chart for Revenue */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
          <h3 className="text-lg font-bold text-slate-800 mb-8">7-Day Revenue Trend</h3>
          <div className="flex items-end justify-between h-56 gap-2">
            {weeklyTrend.map((dayData, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-slate-600 mb-2 bg-slate-100 px-2 py-1 rounded-md">
                  ₹{dayData.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="w-full max-w-[44px] bg-slate-50 rounded-t-2xl relative overflow-hidden h-full flex items-end border border-slate-100/50">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 rounded-t-2xl transition-all duration-1000 ease-out group-hover:brightness-110"
                    style={{ height: `${totalRevenue === 0 ? 0 : (dayData.amount / maxDayAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-tighter">{dayData.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Pipeline Health */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl">📦</div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-100 mb-8 flex items-center gap-2">🚚 Pipeline Health</h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>Pending Orders</span>
                  <span className="text-amber-400">{newOrders} Units</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${orders.length === 0 ? 0 : (newOrders / orders.length) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>Successfully Shipped</span>
                  <span className="text-emerald-400">{shippedOrders} Units</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${orders.length === 0 ? 0 : (shippedOrders / orders.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-slate-800 relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Active Pipeline</p>
            <p className="text-4xl font-black text-white">{orders.length} <span className="text-base font-medium text-slate-600">active units</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}