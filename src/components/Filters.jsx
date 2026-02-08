import React from 'react';
import { Filter, Calendar, Layers, Clock, User, CheckSquare, X } from 'lucide-react';
import clsx from 'clsx';

const FilterGroup = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Icon className="w-4 h-4 text-primary" />
            {label}
        </div>
        {children}
    </div>
);

const SelectInput = ({ value, onChange, options, placeholder = "All" }) => (
    <div className="relative">
        <select
            className={clsx(
                "w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-2.5 transition-all shadow-sm hover:border-blue-300",
                value === "" ? "text-slate-400" : "text-slate-900 font-medium"
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);

const Filters = ({ filters, setFilters, uniqueValues }) => {
    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <Filter className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Filters</h3>
                        <p className="text-xs text-slate-400 font-medium">{activeFiltersCount} active</p>
                    </div>
                </div>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={() => setFilters({ startDate: '', endDate: '', shift: '', category: '', dropdown: '', createdBy: '' })}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <FilterGroup label="Date Range" icon={Calendar}>
                    <div className="flex gap-1 mb-2">
                        {[
                            { label: 'Today', days: 0 },
                            { label: 'Yesterday', days: 1 },
                            { label: 'Last 7 Days', days: 7 }
                        ].map(range => (
                            <button
                                key={range.label}
                                onClick={() => {
                                    const end = new Date();
                                    const start = new Date();
                                    if (range.label === 'Yesterday') {
                                        start.setDate(end.getDate() - 1);
                                        end.setDate(end.getDate() - 1);
                                    } else {
                                        start.setDate(end.getDate() - range.days + (range.days === 0 ? 0 : 1));
                                        // If today, start is today. If 7 days, start is today-6 to include today making 7 days.
                                        // Correction for "Past Week" usually means last 7 days including today? 
                                        // Let's stick to simple logic: 
                                        // Today: start=today, end=today
                                        // Yesterday: start=yesterday, end=yesterday
                                        // Last 7 Days: start=today-6, end=today
                                    }

                                    // Re-implementing logic cleanly inside
                                    const today = new Date();
                                    let sDate, eDate;

                                    if (range.label === 'Today') {
                                        sDate = today.toISOString().split('T')[0];
                                        eDate = today.toISOString().split('T')[0];
                                    } else if (range.label === 'Yesterday') {
                                        const y = new Date(today);
                                        y.setDate(y.getDate() - 1);
                                        sDate = y.toISOString().split('T')[0];
                                        eDate = y.toISOString().split('T')[0];
                                    } else if (range.label === 'Last 7 Days') {
                                        const last7 = new Date(today);
                                        last7.setDate(last7.getDate() - 6);
                                        sDate = last7.toISOString().split('T')[0];
                                        eDate = today.toISOString().split('T')[0];
                                    }

                                    setFilters(prev => ({ ...prev, startDate: sDate, endDate: eDate }));
                                }}
                                className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors font-medium"
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Start</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-all outline-none"
                                value={filters.startDate || ''}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">End</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-all outline-none"
                                value={filters.endDate || ''}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </FilterGroup>

                <FilterGroup label="Shift" icon={Clock}>
                    <SelectInput
                        value={filters.shift}
                        onChange={(val) => handleChange('shift', val)}
                        options={uniqueValues.shifts}
                        placeholder="All Shifts"
                    />
                </FilterGroup>

                <FilterGroup label="Category" icon={Layers}>
                    <SelectInput
                        value={filters.category}
                        onChange={(val) => handleChange('category', val)}
                        options={uniqueValues.categories}
                        placeholder="All Categories"
                    />
                </FilterGroup>

                <FilterGroup label="Status" icon={CheckSquare}>
                    <div className="flex gap-2">
                        {['Yes', 'No'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleChange('dropdown', filters.dropdown === status ? '' : status)}
                                className={clsx(
                                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all",
                                    filters.dropdown === status && status === 'Yes' ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500" :
                                        filters.dropdown === status && status === 'No' ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500" :
                                            "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </FilterGroup>

                <FilterGroup label="Created By" icon={User}>
                    <SelectInput
                        value={filters.createdBy}
                        onChange={(val) => handleChange('createdBy', val)}
                        options={uniqueValues.creators}
                        placeholder="All Users"
                    />
                </FilterGroup>
            </div>
        </div>
    );
};

export default Filters;
