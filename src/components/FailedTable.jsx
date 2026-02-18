import React from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const FailedTable = ({ data }) => {
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
                            {['Date', 'Shift', 'Particulars', 'Description', 'Remarks'].map((head) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FailedTable;
