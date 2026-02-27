import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import KPICards from './components/KPICards';
import Filters from './components/Filters';
import DataTable from './components/DataTable';
import FailedTable from './components/FailedTable';
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
        if (response.data && response.data.length > 0) {
          console.log('DEBUG: First Row Keys:', Object.keys(response.data[0]));
          console.log('DEBUG: First Row Data:', response.data[0]);
        }
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

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleSendEmail = async () => {
    // 1. Capture Screenshot
    // We capture the 'root' element or the specific dashboard section
    // Let's assume the dashboard main content is wrapped in an ID. 
    // I will add ID="dashboard-content" to the main section below.
    setSendingEmail(true);

    // Dynamically import to avoid SSR issues if any, though standard import is fine for Vite
    const { captureScreenshot } = await import('./utils/screenshotUtils');
    const { sendScreenshotEmail } = await import('./services/emailService');

    const screenshot = await captureScreenshot('dashboard-content');

    if (screenshot) {
      const result = await sendScreenshotEmail(screenshot, recipientEmail);
      if (result.success) {
        alert('Email sent successfully!');
        setIsShareModalOpen(false);
      } else {
        alert('Failed to send email. Check console for details.');
        console.error(result.error);
      }
    } else {
      alert('Failed to capture screenshot.');
    }
    setSendingEmail(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <div id="dashboard-content" className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all-fast" data-html2canvas-ignore>
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
            {/* Share Button */}
            <button
              onClick={handleShareClick}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              Share Report
            </button>

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
          <aside className="xl:sticky xl:top-[100px] h-fit space-y-6" data-html2canvas-ignore>
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

            <FailedTable data={filteredData} />

            <DataTable data={filteredData} />
          </section>
        </main>

      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Share Dashboard Report</h2>
            <p className="text-sm text-slate-600 mb-4">
              Enter the email address where you'd like to send the screenshot of the current dashboard view.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="manager@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail || !recipientEmail}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingEmail ? 'Sending...' : 'Send Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
