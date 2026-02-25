import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, AlertCircle, CheckCircle2, X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { getDirectImageUrl } from '../utils/imageUtils';

const DataTable = ({ data }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'Date', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const itemsPerPage = 10;

    const sortedData = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = (key) => {
        setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <div className="w-3 h-3 inline-block ml-1 opacity-20" />;
        return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 inline-block ml-1 text-primary" /> : <ChevronDown className="w-3 h-3 inline-block ml-1 text-primary" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Detailed Logs</h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{data.length} entries</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {['Date', 'Time', 'Shift', 'Category', 'Particulars', 'Description', 'Status', 'Remarks', 'User', 'Proof'].map((head, i) => {
                                const key = ['Date', 'Time', 'Shift', 'Category', 'Particulars', 'Description', 'Dropdown', 'Remarks', 'Created By', 'Images'][i];
                                return (
                                    <th
                                        key={key}
                                        onClick={() => requestSort(key)}
                                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors select-none"
                                    >
                                        <div className="flex items-center gap-1">{head} <SortIcon column={key} /></div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                        {currentData.length > 0 ? (
                            currentData.map((row, index) => (
                                <tr
                                    key={index}
                                    className={clsx(
                                        "transition-all duration-200 group",
                                        row.Dropdown === 'No'
                                            ? "bg-red-50 border-l-4 border-red-500 hover:bg-red-100/50"
                                            : "hover:bg-slate-50 border-l-4 border-transparent"
                                    )}
                                >
                                    <td className={clsx("px-6 py-4 whitespace-nowrap text-sm font-medium", row.Dropdown === 'No' ? "text-red-900" : "text-slate-700")}>
                                        {typeof row.Date === 'object' ? new Date(row.Date).toLocaleDateString() : row.Date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{row.Time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-200">
                                            {row.Shift}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{row.Category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{row.Particulars}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:z-10 relative">
                                        {row.Description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                                            row.Dropdown === 'No'
                                                ? "bg-red-100 text-red-700 border-red-200"
                                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        )}>
                                            {row.Dropdown === 'No' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {row.Dropdown === 'No' ? 'Fail' : 'Pass'}
                                        </span>
                                    </td>
                                    <td className={clsx("px-6 py-4 text-sm max-w-xs truncate", row.Dropdown === 'No' ? "text-red-700 font-bold" : "text-slate-500")}>
                                        {row.Remarks}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {row['Created By'] ? row['Created By'].charAt(0) : 'U'}
                                            </div>
                                            {row['Created By']}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {row.Images ? (
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        const directUrl = getDirectImageUrl(row.Images);
                                                        console.log('Selected Image Data:', { original: row.Images, direct: directUrl });
                                                        setSelectedImage(row.Images);
                                                    }}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors pointer-events-auto"
                                                    title="View Preview"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </button>
                                                <a
                                                    href={getDirectImageUrl(row.Images)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                                                    title="Open Original"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ) : '-'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                                            <AlertCircle className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-medium">No records found matching filters</p>
                                        <p className="text-xs mt-1">Try adjusting the date range or clearing filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/20"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                            <a
                                href={getDirectImageUrl(selectedImage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center gap-1 px-3"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-xs font-bold">Open Full Screen</span>
                            </a>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2">
                            <img
                                src={getDirectImageUrl(selectedImage)}
                                alt="Proof"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
