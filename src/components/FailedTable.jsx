import React, { useState } from 'react';
import { AlertCircle, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { getDirectImageUrl } from '../utils/imageUtils';

const FailedTable = ({ data }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    // Filter for failed records
    const failedData = data.filter(row => row.Dropdown === 'No');

    if (failedData.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-red-500/10 border border-red-100 overflow-hidden mb-8">
            <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-red-100 p-1.5 rounded-lg text-red-600">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-red-800">Critical Failures</h3>
                </div>
                <span className="text-xs font-bold text-red-600 bg-white border border-red-200 px-3 py-1 rounded-full shadow-sm">
                    {failedData.length} Incidents
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-red-100">
                    <thead className="bg-red-50/50">
                        <tr>
                            {['Date', 'Shift', 'Particulars', 'Description', 'Remarks', 'Proof'].map((head) => (
                                <th
                                    key={head}
                                    className="px-6 py-3 text-left text-xs font-bold text-red-700 uppercase tracking-wider select-none"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-red-50">
                        {failedData.map((row, index) => (
                            <tr
                                key={index}
                                className="group hover:bg-red-50/30 transition-colors"
                            >
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-700">
                                    {typeof row.Date === 'object' ? new Date(row.Date).toLocaleDateString() : row.Date}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold border border-slate-200">
                                        {row.Shift}
                                    </span>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-700 font-medium">
                                    {row.Particulars}
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-600 max-w-xs break-words">
                                    {row.Description}
                                </td>
                                <td className="px-6 py-3 text-sm font-bold text-red-600 max-w-xs break-words">
                                    {row.Remarks}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                                    {row.Images ? (
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => {
                                                    const directUrl = getDirectImageUrl(row.Images);
                                                    console.log('FailedTable Selected Image:', { original: row.Images, direct: directUrl });
                                                    setSelectedImage(row.Images);
                                                }}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors pointer-events-auto"
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                            <a
                                href={selectedImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center gap-1 px-3"
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

export default FailedTable;
