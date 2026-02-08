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

    const categories = [...new Set(data.map(d => d.Category))];
    const categoryNoCounts = categories.map(cat =>
        data.filter(d => d.Category === cat && d.Dropdown === 'No').length
    );

    const categoryData = {
        labels: categories,
        datasets: [{
            label: 'Non-Compliance Count',
            data: categoryNoCounts,
            backgroundColor: '#ef4444',
            borderRadius: 6,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ChartCard title="Compliance Breakdown" icon={PieChart}>
                <Doughnut data={complianceData} options={{ ...commonOptions, cutout: '70%' }} />
            </ChartCard>

            <ChartCard title="Category Risks" icon={BarChart3}>
                <Bar data={categoryData} options={commonOptions} />
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
    );
};

export default Charts;
