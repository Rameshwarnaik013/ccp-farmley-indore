import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import KPICards from './components/KPICards';
import Filters from './components/Filters';
import DataTable from './components/DataTable';
import Charts from './components/Charts';
import { fetchCCPData } from './services/api';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    shift: '',
    category: '',
    dropdown: '',
    createdBy: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchCCPData();
      if (response.status === 'success') {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueValues = useMemo(() => {
    return {
      shifts: [...new Set(data.map(d => d.Shift))].filter(Boolean),
      categories: [...new Set(data.map(d => d.Category))].filter(Boolean),
      creators: [...new Set(data.map(d => d['Created By']))].filter(Boolean)
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Date Range Filter
      if (filters.startDate) {
        if (item.Date < filters.startDate) return false;
      }
      if (filters.endDate) {
        if (item.Date > filters.endDate) return false;
      }

      if (filters.shift && item.Shift !== filters.shift) return false;
      if (filters.category && item.Category !== filters.category) return false;
      if (filters.dropdown && item.Dropdown !== filters.dropdown) return false;
      if (filters.createdBy && item['Created By'] !== filters.createdBy) return false;

      return true;
    });
  }, [data, filters]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all-fast">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">CCP Monitor</h1>
            <p className="text-xs text-slate-500 font-medium">Critical Control Point Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadData}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <div className="hidden md:flex flex-col items-end">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Source</div>
            <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              Google Sheets
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8 max-w-[1920px] mx-auto w-full">
        {/* Sidebar Filters - Sticky on Desktop */}
        <aside className="xl:sticky xl:top-[100px] h-fit space-y-6">
          <Filters
            filters={filters}
            setFilters={setFilters}
            uniqueValues={uniqueValues}
          />
        </aside>

        {/* Dashboard Content */}
        <section className="space-y-8 min-w-0">
          <KPICards data={filteredData} />

          <Charts data={filteredData} />

          <DataTable data={filteredData} />
        </section>
      </main>
    </div>
  );
}

export default App;
