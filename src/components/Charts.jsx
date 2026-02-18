import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

// Global Chart Options for Cleaner Look
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: { family: "'Inter', sans-serif", size: 12 }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: "'Inter', sans-serif", size: 13 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { font: { family: "'Inter', sans-serif" } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: "'Inter', sans-serif" } } }
    }
};

const ChartCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="flex-1 min-h-[250px] relative">
            {children}
        </div>
    </div>
);

const Charts = ({ data }) => {
    const yesCount = data.filter(d => d.Dropdown === 'Yes').length;
    const noCount = data.filter(d => d.Dropdown === 'No').length;

    const complianceData = {
        labels: ['Compliant', 'Non-Compliant'],
        datasets: [{
            data: [yesCount, noCount],
            backgroundColor: ['#10b981', '#ef4444'], // Emerald-500, Red-500
            borderWidth: 0,
            hoverOffset: 4
        }],
    };

    // Sort categories by non-compliance count (High to Low)
    const categoryStats = [...new Set(data.map(d => d.Category))].map(cat => ({
        label: cat,
        count: data.filter(d => d.Category === cat && d.Dropdown === 'No').length
    })).sort((a, b) => b.count - a.count);

    const categoryData = {
        labels: categoryStats.map(s => `${s.label} (${s.count})`),
        datasets: [{
            label: 'Non-Compliance Count',
            data: categoryStats.map(s => s.count),
            backgroundColor: '#ef4444',
            borderRadius: 6,
            barThickness: undefined,
            maxBarThickness: 40,
        }],
    };

    const dates = [...new Set(data.map(d => d.Date))].sort();
    const trendCounts = dates.map(date =>
        data.filter(d => d.Date === date && d.Dropdown === 'No').length
    );

    const trendData = {
        labels: dates,
        datasets: [{
            label: 'Risk Trend',
            data: trendCounts,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#ef4444',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: true
        }],
    };

    const shifts = [...new Set(data.map(d => d.Shift))];
    const shiftYes = shifts.map(s => data.filter(d => d.Shift === s && d.Dropdown === 'Yes').length);
    const shiftNo = shifts.map(s => data.filter(d => d.Shift === s && d.Dropdown === 'No').length);

    const shiftData = {
        labels: shifts,
        datasets: [
            { label: 'Pass', data: shiftYes, backgroundColor: '#10b981', borderRadius: 4 },
            { label: 'Fail', data: shiftNo, backgroundColor: '#ef4444', borderRadius: 4 },
        ],
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Compliance Breakdown" icon={PieChart}>
                    <div className="relative h-[200px]">
                        <Doughnut data={complianceData} options={{ ...commonOptions, cutout: '70%', plugins: { ...commonOptions.plugins, legend: { display: false } } }} />
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold text-slate-800">{Math.round((yesCount / (yesCount + noCount || 1)) * 100)}%</span>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Compliant</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                <span className="text-sm font-semibold text-slate-700">Compliant</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-800">{yesCount.toLocaleString()}</div>
                                <div className="text-xs font-medium text-emerald-600">{((yesCount / (yesCount + noCount || 1)) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                                <span className="text-sm font-semibold text-slate-700">Non-Compliant</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-800">{noCount.toLocaleString()}</div>
                                <div className="text-xs font-medium text-red-600">{((noCount / (yesCount + noCount || 1)) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </ChartCard>

                <ChartCard title="Category Risks" icon={BarChart3}>
                    <Bar
                        data={categoryData}
                        options={{
                            ...commonOptions,
                            indexAxis: 'y',
                            scales: {
                                x: { grid: { color: '#f1f5f9' }, ticks: { font: { family: "'Inter', sans-serif" } } },
                                y: { grid: { display: false }, ticks: { autoSkip: false, font: { family: "'Inter', sans-serif", size: 11 } } }
                            }
                        }}
                    />
                </ChartCard>

                <ChartCard title="Risk Trend Analysis" icon={TrendingUp}>
                    <Line data={trendData} options={commonOptions} />
                </ChartCard>

                <ChartCard title="Shift Performance" icon={Activity}>
                    <Bar
                        data={shiftData}
                        options={{
                            ...commonOptions,
                            scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: '#f1f5f9' } } }
                        }}
                    />
                </ChartCard>
            </div>

            {/* Category Compliance Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {categoryStats.map(stat => {
                    const cat = stat.label;
                    const catTotal = data.filter(d => d.Category === cat).length;
                    const catNo = stat.count;
                    const catYes = catTotal - catNo;
                    const compliance = catTotal > 0 ? (catYes / catTotal) * 100 : 0;

                    let colorClass = "text-emerald-600 bg-emerald-50 border-emerald-100";
                    if (compliance < 80) colorClass = "text-red-600 bg-red-50 border-red-100";
                    else if (compliance < 95) colorClass = "text-amber-600 bg-amber-50 border-amber-100";

                    return (
                        <div key={cat} className={`p-4 rounded-xl border ${colorClass} flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-default`}>
                            <div className="text-sm font-medium opacity-80 mb-2 truncate" title={cat}>{cat}</div>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold">{compliance.toFixed(1)}%</span>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-black/5">
                                    {compliance < 100 ? 'Needs Attention' : 'Perfect'}
                                </span>
                            </div>
                            <div className="w-full bg-black/5 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${compliance}%`,
                                        backgroundColor: 'currentColor'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Charts;
